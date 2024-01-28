import Head from 'next/head';
import React from 'react';

type Props = {
  title?: string;
};

const Seo = ({ title }: Props) => {
  return (
    <Head>
      <title>{title} BAPLE</title>
      <meta property='og:title' content='Baple' />
      <meta
        property='og:description'
        content='교통약자를 위한 배리어프리 정보 플랫폼입니다'
      />
      <meta property='og:url' content='https://baple.vercel.app/' />
      <meta
        property='og:image'
        content='https://dummyimage.com/1200x400/b8b8b8/fff&text=BAPLE'
      />
    </Head>
  );
};

export default Seo;
