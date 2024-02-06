// src/pages/places/index.tsx
import PlaceCard from '@/components/common/PlaceCard';
import TopButton from '@/components/common/TopButton';
import MainWrapper from '@/components/layout/MainWrapper';
import Seo from '@/components/layout/Seo';
import { Button, Spinner } from '@nextui-org/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { RootState } from '@/redux/config/configStore';
import { saveSearchValue } from '@/redux/modules/searchSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPlacesData } from '@/apis/places';
import useLocalStorage from 'use-local-storage';
import { saveSelectedBtn } from '@/redux/modules/seletedBtnSlice';
import SkeletonCard from '@/components/places/SkeletonCard';
import { CITYS } from '@/utils/defaultValue';
import { saveSelectedCity } from '@/redux/modules/selectedCitySlice';

const PlacesPage = () => {
  const searchValue = useSelector((state: RootState) => state.search);
  const selectedBtn = useSelector((state: RootState) => state.selectedBtn);
  const [realSearch, setRealSearch] = useState(searchValue);
  const dispatch = useDispatch();
  const currentPage = 1;
  const [scrollY] = useLocalStorage('places_list_scroll', 0);
  const selectedCity = useSelector((state: RootState) => state.selectedCity);

  useEffect(() => {
    // 기본값이 "0"이기 때문에 스크롤 값이 저장됐을 때에만 window를 스크롤시킨다.
    if (scrollY !== 0) window.scrollTo(0, scrollY);
  }, [scrollY]);

  const handleClickSearchBtn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setRealSearch(searchValue);
  };

  const {
    data: places,
    hasNextPage,
    fetchNextPage,
    status,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['places', realSearch, selectedBtn, selectedCity],
    queryFn: fetchPlacesData,
    initialPageParam: currentPage, // 초기 페이지 값 설정
    getNextPageParam: (lastPage, pages) => {
      if (lastPage) {
        if (lastPage?.page < lastPage?.total_pages) {
          return lastPage.page + 1;
        }
      }
    },
    select: (data) => {
      return data.pages.map((pageData) => pageData?.data).flat();
    },
  });

  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (!inView || !hasNextPage) return;
      fetchNextPage();
    },
  });

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
    <MainWrapper>
      <Seo />
      <form
        onSubmit={handleClickSearchBtn}
        className='flex justify-center w-full sm:w-[60%] m-auto mt-10 mb-4 sm:mb-8 bg-primary p-[2px] rounded-full overflow-hidden'
      >
        <div className='flex w-full max-w-xs flex-col gap-2'>
          <select
            defaultValue={selectedCity}
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
          onChange={(e) => dispatch(saveSearchValue(e.target.value))}
          className='rounded-br-full rounded-tr-full w-full sm:w-full p-2 px-4 placeholder:text-md focus:outline-none'
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
      {places?.length === 0 ? (
        <div className='absolute pt-40 sm:pt-0 w-[90%] min-h-[30rem] flex justify-center flex-col gap-5 items-center '>
          <Image
            src='/images/icons/character.svg'
            alt='main_character'
            width={100}
            height={100}
          />
          <span className='text-lg'>검색 결과가 없습니다 😅</span>
        </div>
      ) : null}
      <div className='flex gap-6 flex-col md:flex md:flex-row relative'>
        {/* 태그 */}
        <div className='grid grid-cols-2 sm:grid-cols-3 place-items-center md:w-36 md:flex md:flex-col gap-4 md:fixed'>
          {generateBtns('is_paid', '입장료 있음')}
          {generateBtns('is_easy_door', '장애인용 출입문')}
          {generateBtns('is_wheelchair_rental', '휠체어 대여')}
          {generateBtns('is_guide_dog', '안내견 동반')}
          {generateBtns('is_braille_guide', '점자 가이드')}
          {generateBtns('is_audio_guide', '오디오 가이드')}
          {generateBtns('is_disabled_toilet', '장애인용 화장실')}
          {generateBtns('is_disabled_parking', '장애인용 주차장')}
        </div>
        {/* 카드 */}

        <div className='relative grid grid-cols-2 lg:grid-cols-3 md:grid-cols-2 sm:gap-3 places-items-center w-full md:w-[75%] md:ml-48 '>
          {status === 'pending' ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            places?.map((place, idx) => <PlaceCard key={idx} place={place} />)
          )}
        </div>
      </div>
      <div ref={ref} className=' w-full h-6'></div>
      {isFetchingNextPage && (
        <div className='w-full flex sm:ml-12 justify-center'>
          <Spinner color='primary' size='lg' />
        </div>
      )}
      <TopButton />
    </MainWrapper>
  );
};

export default PlacesPage;
