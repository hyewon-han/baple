import { Tables } from '@/types/supabase';
import React from 'react';
import Image from 'next/image';

const MapPlaceCard = ({ place }: { place: Tables<'places'> | null }) => {
  const renderFeature = (
    condition: boolean | null | undefined,
    text: string,
  ) => {
    return condition ? <p className='mr-[1px]'>{text}</p> : null;
  };

  return (
    <>
      <Image
        src={place?.image_url || '/images/icons/character.svg'}
        alt='이미지'
        className='sm:w-[70px] sm:rounded-[50%] sm:shadow-lg hidden sm:block'
        width={100}
        height={230}
      />
      <div className='flex flex-col ml-[10px]'>
        <div className='text-black font-bold'>
          <p className='truncate w-[200px] h-[1.5rem]'>{place?.place_name}</p>
        </div>
        <div className='text-black flex flex-row'>
          {renderFeature(place?.is_audio_guide, '오디오')}
          {renderFeature(place?.is_braille_guide, '점자')}
          {renderFeature(place?.is_disabled_parking, '주차')}
          {renderFeature(place?.is_disabled_toilet, '화장실')}
          {renderFeature(place?.is_easy_door, '문')}
          {renderFeature(place?.is_guide_dog, '안내견')}
          {renderFeature(place?.is_paid, '입장료')}
          {renderFeature(place?.is_wheelchair_rental, '휠체어')}
        </div>
      </div>
    </>
  );
};

export default MapPlaceCard;
