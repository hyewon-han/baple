import Head from 'next/head';
import React from 'react';

type Props = {
  title: string;
};

const Seo = ({ title }: Props) => {
  return (
    <Head>
      <title>{title} | BAPLE</title>
    </Head>
  );
};

export default Seo;
