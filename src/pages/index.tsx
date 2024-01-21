import { Inter } from 'next/font/google';
import Seo from '@/components/layout/Seo';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import { useEffect, useState } from 'react';
import MostReviews from '@/components/home/MostReviews';
import MostBookmarks from '@/components/home/MostBookmarks';
import { Spacer } from '@nextui-org/react';
import Carousel from '@/components/common/Carousel';

const inter = Inter({ subsets: ['latin'] });

const imgList = [
  'https://viqpcjrcqjtetxqetmpo.supabase.co/storage/v1/object/public/review_images/1705164393565',
  'https://viqpcjrcqjtetxqetmpo.supabase.co/storage/v1/object/public/review_images/1705164394232',
];

const Home = () => {
  const { username, userId } = useSelector((state: RootState) => state.auth);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  return (
    <>
      {isLoaded && (
        <div className='container'>
          <Seo title='Home' />
        </div>
      )}
      <section className='mb-[80px]'>
        <Carousel
          slideData={imgList} // imgList가 없으면 빈배열
          slidesPerView={1} // 보여줄 슬라이스 수
          slideHeight={'700px'} // 캐러셀 높이
        />
      </section>
      <div className='flex flex-col w-full justify-center items-center'>
        <MostReviews />
        <Spacer y={10} />
        <MostBookmarks />
      </div>
    </>
  );
};

export default Home;
