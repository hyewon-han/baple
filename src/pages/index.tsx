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
import { saveSearchValue } from '@/redux/modules/searchSlice';
import { useRouter } from 'next/router';
import { saveSelectedBtn } from '@/redux/modules/seletedBtnSlice';

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
  const selectedBtn = useSelector((state: RootState) => state.selectedBtn);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleClickSearchBtn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveSearchValue(searchValue));
    router.push('/places');
  };

  const handleClickBtns = (value: string) => {
    dispatch(saveSelectedBtn(value));
  };

  const generateBtns = (value: string, label: string) => (
    <Button
      key={value}
      onClick={() => handleClickBtns(value)}
      color='primary'
      radius='full'
      variant={selectedBtn.includes(value) ? 'solid' : 'bordered'}
      className='w-full md:w-36'
    >
      {label}
    </Button>
  );

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
            <div className='grid grid-cols-2 sm:grid-cols-4 place-items-center gap-2 sm:w-[60%] mx-auto'>
              {generateBtns('is_paid', '입장료')}
              {generateBtns('is_easy_door', '장애인용 출입문')}
              {generateBtns('is_wheelchair_rental', '휠체어 대여')}
              {generateBtns('is_guide_dog', '안내견 동반')}
              {generateBtns('is_braille_guide', '점자 가이드')}
              {generateBtns('is_audio_guide', '오디오 가이드')}
              {generateBtns('is_disabled_toilet', '장애인용 화장실')}
              {generateBtns('is_disabled_parking', '장애인용 주차장')}
            </div>
            {/* 검색창 */}
            <form
              onSubmit={handleClickSearchBtn}
              className='flex justify-center w-full sm:w-[60%] m-auto mt-10 mb-4 sm:mb-8 bg-primary p-[2px] rounded-full overflow-hidden'
            >
              <input
                placeholder='장소이름을 검색하세요'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
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

// export async function getServerSideProps() {
//   const topBookmarked = await getTopBookmarkedPlaces();
//   const topReviewed = await getTopReviewedPlaces();
//   return { props: { topBookmarked, topReviewed } };
// }

export async function getStaticProps() {
  const topBookmarked = await getTopBookmarkedPlaces();
  const topReviewed = await getTopReviewedPlaces();

  return {
    props: { topBookmarked, topReviewed },
    revalidate: 60 * 10, // 10분마다 갱신
  };
}
