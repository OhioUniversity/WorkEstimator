export function loadUserStylesheet(shadowRoot: ShadowRoot, fallbackCss: string) {
  const style = document.createElement('style');
  const userLink = document.querySelector(
    'link[rel="stylesheet"][data-user-css]'
  ) as HTMLLinkElement | null;

  // Try to fetch user.css from the href
  const cssPath = userLink?.href || './user.css';
  console.log(`Loading user stylesheet from: ${cssPath}`);

  fetch('./user.css')
    .then((res) => {
      if (!res.ok || !res.headers.get('content-type')?.includes('text/css')) {
        throw new Error('Invalid CSS response');
      }
      return res.text();
    })
    .then((css) => {
      style.textContent = css;
      shadowRoot.appendChild(style);
    })
    .catch(() => {
      style.textContent = fallbackCss;
      shadowRoot.appendChild(style);
    });
}
