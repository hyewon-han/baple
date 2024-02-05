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
import {
  resetSelectedBtn,
  saveSelectedBtn,
} from '@/redux/modules/seletedBtnSlice';
import { CITYS } from '@/utils/defaultValue';
import { saveSelectedCity } from '@/redux/modules/selectedCitySlice';
import { useViewport } from '@/hooks/useViewport';

// const inter = Inter({ subsets: ['latin'] });

interface Props {
  topBookmarked: PlacesForSearch[];
  topReviewed: PlacesForSearch[];
}

const Home = ({ topBookmarked, topReviewed }: Props) => {
  // const { username, userId } = useSelector((state: RootState) => state.auth);
  const selectedBtn = useSelector((state: RootState) => state.selectedBtn);
  const selectedCity = useSelector((state: RootState) => state.selectedCity);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const { isMobile } = useViewport();

  const WebImgList = [
    '/images/mainCarousel1.png',
    '/images/mainCarousel2.png',
    '/images/mainCarousel3.png',
  ];

  const MobileImgList = [
    '/images/mobile_banner1.png',
    '/images/mobile_banner2.png',
    '/images/mobile_banner3.png',
  ];
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    dispatch(saveSearchValue(''));
    dispatch(resetSelectedBtn());
    dispatch(saveSelectedCity(''));
  }, [dispatch]);

  const handleClickSearchBtn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue || selectedCity) {
      dispatch(saveSearchValue(searchValue));
      router.push('/places');
    }
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
      className='w-full'
    >
      {label}
    </Button>
  );

  return (
    <>
      <Seo />
      {isLoaded ? (
        <div>
          <Carousel
            slideData={isMobile ? MobileImgList : WebImgList} // imgList가 없으면 빈배열
            slidesPerView={1} // 보여줄 슬라이스 수
            slideHeight='full'
          />
          <MainWrapper>
            <div className='grid grid-cols-2 md:grid-cols-4 place-items-center gap-2 md:w-[60%] mx-auto'>
              {generateBtns('is_paid', '입장료 있음')}
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
              className='flex justify-center w-full md:w-[60%] m-auto mt-10 mb-4 sm:mb-8 bg-primary p-[2px] rounded-full overflow-hidden'
            >
              <div className='flex w-full max-w-xs flex-col gap-2'>
                <select
                  className='max-w-xs rounded-bl-full rounded-tl-full p-3 w-full h-full'
                  onChange={(e) => dispatch(saveSelectedCity(e.target.value))}
                >
                  {CITYS.map((city) => (
                    <option key={city.key} value={city.value}>
                      {city.key}
                    </option>
                  ))}
                </select>
              </div>
              <input
                placeholder='장소이름을 검색하세요'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className='rounded-br-full rounded-tr-full w-[80%] sm:w-full p-2 px-4 placeholder:text-md focus:outline-none'
                autoFocus
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

export async function getStaticProps() {
  const topBookmarked = await getTopBookmarkedPlaces();
  const topReviewed = await getTopReviewedPlaces();

  return {
    props: { topBookmarked, topReviewed },
    revalidate: 60 * 10, // 10분마다 갱신
  };
}
