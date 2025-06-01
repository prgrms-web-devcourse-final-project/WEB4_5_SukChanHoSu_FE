import { css } from '@emotion/react';

export default css`
  /* 모바일 친화적인 폰트 설정 */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  :root {
    --dimmed-zindex: 10;
    --alert-zindex: 11;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      sans-serif;

    /* 모바일 뷰포트 설정 */
    --vh: 1vh;
  }

  /* 기본 리셋 */
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  /* HTML5 display-role reset for older browsers */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }

  body {
    line-height: 1.6;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      sans-serif;
    background-color: #f5f5f5;
    color: #262626;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ol,
  ul {
    list-style: none;
  }

  blockquote,
  q {
    quotes: none;
  }

  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  button {
    background: inherit;
    border: none;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
    overflow: visible;
    cursor: pointer;
    font-family: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  /* 모바일 최적화 */
  html {
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    width: 100vw;
    min-height: 100vh;
    min-height: calc(var(--vh, 1vh) * 100);
    overflow-x: hidden;
  }

  /* 입력 요소 최적화 */
  input,
  textarea,
  select {
    font-family: inherit;
    font-size: 16px; /* iOS 줌 방지 */
  }

  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  /* 스크롤바 스타일링 */
  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  /* Ant Design 커스터마이징 */
  .ant-typography {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      sans-serif !important;
  }

  .ant-btn {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      sans-serif !important;
    font-weight: 500;
  }

  .ant-card {
    border-radius: 16px !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
    border: none !important;
  }

  .ant-rate {
    color: #faad14 !important;
  }

  .ant-tag {
    border-radius: 6px !important;
    font-weight: 500 !important;
  }

  /* 안전 영역 지원 */
  @supports (padding: max(0px)) {
    body {
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
  }

  /* 다크 모드 지원 */
  @media (prefers-color-scheme: dark) {
    body {
      background-color: #141414;
      color: #ffffff;
    }

    .ant-card {
      /* background-color: #1f1f1f !important; */
      border-color: #303030 !important;
    }
  }

  /* 모바일 반응형 */
  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }

    .ant-typography h1 {
      font-size: 24px !important;
    }

    .ant-typography h2 {
      font-size: 20px !important;
    }

    .ant-typography h3 {
      font-size: 18px !important;
    }

    .ant-typography h4 {
      font-size: 16px !important;
    }
  }

  /* 터치 최적화 */
  .ant-btn,
  .ant-card,
  [role='button'],
  button {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  /* 로딩 애니메이션 */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  .ant-modal-close-x {
    color: black;
  }

  .ant-modal-wrap {
    top: -66px !important;
  }
`;
