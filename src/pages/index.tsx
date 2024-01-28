import { Inter } from 'next/font/google';
import Seo from '@/components/layout/Seo';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import { useEffect, useState } from 'react';
import MostReviews from '@/components/home/MostReviews';
import MostBookmarks from '@/components/home/MostBookmarks';
import { Button, Spacer } from '@nextui-org/react';
import Carousel from '@/components/common/Carousel';
import { getTopBookmarkedPlaces, getTopReviewedPlaces } from '@/apis/places';
import { PlacesForSearch } from '@/types/types';
import TopButton from '@/components/common/TopButton';
import Image from 'next/image';
import MainWrapper from '@/components/layout/MainWrapper';
import { setSearchValue } from '@/redux/modules/searchValueSlice';
import { useRouter } from 'next/router';

// const inter = Inter({ subsets: ['latin'] });

const imgList = [
  'https://velog.velcdn.com/images/jetiiin/post/53bf0230-ed13-4bd3-a643-5b053bc664fa/image.png',
  'https://velog.velcdn.com/images/jetiiin/post/baa72e93-0b63-4624-aa52-a584b12fe09a/image.png',
  'https://velog.velcdn.com/images/jetiiin/post/2b79044d-826f-4b35-b6d1-c2eeee7f92a6/image.png',
];

interface Props {
  topBookmarked: PlacesForSearch[];
  topReviewed: PlacesForSearch[];
}

const Home = ({ topBookmarked, topReviewed }: Props) => {
  // const { username, userId } = useSelector((state: RootState) => state.auth);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setSearchValue(localSearchValue));
    router.push('/places');
  };

  const [localSearchValue, setLocalSearchValue] = useState('');
  return (
    <>
      {isLoaded ? (
        <div>
          <Seo />
          <Carousel
            slideData={imgList} // imgList가 없으면 빈배열
            slidesPerView={1} // 보여줄 슬라이스 수
            slideHeight={'400px'} // 캐러셀 높이
          />
          <MainWrapper>
            {/* 검색창 */}
            <form
              onSubmit={handleSearch}
              className='flex justify-center w-full sm:w-[60%] m-auto mt-10 mb-4 sm:mb-8 bg-primary p-[2px] rounded-full overflow-hidden'
            >
              <input
                placeholder='장소이름을 검색하세요'
                value={localSearchValue}
                onChange={(e) => setLocalSearchValue(e.target.value)}
                className='rounded-full w-[80%] sm:w-full p-2 px-4 placeholder:text-md focus:outline-none'
              />
              <Button
                color='primary'
                type='submit'
                className='h-auto w-[20%] rounded-r-full'
              >
                <Image
                  src='/images/icons/search_white.svg'
                  width={24}
                  height={24}
                  alt='search_icon'
                />
              </Button>
            </form>
            <div className='flex flex-col w-full justify-center items-center'>
              <MostReviews initialData={topReviewed} />
              <Spacer y={10} />
              <MostBookmarks initialData={topBookmarked} />
              <Spacer y={20} />
            </div>
          </MainWrapper>
          <TopButton />
        </div>
      ) : null}
    </>
  );
};

export default Home;

export async function getServerSideProps() {
  const topBookmarked = await getTopBookmarkedPlaces();
  const topReviewed = await getTopReviewedPlaces();
  return { props: { topBookmarked, topReviewed } };
}
