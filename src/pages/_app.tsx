import Layout from '@/components/Layout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Providers from './providers';
import { useRouter } from 'next/router';
import localFont from 'next/font/local';
import Script from 'next/script';

const nanumSquareRound = localFont({
  src: [
    {
      path: './fonts/NanumSquareRoundL.ttf',
      weight: '200', // font-extralight
      style: 'normal',
    },
    {
      path: './fonts/NanumSquareRoundR.ttf',
      weight: '400', // font-normal
      style: 'normal',
    },
    {
      path: './fonts/NanumSquareRoundB.ttf',
      weight: '700', // font-bold
      style: 'normal',
    },
    {
      path: './fonts/NanumSquareRoundEB.ttf',
      weight: '900', // font-black
      style: 'normal',
    },
  ],
  variable: '--font-nanum-square-round',
});

declare global {
  interface Window {
    Kakao: any;
  }
}

const kakaoInit = () => {
  // 페이지가 로드시 실행
  if (!window.Kakao.isInitialized())
    // 선언되지 않았을 때만 실행하도록 if문 추가
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_SHARE_KEY);
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  if (
    router.pathname === '/login' ||
    router.pathname === '/signup' ||
    router.pathname === '/update-password'
  ) {
    return (
      <main className={nanumSquareRound.className}>
        <Providers>
          <Component {...pageProps} />
          <Script
            src='https://developers.kakao.com/sdk/js/kakao.js'
            onLoad={kakaoInit}
          />
        </Providers>
      </main>
    );
  }
  return (
    <main className={nanumSquareRound.className}>
      <Providers>
        <Layout>
          <Component {...pageProps} />
          <Script
            src='https://developers.kakao.com/sdk/js/kakao.js'
            onLoad={kakaoInit}
          />
        </Layout>
      </Providers>
    </main>
  );
}
