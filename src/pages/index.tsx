import { Inter } from 'next/font/google';
import Seo from '@/components/layout/Seo';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import { useEffect, useState } from 'react';
import MostReviews from '@/components/home/MostReviews';
import MostBookmarks from '@/components/home/MostBookmarks';
import { Button, Spacer } from '@nextui-org/react';
import Carousel from '@/components/common/Carousel';
import { getTopBookmarkedPlaces, getTopReviewedPlaces } from '@/apis/places';
import { PlacesForPlaceCard } from '@/types/types';
import TopButton from '@/components/common/TopButton';
import Image from 'next/image';
import MainWrapper from '@/components/layout/MainWrapper';

// const inter = Inter({ subsets: ['latin'] });

const imgList = [
  'https://dummyimage.com/1200x400/b8b8b8/fff&text=BAPLE',
  'https://dummyimage.com/1200x400/000000/fff&text=BAPLE',
  'https://dummyimage.com/1200x400/f0c518/000000&text=BAPLE',
];

interface Props {
  topBookmarked: PlacesForPlaceCard[];
  topReviewed: PlacesForPlaceCard[];
}

const Home = ({ topBookmarked, topReviewed }: Props) => {
  // const { username, userId } = useSelector((state: RootState) => state.auth);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  return (
    <div>
      <Seo title='Home' />
      <Carousel
        slideData={imgList} // imgList가 없으면 빈배열
        slidesPerView={1} // 보여줄 슬라이스 수
        slideHeight={'400px'} // 캐러셀 높이
      />
      <MainWrapper>
        <div className='flex justify-center w-full sm:w-[60%] m-auto mt-10 mb-4 sm:mb-8 bg-primary p-[2px] rounded-full overflow-hidden'>
          {/* 검색창 */}
          <input
            placeholder='장소이름을 검색하세요'
            // value={searchValue}
            // onChange={(e) => setSearchValue(e.target.value)}
            className='rounded-full w-[80%] sm:w-full p-2 px-4 placeholder:text-md focus:outline-none'
          />
          <Button
            color='primary'
            type='submit'
            className='h-auto w-[20%] rounded-r-full'
            // onClick={handleClickSearch}
          >
            <Image
              src='/images/icons/search.svg'
              width={24}
              height={24}
              alt='search_icon'
            />
          </Button>
        </div>
        <div className='flex flex-col w-full justify-center items-center'>
          <MostReviews initialData={topReviewed} />
          <Spacer y={10} />
          <MostBookmarks initialData={topBookmarked} />
          <Spacer y={20} />
        </div>
      </MainWrapper>
      <TopButton />
    </div>
  );
};

export default Home;

export async function getServerSideProps() {
  const topBookmarked = await getTopBookmarkedPlaces();
  const topReviewed = await getTopReviewedPlaces();
  return { props: { topBookmarked, topReviewed } };
}
