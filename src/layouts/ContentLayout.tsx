import { css } from '@emotion/react';
import { Flex } from 'antd';
import React from 'react';

function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      vertical={true}
      align="center"
      justify="space-between"
      css={css`
        width: 100%;
        flex: 1;
        max-width: 400px;
        height: calc(100vh - 120px);
        margin: 0 auto;
        overflow: scroll;
        padding: 0 16px;
      `}
    >
      {children}
    </Flex>
  );
}

export default ContentLayout;
