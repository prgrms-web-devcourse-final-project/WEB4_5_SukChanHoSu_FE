import { css } from '@emotion/react';
import { Flex } from 'antd';
import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ContentLayout from './ContentLayout';
function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      vertical={true}
      align="center"
      justify="space-between"
      css={css`
        width: 100%;
        flex: 1;
        max-width: 400px;
        height: 100vh;
        margin: 0 auto;
        border: 1px solid #e8e8e8;
      `}
    >
      <Navbar />
      <ContentLayout>{children}</ContentLayout>
      <Footer />
    </Flex>
  );
}

export default DefaultLayout;
