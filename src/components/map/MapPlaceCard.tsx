import { Tables } from '@/types/supabase';
import React from 'react';
import Image from 'next/image';

const MapPlaceCard = ({ place }: { place: Tables<'places'> | null }) => {
  return (
    <>
      <Image
        src={
          place?.image_url ? place?.image_url : '/images/icons/character.svg'
        }
        alt='이미지'
        className='w-[70px] rounded-[50%]  shadow-lg'
        width={100}
        height={230}
      />
      <div className='flex flex-col ml-[20px] '>
        <div className='text-black font-bold'>{place?.place_name}</div>
        <div className='text-black flex flex-row '>
          <p className={place?.is_audio_guide ? 'mr-[1px]' : 'none'}>
            {place?.is_audio_guide ? '오디오' : null}
          </p>
          <p className={place?.is_braille_guide ? 'mr-[1px]' : 'none'}>
            {place?.is_braille_guide ? '점자' : null}
          </p>
          <p className={place?.is_disabled_parking ? 'mr-[1px]' : 'none'}>
            {place?.is_disabled_parking ? '주차' : null}
          </p>
          <p className={place?.is_disabled_toilet ? 'mr-[1px]' : 'none'}>
            {place?.is_disabled_toilet ? '화장실' : null}
          </p>
          <p className={place?.is_easy_door ? 'mr-[1px]' : 'none'}>
            {place?.is_easy_door ? '문' : null}
          </p>
          <p className={place?.is_guide_dog ? 'mr-[1px]' : 'none'}>
            {place?.is_guide_dog ? '안내견' : null}
          </p>
          <p className={place?.is_paid ? 'mr-[1px]' : 'none'}>
            {place?.is_paid ? '입장료' : null}
          </p>
          <p className={place?.is_wheelchair_rental ? 'mr-[1px]' : 'none'}>
            {place?.is_wheelchair_rental ? '휠체어' : null}
          </p>
        </div>
      </div>
    </>
  );
};

export default MapPlaceCard;
