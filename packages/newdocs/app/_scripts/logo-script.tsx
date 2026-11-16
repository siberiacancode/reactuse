import { COOKIES } from '@/src/constants';

export const LogoScript = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `
      (function() {
        const getCookie = (name) => {
          const value = \`; \${document.cookie}\`;
          const parts = value.split(\`; \${name}=\`);
          if (parts.length === 2) return parts.pop().split(';').shift();
          return null;
        };

        const logo = getCookie('${COOKIES.LOGO}') || 'uwu';
        document.documentElement.classList.add(logo === 'classic' ? 'classic-logo' : 'uwu-logo');
      })();
    `
    }}
  />
);
