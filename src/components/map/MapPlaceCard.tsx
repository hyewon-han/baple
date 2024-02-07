import { Tables } from '@/types/supabase';
import React from 'react';
import Image from 'next/image';

const MapPlaceCard = ({ place }: { place: Tables<'places'> | null }) => {
  const renderFeature = (
    condition: boolean | null | undefined,
    iconImage: string,
  ) => {
    return condition ? (
      <Image
        src={iconImage}
        alt='이미지'
        className='mr-[5px] mt-[3px] sm:mt-[10px]'
        width={20}
        height={20}
      />
    ) : null;
  };

  return (
    <>
      <img
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
          {renderFeature(
            place?.is_audio_guide,
            'images/icons/place_icons/오디오가이드_black.svg',
          )}
          {renderFeature(
            place?.is_braille_guide,
            'images/icons/place_icons/점자안내_black.svg',
          )}
          {renderFeature(
            place?.is_disabled_parking,
            'images/icons/place_icons/장애인주차장_black.svg',
          )}
          {renderFeature(
            place?.is_disabled_toilet,
            'images/icons/place_icons/장애인화장실_black.svg',
          )}
          {renderFeature(
            place?.is_easy_door,
            'images/icons/place_icons/장애인출입문_black.svg',
          )}
          {renderFeature(
            place?.is_guide_dog,
            'images/icons/place_icons/안내견동반_black.svg',
          )}
          {renderFeature(
            place?.is_paid,
            'images/icons/place_icons/입장료_black.svg',
          )}
          {renderFeature(
            place?.is_wheelchair_rental,
            'images/icons/place_icons/휠체어대여가능_black.svg',
          )}
        </div>
      </div>
    </>
  );
};

export default MapPlaceCard;
