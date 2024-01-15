import Image from 'next/image';
import { Inter } from 'next/font/google';
import Seo from '@/components/layout/Seo';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import { useEffect, useState } from 'react';
import { getPlacesByReviewCount } from '@/apis/reviews';
import MostReviews from '@/components/home/MostReviews';
import MostBookmarks from '@/components/home/MostBookmarks';
import { Spacer } from '@nextui-org/react';

const inter = Inter({ subsets: ['latin'] });

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
          <span>{username}</span>
        </div>
      )}
      <div className='flex flex-col w-[100vw] justify-center items-center'>
        <MostReviews />
        <Spacer y={10} />
        <MostBookmarks />
      </div>
    </>
  );
};

export default Home;
