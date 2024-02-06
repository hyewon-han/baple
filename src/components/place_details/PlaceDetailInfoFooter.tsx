import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { Tables } from '@/types/supabase';
import { Chip } from '@nextui-org/react';
import Image from 'next/image';
import React from 'react';

interface Props {
  placeInfo: Tables<'places'>;
}

const PlaceDetailInfoFooter = ({ placeInfo }: Props) => {
  const { baple } = useCurrentTheme();
  const isInfoArray = [
    placeInfo?.is_audio_guide,
    placeInfo?.is_braille_guide,
    placeInfo?.is_disabled_parking,
    placeInfo?.is_disabled_toilet,
    placeInfo?.is_easy_door,
    placeInfo?.is_guide_dog,
    placeInfo?.is_paid,
    placeInfo?.is_wheelchair_rental,
  ];

  const infoDetails = [
    { icon: '오디오가이드', label: '오디오 가이드' },
    { icon: '점자안내', label: '점자 가이드' },
    { icon: '장애인주차장', label: '장애인 주차장' },
    { icon: '장애인화장실', label: '장애인 화장실' },
    { icon: '장애인출입문', label: '장애인용 출입문' },
    { icon: '안내견동반', label: '안내견 동반' },
    { icon: '입장료', label: '입장료 있음' },
    { icon: '휠체어대여가능', label: '휠체어 대여' },
  ];
  return (
    <div className='flex gap-2 flex-wrap w-full'>
      {isInfoArray.map((item, index) => (
        <div key={index} className='w-[48%] lg:w-[32%]'>
          {item ? (
            <Chip
              className={`bg-primary text-${
                baple ? 'white' : 'black'
              } rounded-full text-md sm:text-base w-full max-w-full text-center`}
            >
              <div className='flex justify-center'>
                <Image
                  src={`/images/icons/place_icons/${infoDetails[index].icon}_${
                    baple ? 'white' : 'black'
                  }.svg`}
                  alt='icon'
                  width={18}
                  height={18}
                  className='mr-2'
                />
                {infoDetails[index].label}
              </div>
            </Chip>
          ) : (
            <Chip className='rounded-full text-md sm:text-base w-full max-w-full text-center'>
              <div className='flex justify-center'>
                <Image
                  src={`/images/icons/place_icons/${infoDetails[index].icon}_${
                    baple ? 'black' : 'white'
                  }.svg`}
                  alt='icon'
                  width={18}
                  height={18}
                  className='mr-2'
                />
                {infoDetails[index].label}
              </div>
            </Chip>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlaceDetailInfoFooter;
