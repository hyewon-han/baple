import { Tables } from '@/types/supabase';
import { Chip } from '@nextui-org/react';
import { ShowAlertType, ToggleBookmarkType } from '@/pages/place/[placeId]';
import PlaceDetailHeader from './PlaceDetailHeader';
import Image from 'next/image';

export interface PlaceInfoAllData {
  placeId: string;
  placeInfo: Tables<'places'>;
  isBookmarked: boolean;
  isLoggedIn: boolean;
  toggleBookmark: ToggleBookmarkType;
  showAlert: ShowAlertType;
}

const PlaceDetail = ({
  placeInfo,
  placeId,
  isBookmarked,
  isLoggedIn,
  toggleBookmark,
  showAlert,
}: PlaceInfoAllData) => {
  const { tel, address, working_hours, holidays } = placeInfo;

  const isInfoArray = [
    placeInfo.is_audio_guide,
    placeInfo.is_braille_guide,
    placeInfo.is_disabled_parking,
    placeInfo.is_disabled_toilet,
    placeInfo.is_easy_door,
    placeInfo.is_guide_dog,
    placeInfo.is_paid,
    placeInfo.is_wheelchair_rental,
  ];

  const infoDetails = [
    { icon: 'filled-heart', label: '오디오 가이드' },
    { icon: 'filled-heart', label: '점자 가이드' },
    { icon: 'filled-heart', label: '장애인 주차장' },
    { icon: 'filled-heart', label: '장애인 화장실' },
    { icon: 'filled-heart', label: '장애인용 출입문' },
    { icon: 'filled-heart', label: '안내견 동반' },
    { icon: 'filled-heart', label: '입장료' },
    { icon: 'filled-heart', label: '휠체어 대여' },
  ];

  return (
    <section className='flex flex-col justify-between w-full h-auto md:h-[500px] md:w-[60%] '>
      <div>
        <div className='justify-between w-full hidden md:inline-flex md:mb-[20px]'>
          <PlaceDetailHeader
            placeId={placeId}
            placeInfo={placeInfo}
            isLoggedIn={isLoggedIn}
            isBookmarked={isBookmarked}
            toggleBookmark={toggleBookmark}
            showAlert={showAlert}
          />
        </div>
        <div className='flex'>
          <div className='mb-[30px] md:mb-0 w-1/4'>
            <p className='md:text-xl font-bold mb-1 md:mb-2'>주소</p>
            <p className='md:text-xl font-bold mb-1 md:mb-2'>전화</p>
            <p className='md:text-xl font-bold mb-1 md:mb-2'>운영시간</p>
            <p className='md:text-xl font-bold mb-1 md:mb-2'>휴무일</p>
          </div>
          <div className='mb-[30px] md:mb-0 w-3/4'>
            <p className='md:text-xl mb-1 md:mb-2'>{address}</p>
            <p className='md:text-xl mb-1 md:mb-2'>
              {tel === '' ? '정보없음' : tel}
            </p>
            <p className='md:text-xl mb-1 md:mb-2'>
              {working_hours === 'null' ? '정보없음' : working_hours}
            </p>
            <p className='md:text-xl mb-1 md:mb-2'>
              {holidays === 'null' ? '정보없음' : holidays}
            </p>
          </div>
        </div>
      </div>
      <div className='flex gap-2 flex-wrap w-full'>
        {isInfoArray.map((item, index) => (
          <div key={index} className='w-[48%] lg:w-[32%]'>
            {item ? (
              <Chip className='bg-primary text-white rounded-full text-md sm:text-base w-full max-w-full text-center'>
                <div className='flex justify-center'>
                  <Image
                    src={`/images/icons/${infoDetails[index].icon}.svg`}
                    alt='icon'
                    width={18}
                    height={18}
                    className='bg-white mr-2'
                  />
                  {infoDetails[index].label}
                </div>
              </Chip>
            ) : (
              <Chip className='rounded-full text-md sm:text-base w-full max-w-full text-center'>
                <div className='flex justify-center'>
                  <Image
                    src={`/images/icons/${infoDetails[index].icon}.svg`}
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
    </section>
  );
};

export default PlaceDetail;
