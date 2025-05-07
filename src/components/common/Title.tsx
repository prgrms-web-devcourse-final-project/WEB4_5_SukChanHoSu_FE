import React from 'react';
import styled from '@emotion/styled';

const TitleText = styled.h1`
  color: #1a1a1a;
  margin-bottom: 32px;
  font-size: 1.2rem;
  font-weight: bolder;
  text-align: start;
`;

function Title({ children }: { children: React.ReactNode }) {
  return <TitleText>{children}</TitleText>;
}

export default Title;
