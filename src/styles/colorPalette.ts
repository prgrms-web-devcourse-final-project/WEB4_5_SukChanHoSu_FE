import { css } from '@emotion/react';

export const colorPalette = css`
  :root {
    --red: #f44336;
    --blue: #2196f3;
    --greeen: #4caf50;
    --white: #fff;
    --black: #0a0a0a;
    --grey: #e5e5e5;
    --dark: #181818;
  }
`;

export const colors = {
  red: 'var(--red)',
  blue: 'var(--blue)',
  green: 'var(--green)',
  white: 'var(--white)',
  black: 'var(--black)',
  grey: 'var(--grey)',
  dark: 'var(--dark)',
};

export type Colors = keyof typeof colors;
