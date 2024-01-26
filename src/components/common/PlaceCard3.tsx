import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
} from '@nextui-org/react';
import { useRouter } from 'next/router';
import type { PlacesForPlaceCard, PlacesForSearch } from '@/types/types';
import NextImage from 'next/image'; // 모듈명 변경
import { MdPhotoCameraBack } from 'react-icons/md';
import Link from 'next/link';

interface Props {
  place: PlacesForSearch;
}

const PlaceCard3 = ({ place }: Props) => {
  const router = useRouter();
  const {
    bookmarks_count,
    reviews_count,
    city,
    image_url,
    place_name,
    unique_place_id,
    is_audio_guide,
    is_braille_guide,
    is_disabled_parking,
    is_disabled_toilet,
    is_easy_door,
    is_guide_dog,
    is_paid,
    is_wheelchair_rental,
  } = place;

  const imgURL =
    image_url !== null
      ? image_url
      : 'https://dummyimage.com/600x400/cccccc/000000&text=baple';

  return (
    <div className='m-1'>
      <Card
        shadow='sm'
        isPressable
        isHoverable
        onPress={() => router.push(`/place/${unique_place_id}`)}
        className='w-[19rem] h-[24.5rem] flex flex-col items-center rounded-3xl aspect-auto '
      >
        <CardBody className='overflow-visible rounded-3xl flex items-center'>
          <Image
            width='16.5rem'
            height='16.5rem'
            alt={place_name}
            className='object-cover rounded-3xl shadow-xl w-[16.5rem] h-[16.5rem]'
            src={imgURL}
          />
        </CardBody>
        <CardFooter className='flex flex-col w-full'>
          <div className='flex flex-col items-start w-full'>
            <span className='text-sm'>{city}</span>
            <span className='text-base font-bold'>{place_name}</span>
          </div>
          <div className='flex gap-2 w-full justify-end'>
            <span className='flex gap-1 items-center justify-center'>
              <NextImage
                src='/images/icons/write_select.svg'
                width={20}
                height={20}
                alt='write_icon'
                // className='object-cover'
              />
              {reviews_count}
            </span>
            <span className='flex gap-2 items-center justify-center'>
              <NextImage
                src='/images/icons/bookmark_select_.svg'
                width={20}
                height={20}
                alt='bookmark_icon'
                className='object-cover'
              />
              {bookmarks_count}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlaceCard3;