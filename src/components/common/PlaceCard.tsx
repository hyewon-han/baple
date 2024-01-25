import React from 'react';
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react';
import { useRouter } from 'next/router';

import type { PlacesForPlaceCard } from '@/types/types';

interface Props {
  place: PlacesForPlaceCard;
}

const PlaceCard = ({ place }: Props) => {
  const router = useRouter();
  // console.log('placeCardProps', place);
  const {
    bookmarks_count,
    reviews_count,
    city,
    image_url,
    place_name,
    unique_place_id,
  } = place;

  const imgURL =
    image_url !== null
      ? image_url
      : 'https://dummyimage.com/600x400/000/fff.png&text=baple';

  return (
    <div className='m-1'>
      <Card
        shadow='sm'
        // key={index}
        isPressable
        onPress={() => router.push(`/place/${unique_place_id}`)}
        className='w-full h-full flex flex-col items-center rounded-3xl'
      >
        <CardBody className='overflow-visible rounded-3xl flex items-center'>
          <Image
            // radius='lg'
            // width='100%'
            // height='100%'
            alt={place_name}
            className='w-full object-cover h-80 rounded-3xl shadow-xl'
            src={imgURL}
          />
        </CardBody>
        <CardFooter className='flex flex-col'>
          <div className='flex flex-col items-start w-full'>
            <span className='text-sm'>{city}</span>
            <span className='text-base font-bold'>{place_name}</span>
          </div>
          <div className='flex gap-2 w-full justify-end'>
            <span className='flex gap-1 items-center justify-center'>
              <img
                src='/images/icons/write_select.svg'
                width={25}
                height={25}
                alt='write_icon'
                // className='object-cover'
              />
              {reviews_count}
            </span>
            <span className='flex gap-2 items-center justify-center'>
              <img
                src='/images/icons/bookmark_select.svg'
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

export default PlaceCard;
