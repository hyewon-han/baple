import { RootState } from '@/redux/config/configStore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MapPlaceCard from './MapPlaceCard';
import PagiNation from './PagiNation';
import Link from 'next/link';

const PlacesModal = ({
  regionName,
  cityName,
}: {
  regionName: string;
  cityName: string;
}) => {
  const places = useSelector((state: RootState) => state.placesData);
  console.log(places);

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
    console.log('hello');
  }, [places]);
  return (
    <>
      <div className='absolute flex flex-col bg-white bg-opacity-50 right-0 bottom-0 z-10 w-[400px] h-[700px] rounded-tl-[20px]'>
        <div className='h-[50px] w-[380px] flex justify-center items-center text-[18px]'>
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
              <div className='w-[390px] bg-white flex h-[100px] m-2 rounded-[80px] p-4 shadow-xl '>
                <MapPlaceCard place={place} />
              </div>
            </Link>
          );
        })}

        {/*  페이지네이션 컴포넌트 만들어 주기(숫자 버튼) */}
        <PagiNation page={page} setPage={setPage} numPages={numPages} />
      </div>
    </>
  );
};

export default PlacesModal;
