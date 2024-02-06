import React from 'react';
import { Tables } from '@/types/supabase';
import { useQuery } from '@tanstack/react-query';
import { getBookmarksByPlaceId } from '@/apis/bookmarks';
import { getReviewsByPlaceId } from '@/apis/reviews';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';

type Props = {
  place: Tables<'places'>;
};

const MarkerPlaceCard = ({ place }: Props) => {
  const { baple } = useCurrentTheme();
  const defaultImage = baple
    ? '/images/default3.png'
    : '/images/default3_blue.png';

  const imgURL =
    (place?.image_url as string) !== ''
      ? (place?.image_url as string)
      : defaultImage;

  const { data: bookmarksData, isLoading: isBookmarksLoading } = useQuery({
    queryKey: ['bookmarks', place.id],
    queryFn: () => getBookmarksByPlaceId(place.id),
  });

  const { data: reviewsData, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['reviewsPC', place.id],
    queryFn: () => getReviewsByPlaceId(place.id),
  });

  return (
    <Link href={`/place/${place.id}`}>
      <div className='relative w-[12.6rem] h-[9.6rem] mx-auto sm:w-[19rem] sm:h-[14.5rem] transition-all ring-2 ring-gray-100 rounded-3xl overflow-hidden shadow-md hover:ring-4 hover:ring-primary '>
        <Image
          src={imgURL}
          alt={place.place_name}
          fill={true}
          className='rounded-3xl'
        />
        <div className='absolute top-0 w-full h-full transition-opacity cursor-pointer backdrop-blur-sm backdrop-brightness-50 opacity-0 hover:opacity-100 grid grid-cols-2 content-start place-items-center gap-y-3 px-10 py-4'>
          {place.is_paid ? (
            <div className='bg-primary text-[0.6rem] sm:text-xs p-1 rounded-xl w-20 sm:w-24 text-center text-white '>
              입장료 있음
            </div>
          ) : null}
          {place.is_easy_door ? (
            <div className='bg-primary text-[0.6rem] sm:text-xs p-1 rounded-xl w-20 sm:w-24 text-center text-white '>
              장애인용 출입문
            </div>
          ) : null}
          {place.is_wheelchair_rental ? (
            <div className='bg-primary text-[0.6rem] sm:text-xs p-1 rounded-xl w-20 sm:w-24 text-center text-white '>
              휠체어 대여
            </div>
          ) : null}
          {place.is_guide_dog ? (
            <div className='bg-primary text-[0.6rem] sm:text-xs p-1 rounded-xl w-20 sm:w-24 text-center text-white '>
              안내견 동반
            </div>
          ) : null}
          {place.is_braille_guide ? (
            <div className='bg-primary text-[0.6rem] sm:text-xs p-1 rounded-xl w-20 sm:w-24 text-center text-white'>
              점자 가이드
            </div>
          ) : null}
          {place.is_disabled_parking ? (
            <div className='bg-primary text-[0.6rem] sm:text-xs p-1 rounded-xl w-20 sm:w-24 text-center text-white'>
              장애인용 주차장
            </div>
          ) : null}
          {place.is_audio_guide ? (
            <div className='bg-primary text-[0.6rem] sm:text-xs p-1 rounded-xl w-20 sm:w-24 text-center text-white '>
              오디오 가이드
            </div>
          ) : null}
          {place.is_disabled_toilet ? (
            <div className='bg-primary text-[0.6rem] sm:text-xs p-1 rounded-xl w-20 sm:w-24 text-center text-white'>
              장애인용 화장실
            </div>
          ) : null}
        </div>
        <div className='absolute h-[4rem]  w-full bottom-0 p-2  text-black bg-white bg-opacity-90'>
          <div className='flex'>
            <p className='text-xs mt-1 w-full whitespace-nowrap text-ellipsis overflow-hidden'>
              {place.city}
            </p>
            <div className='flex gap-2 w-full justify-end'>
              <span className='flex gap-1 items-center justify-center'>
                <Image
                  src={`/images/icons/${
                    baple ? 'write_select.svg' : 'CBicons/CBwrite_select.svg'
                  }`}
                  width={20}
                  height={20}
                  alt='write_icon'
                />
                {reviewsData?.length}
              </span>
              <span className='flex gap-2 items-center justify-center'>
                <Image
                  src={`/images/icons/${
                    baple
                      ? 'bookmark_select.svg'
                      : 'CBicons/CBbookmark_select.svg'
                  }`}
                  width={15}
                  height={15}
                  alt='bookmark_icon'
                  className='object-cover'
                />
                {bookmarksData?.length}
              </span>
            </div>
          </div>
          <p className='font-bold text-md whitespace-nowrap text-ellipsis overflow-hidden'>
            {place.place_name}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MarkerPlaceCard;
