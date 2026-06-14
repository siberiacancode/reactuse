'use client';

import type { CSSProperties } from 'react';

import { useEffect, useRef } from 'react';

import { useTheme } from '@/app/_contexts/theme';

const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec3 backgroundColor;
uniform vec2 mousePos;
uniform float mouseRadius;
uniform float pixelSize;
uniform float colorNum;

vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
vec2 fade(vec2 t){return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi=floor(P.xyxy)+vec4(0.0,0.0,1.0,1.0);
  vec4 Pf=fract(P.xyxy)-vec4(0.0,0.0,1.0,1.0);
  Pi=mod289(Pi);
  vec4 ix=Pi.xzxz; vec4 iy=Pi.yyww;
  vec4 fx=Pf.xzxz; vec4 fy=Pf.yyww;
  vec4 i=permute(permute(ix)+iy);
  vec4 gx=fract(i*(1.0/41.0))*2.0-1.0;
  vec4 gy=abs(gx)-0.5;
  vec4 tx=floor(gx+0.5);
  gx=gx-tx;
  vec2 g00=vec2(gx.x,gy.x); vec2 g10=vec2(gx.y,gy.y);
  vec2 g01=vec2(gx.z,gy.z); vec2 g11=vec2(gx.w,gy.w);
  vec4 norm=taylorInvSqrt(vec4(dot(g00,g00),dot(g01,g01),dot(g10,g10),dot(g11,g11)));
  g00*=norm.x; g01*=norm.y; g10*=norm.z; g11*=norm.w;
  float n00=dot(g00,vec2(fx.x,fy.x));
  float n10=dot(g10,vec2(fx.y,fy.y));
  float n01=dot(g01,vec2(fx.z,fy.z));
  float n11=dot(g11,vec2(fx.w,fy.w));
  vec2 f=fade(Pf.xy);
  vec2 nx=mix(vec2(n00,n01),vec2(n10,n11),f.x);
  return 2.3*mix(nx.x,nx.y,f.y);
}

float fbm(vec2 p){
  float v=0.0; float amp=1.0; float freq=waveFrequency;
  for(int i=0;i<4;i++){ v+=amp*abs(cnoise(p)); p*=freq; amp*=waveAmplitude; }
  return v;
}

float pattern(vec2 p){
  vec2 p2=p-time*waveSpeed;
  return fbm(p+fbm(p2));
}

// 8x8 ordered Bayer threshold WITHOUT array indexing (WebGL1 / GLSL ES 1.00 safe).
// Classic recursive Bayer: interleave reversed bits of x and y over 3 levels.
float bayer8x8(vec2 c){
  float x = mod(c.x, 8.0);
  float y = mod(c.y, 8.0);
  float result = 0.0;
  float scale = 1.0;
  for (int i = 0; i < 3; i++) {
    float xb = mod(x, 2.0);
    float yb = mod(y, 2.0);
    // bit pattern: (yb XOR xb) low bit, xb high bit  -> matches 2x2 Bayer recursion
    float bit = 2.0 * mod(xb + yb, 2.0) + xb;
    // accumulate from most significant level downwards
    result += bit * scale;
    scale *= 4.0;
    x = floor(x / 2.0);
    y = floor(y / 2.0);
  }
  // result in [0,63] -> normalize to [0,1)
  return result / 64.0;
}

vec3 dither(vec2 frag, vec3 color){
  vec2 sc = floor(frag / pixelSize);
  float threshold = bayer8x8(sc) - 0.25;
  float stp = 1.0 / (colorNum - 1.0);
  color += threshold * stp;
  color = clamp(color - 0.2, 0.0, 1.0);
  return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
}

