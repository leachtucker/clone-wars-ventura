import { createGlobalStyle } from 'styled-components';

const GlobalStyling = createGlobalStyle`
  /* Animations */
  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* CSS Reset */
  * {
    box-sizing: border-box;
  }
  
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  textarea {
    caret-color: transparent;
  }

  /* General Global Styles */
  html {
    font-size: 62.5%;
    /* defaults to 10px on most devices */
  }
  html, body, #root { height: 100% }
  body {
    font-family: -apple-system,BlinkMacSystemFont,'Inter','Helvetica Neue','Helvetica','Arial',sans-serif;
  }

  /* Mobile / iOS */
  html, body {
    overscroll-behavior: none;
  }
  body {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }
  /* dvh = the visible viewport once mobile browser chrome collapses;
     plain 100% above stays as the fallback for older browsers. */
  #root { height: 100dvh }
  @media (max-width: 768px) {
    /* iOS Safari auto-zooms (and stays zoomed) when a focused input's
       font-size is under 16px — most of this UI sits at 11-14px. */
    input, textarea {
      font-size: 16px !important;
    }
  }
`;

export default GlobalStyling;
