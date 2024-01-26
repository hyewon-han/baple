import { RootState } from '@/redux/config/configStore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MapPlaceCard from './MapPlaceCard';
import PagiNation from './PagiNation';
import Link from 'next/link';

const PlacesModal = ({
  regionName,
  cityName,
  setIsModalVisible,
  isModalVisible,
}: {
  regionName: string;
  cityName: string;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isModalVisible: boolean;
}) => {
  const places = useSelector((state: RootState) => state.placesData);

  // 현재 페이지
  const [page, setPage] = useState(1);
  // 한 페이지에 보여질 게시물 개수
  const limit = 5;

  // 게시물 총 개수
  const total = places?.length || 0;
  // 페이지의 총 개수
  const numPages = Math.ceil(total / limit);
  // 첫 게시물의 인덱스
  const offset = (page - 1) * limit;
  useEffect(() => {
    // 전체데이터가 변할 때마다 게시물 수 업데이트
    setPage(1);
  }, [places]);
  return (
    <div className={`absolute  w-[100%] h-[100%]`}>
      <div
        className={` absolute flex flex-col bg-white bg-opacity-50 transition-all bottom-[10px] z-10 sm:w-[20rem] w-[20rem]  h-[83vh] sm:h-[90vh] rounded-l-[20px] right-${
          isModalVisible ? '0' : '[-20rem]'
        } 

        `}
      >
        <button
          className='flex absolute sm:w-[50px] w-[20px] h-[50px] z-10 top-[50%] left-[-20px] sm:left-[-50px] bg-primary text-white sm:text-2xl text-sm font-black items-center justify-center rounded-l-[20px]'
          onClick={() => setIsModalVisible(!isModalVisible)}
        >
          {isModalVisible ? '>' : '<'}
        </button>
        <div className='h-[50px] w-full flex justify-center items-center text-[18px]  bg-white  rounded-l-[20px] shadow-xl'>
          <p className='font-bold text-[20px]'>
            {cityName}&nbsp;
            {regionName}
          </p>
          의 추천장소 입니다
        </div>

        {/* 맵으로 장소카드 컴포넌트 만들어 뿌려주기 */}
        {places?.slice(offset, offset + limit).map((place) => {
          return (
            <Link key={place.id} href={`/place/${place?.id}`}>
              <div className='w-full  bg-white flex h-[5rem] md:h-[6rem] m-2 rounded-[80px] p-4 shadow-xl '>
                <MapPlaceCard place={place} />
              </div>
            </Link>
          );
        })}

        {/*  페이지네이션 컴포넌트 만들어 주기(숫자 버튼) */}
        <PagiNation page={page} setPage={setPage} numPages={numPages} />
      </div>
    </div>
  );
};

export default PlacesModal;
