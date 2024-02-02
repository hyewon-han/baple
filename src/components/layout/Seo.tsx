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
        content='이동약자에게 필요한 배리어 프리 장소 정보를 제공하는 웹 서비스입니다.'
      />
      <meta property='og:url' content='https://baple.vercel.app/' />
      <meta property='og:image' content='/images/baple_logo.png' />
    </Head>
  );
};

export default Seo;
