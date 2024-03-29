import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { useViewport } from '@/hooks/useViewport';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaLink } from 'react-icons/fa';

import type { Tables } from '@/types/supabase';

interface Props {
  placeInfo: Tables<'places'>;
}

const PlaceDetailInfoBody = ({ placeInfo }: Props) => {
  const {
    tel = '',
    address = '',
    working_hours = '',
    holidays = '',
    homepage = '',
  } = placeInfo || {};
  const { isMobile } = useViewport();
  const { baple } = useCurrentTheme();
  return (
    <div className='flex flex-col mb-3 md:mb-0 mx-2 md:my-0'>
      <div className='flex w-full mb-2 md:mb-2'>
        <span className='flex items-start md:text-xl font-bold w-1/3'>
          <Image
            src={`/images/icons/place_detail_icons/${
              baple ? '주소' : '주소_색약모드'
            }.svg`}
            width={isMobile ? 18 : 24}
            height={isMobile ? 18 : 24}
            alt='address'
            className='mr-3'
          />
          <span>주소</span>
        </span>
        <span className='w-2/3 md:text-xl'>{address}</span>
      </div>
      <div className='flex w-full mb-2 md:mb-2'>
        <span className='flex items-start md:text-xl font-bold w-1/3'>
          <Image
            src={'/images/icons/place_detail_icons/전화번호.svg'}
            width={isMobile ? 18 : 24}
            height={isMobile ? 18 : 24}
            alt='address'
            className='mr-3'
          />
          <span>전화</span>
        </span>
        <span className='w-2/3 md:text-xl'>
          {tel === '' ? '정보없음' : tel}
        </span>
      </div>
      <div className='flex w-full mb-2 md:mb-2'>
        <span className='flex items-start md:text-xl font-bold w-1/3'>
          <Image
            src={'/images/icons/place_detail_icons/운영시간.svg'}
            width={isMobile ? 18 : 24}
            height={isMobile ? 18 : 24}
            alt='address'
            className='mr-3'
          />
          <span>운영시간</span>
        </span>
        <span className='w-2/3 md:text-xl'>
          {working_hours === 'null' ? '정보없음' : working_hours}
        </span>
      </div>
      <div className='flex w-full mb-2 md:mb-2'>
        <span className='flex items-start md:text-xl font-bold w-1/3'>
          <Image
            src={'/images/icons/place_detail_icons/휴무일.svg'}
            width={isMobile ? 18 : 24}
            height={isMobile ? 18 : 24}
            alt='address'
            className='mr-3'
          />
          <span>휴무일</span>
        </span>
        <span className='w-2/3 md:text-xl'>
          {holidays === 'null' ? '정보없음' : holidays}
        </span>
      </div>
      <div className='flex w-full mb-2 md:mb-2'>
        <span className='flex items-start md:text-xl font-bold w-1/3'>
          <Image
            src={'/images/icons/place_detail_icons/홈페이지.svg'}
            width={isMobile ? 18 : 24}
            height={isMobile ? 18 : 24}
            alt='address'
            className='mr-3'
          />
          <span>홈페이지</span>
        </span>
        {homepage === '정보없음' ? (
          <span className='w-2/3 md:text-xl'>정보없음</span>
        ) : (
          <Link target='_blank' href={`http://${homepage}`} className='w-2/3'>
            <div className='w-full md:text-xl hover:text-primary'>
              <span className='flex items-center'>
                <FaLink className='mr-1 md:mr-2' />
                <span className=''>바로가기</span>
              </span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PlaceDetailInfoBody;
