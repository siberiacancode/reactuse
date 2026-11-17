import { COOKIES } from '@/src/constants';

export const LogoScript = () => (
  <script
    // eslint-disable-next-line react/dom-no-dangerously-set-innerhtml
    dangerouslySetInnerHTML={{
      __html: `
      (function() {
        const getCookie = (name) => {
          const value = \`; \${document.cookie}\`;
          const parts = value.split(\`; \${name}=\`);
          if (parts.length === 2) return parts.pop().split(';').shift();
          return null;
        };

        const setCookie = (name, value) => {
          document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + '; path=/; samesite=Lax';
        };

        const isUwuRequested = new URLSearchParams(window.location.search).get('uwu') === 'true';
        const savedLogo = getCookie('${COOKIES.LOGO}');
        let logo = savedLogo === 'uwu' ? 'uwu' : 'classic';

        if (isUwuRequested) {
          logo = 'uwu';
          setCookie('${COOKIES.LOGO}', logo);
        }

        document.documentElement.classList.add(logo === 'classic' ? 'classic-logo' : 'uwu-logo');
      })();
    `
    }}
  />
);