void main(){
  vec2 frag = floor(gl_FragCoord.xy / pixelSize) * pixelSize;
  vec2 uv = frag / resolution.xy;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;

  float f = pattern(uv);

  vec2 m = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
  m.x *= resolution.x / resolution.y;
  float d = length(uv - m);
  float effect = 1.0 - smoothstep(0.0, mouseRadius, d);
  f -= 0.5 * effect;

  vec3 col = mix(backgroundColor, waveColor, f);
  col = dither(gl_FragCoord.xy, col);
  gl_FragColor = vec4(col, 1.0);
}
`;

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('SHADER COMPILE ERROR:', gl.getShaderInfoLog(shader));
  }
  return shader;
};

const ANIMATION_DELAY_MS = 600;

interface DitherCanvasProps {
  backgroundColor: [number, number, number];
  staticBackground: CSSProperties['background'];
  waveColor: [number, number, number];
}

const DitherCanvas = ({ backgroundColor, staticBackground, waveColor }: DitherCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -10000, y: -10000 });
  const colorsRef = useRef({ backgroundColor, waveColor });
  colorsRef.current = { backgroundColor, waveColor };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: true });
    if (!gl) {
      console.error('WebGL not available');
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('PROGRAM LINK ERROR:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      resolution: gl.getUniformLocation(program, 'resolution'),
      time: gl.getUniformLocation(program, 'time'),
      waveSpeed: gl.getUniformLocation(program, 'waveSpeed'),
      waveFrequency: gl.getUniformLocation(program, 'waveFrequency'),
      waveAmplitude: gl.getUniformLocation(program, 'waveAmplitude'),
      waveColor: gl.getUniformLocation(program, 'waveColor'),
      backgroundColor: gl.getUniformLocation(program, 'backgroundColor'),
      mousePos: gl.getUniformLocation(program, 'mousePos'),
      mouseRadius: gl.getUniformLocation(program, 'mouseRadius'),
      pixelSize: gl.getUniformLocation(program, 'pixelSize'),
      colorNum: gl.getUniformLocation(program, 'colorNum')
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      // gasim effekt, esli kursor vne kanvasa
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        mouseRef.current = { x: -10000, y: -10000 };
        return;
      }
      mouseRef.current = {
        x: (e.clientX - rect.left) * dpr,
        y: (e.clientY - rect.top) * dpr
      };
    };
    window.addEventListener('pointermove', onPointerMove);

    let raf = 0;
    let animationDelay = 0;
    let animationStart = performance.now();
    let isAnimating = false;

    const drawFrame = (time: number) => {
      const { backgroundColor: bg, waveColor: wc } = colorsRef.current;

      gl.uniform2f(u.resolution, canvas.width, canvas.height);
      gl.uniform1f(u.time, time);
      gl.uniform1f(u.waveSpeed, 0.05);
      gl.uniform1f(u.waveFrequency, 3);
      gl.uniform1f(u.waveAmplitude, 0.3);
      gl.uniform3f(u.waveColor, wc[0], wc[1], wc[2]);
      gl.uniform3f(u.backgroundColor, bg[0], bg[1], bg[2]);
      gl.uniform2f(u.mousePos, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(u.mouseRadius, 0.6);
      gl.uniform1f(u.pixelSize, 2 * dpr);
      gl.uniform1f(u.colorNum, 4);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const getTime = () => (isAnimating ? (performance.now() - animationStart) * 0.001 : 0);

    const onResize = () => {
      resize();
      drawFrame(getTime());
    };
    window.addEventListener('resize', onResize);

    const render = () => {
      drawFrame(getTime());
      raf = requestAnimationFrame(render);
    };

    drawFrame(0);
    animationDelay = window.setTimeout(() => {
      isAnimating = true;
      animationStart = performance.now();
      render();
    }, ANIMATION_DELAY_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(animationDelay);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className='block size-full' style={{ background: staticBackground }} />
  );
};

export const LandingBackdrop = () => {
  const { value: theme } = useTheme();
  const isDark = theme === 'dark';

  const backgroundColor: [number, number, number] = isDark ? [0, 0, 0] : [1, 1, 1];
  const waveColor: [number, number, number] = isDark ? [0.45, 0.45, 0.45] : [0.6, 0.6, 0.6];
  const staticBackground = isDark
    ? 'radial-gradient(ellipse at 70% 45%, rgb(55 55 55 / 0.72), transparent 34%), radial-gradient(ellipse at 42% 62%, rgb(36 36 36 / 0.64), transparent 30%), #000'
    : 'radial-gradient(ellipse at 70% 45%, rgb(166 166 166 / 0.62), transparent 34%), radial-gradient(ellipse at 42% 62%, rgb(190 190 190 / 0.58), transparent 30%), #b8b8b8';

  return (
    <div className='absolute inset-0 opacity-90'>
      <DitherCanvas
        backgroundColor={backgroundColor}
        staticBackground={staticBackground}
        waveColor={waveColor}
      />
    </div>
  );
};
