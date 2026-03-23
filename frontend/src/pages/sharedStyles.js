export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --blue-dark: #0d2a4a; --blue-mid: #1a5fa8; --blue-light: #3b9ee8;
    --blue-pale: #b3d8f5; --blue-mist: #f0f6fc; --white: #ffffff;
    --gray-100: #f8f9fa; --gray-300: #d4d8de; --gray-500: #8a9099; --gray-800: #1e2530;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--gray-800); overflow-x: hidden; }

  .app-nav { display: flex; justify-content: space-between; align-items: center; padding: 0.9rem 3rem; background: white; border-bottom: 1px solid var(--gray-300); position: sticky; top: 0; z-index: 50; }
  .app-nav-brand { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: var(--blue-dark); letter-spacing: -0.02em; cursor: pointer; }
  .app-nav-brand span { color: var(--blue-light); }
  .app-nav-right { display: flex; align-items: center; gap: 1.5rem; }
  .app-nav-user { display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; color: var(--gray-500); }
  .app-nav-avatar { width: 32px; height: 32px; background: var(--blue-mist); border: 1.5px solid var(--blue-pale); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 600; color: var(--blue-mid); flex-shrink: 0; }
  .app-nav-logout { background: none; border: 1px solid var(--gray-300); padding: 0.4rem 1rem; font-size: 0.8rem; color: var(--gray-500); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .app-nav-logout:hover { border-color: var(--blue-mid); color: var(--blue-mid); }
`;
