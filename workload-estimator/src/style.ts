export function loadUserStylesheet(shadowRoot: ShadowRoot, fallbackCss: string) {
  const userLink = document.querySelector('link[rel="stylesheet"][data-user-css]') as HTMLLinkElement | null;
  const style = document.createElement('style');

  if (userLink) {
    fetch(userLink.href)
      .then(res => res.text())
      .then(css => {
        style.textContent = css;
        shadowRoot.appendChild(style);
      })
      .catch(() => {
        style.textContent = fallbackCss;
        shadowRoot.appendChild(style);
      });
  } else {
    style.textContent = fallbackCss;
    shadowRoot.appendChild(style);
  }
}
