import React from 'react';
// import { Card, CardBody, CardFooter, Image } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { Tables } from '@/types/supabase';
import { useQuery } from '@tanstack/react-query';
import { getBookmarksByPlaceId } from '@/apis/bookmarks';
import { getReviewsByPlaceId } from '@/apis/reviews';
import Link from 'next/link';
import Image from 'next/image';
import { Chip } from '@nextui-org/react';
import { useTheme } from 'next-themes';

type Props = {
  place: Tables<'places'>;
};

const PlaceCard2 = ({ place }: Props) => {
  const router = useRouter();
  // const imgURL = place.image_url;
  const imgURL =
    place.image_url !== null
      ? place.image_url
      : 'https://velog.velcdn.com/images/jetiiin/post/6cd59108-3d13-449c-814b-4ee50af9fc9f/image.png';

  const { data: bookmarksData, isLoading: isBookmarksLoading } = useQuery({
    queryKey: ['bookmarks', place.id],
    queryFn: () => getBookmarksByPlaceId(place.id),
  });

  const { data: reviewsData, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['reviewsPC', place.id],
    queryFn: () => getReviewsByPlaceId(place.id),
  });
  const { theme } = useTheme();
  return (
    // <div className='m-1'>
    //   <Card
    //     shadow='sm'
    //     // key={index}
    //     isPressable
    //     onPress={() => router.push(`/place/${place.id}`)}
    //     className='p-2 w-[250px] h-[250px]'
    //   >
    //     <CardBody className='overflow-visible p-0'>
    //       <Image
    //         shadow='sm'
    //         radius='lg'
    //         width='100%'
    //         height={230}
    //         alt={place.place_name}
    //         className='w-full object-cover h-[140px]'
    //         src={imgURL || undefined}
    //       />
    //     </CardBody>
    //     <CardFooter className='text-small justify-between'>
    //       <div className='flex flex-col items-start'>
    //         <strong className='mb-3'>{place.place_name}</strong>
    //         <div className='flex justify-between w-[210px]'>
    //           <div>
    //             <span>📑{reviewsData?.length}</span>
    //             <span>🔖{bookmarksData?.length}</span>
    //           </div>
    //           <span className='text-s'>{place.city}</span>
    //         </div>
    //       </div>
    //     </CardFooter>
    //   </Card>
    // </div>
    <Link href={`/place/${place.id}`}>
      <div className='relative w-[12.6rem] h-[9.6rem] mx-auto sm:w-[19rem] sm:h-[14.5rem] transition-all ring-2 ring-gray-100 rounded-3xl overflow-hidden shadow-md hover:ring-4 hover:ring-primary '>
        <Image
          src={imgURL}
          alt={place.place_name}
          fill={true}
          className='rounded-3xl'
        />
        <div className='absolute top-0 w-full h-full transition-opacity cursor-pointer backdrop-blur-sm backdrop-brightness-50 opacity-0 hover:opacity-100 grid grid-cols-2 place-items-start pb-16 px-5 pt-5 rounded-xl'>
          {place.is_paid ? (
            <Chip size='sm' variant='solid'>
              입장료
            </Chip>
          ) : null}
          {place.is_easy_door ? (
            <Chip size='sm' variant='solid'>
              장애인용 출입문
            </Chip>
          ) : null}
          {place.is_wheelchair_rental ? (
            <Chip size='sm' variant='solid'>
              휠체어 대여
            </Chip>
          ) : null}
          {place.is_guide_dog ? (
            <Chip size='sm' variant='solid'>
              안내견 동반
            </Chip>
          ) : null}
          {place.is_braille_guide ? (
            <Chip size='sm' variant='solid'>
              점자 가이드
            </Chip>
          ) : null}
          {place.is_disabled_parking ? (
            <Chip size='sm' variant='solid'>
              장애인용 주차장
            </Chip>
          ) : null}
          {place.is_audio_guide ? (
            <Chip size='sm' variant='solid'>
              오디오 가이드
            </Chip>
          ) : null}
          {place.is_disabled_toilet ? (
            <Chip size='sm' variant='solid'>
              장애인용 화장실
            </Chip>
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
                    theme === 'baple'
                      ? 'write_select.svg'
                      : 'CBicons/CBwrite_select.svg'
                  }`}
                  width={20}
                  height={20}
                  alt='write_icon'
                  // className='object-cover'
                />
                {reviewsData?.length}
              </span>
              <span className='flex gap-2 items-center justify-center'>
                <Image
                  src={`/images/icons/${
                    theme === 'baple'
                      ? 'bookmark_select.svg'
                      : 'CBicons/CBbookmark_select_.svg'
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

export default PlaceCard2;
