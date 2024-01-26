import { Tables } from '@/types/supabase';
import { Chip } from '@nextui-org/react';
import { ShowAlertType, ToggleBookmarkType } from '@/pages/place/[placeId]';
import PlaceDetailHeader from './PlaceDetailHeader';

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
    '오디오 가이드',
    '점자 가이드',
    '장애인 주차장',
    '장애인 화장실',
    '장애인용 출입문',
    '안내견 동반',
    '입장료',
    '휠체어 대여',
  ];

  return (
    <section className='flex flex-col justify-between w-full h-auto sm:h-[500px] sm:w-[48%] '>
      <div>
        <div className='justify-between w-full hidden sm:inline-flex sm:mb-[20px]'>
          <PlaceDetailHeader
            placeId={placeId}
            placeInfo={placeInfo}
            isLoggedIn={isLoggedIn}
            isBookmarked={isBookmarked}
            toggleBookmark={toggleBookmark}
            showAlert={showAlert}
          />
        </div>
        <div className='mb-[30px] sm:mb-0'>
          <p className='text-md sm:text-xl'>주소 : {address}</p>
          <p className='text-md sm:text-xl'>
            전화 : {tel === '' ? '정보없음' : tel}
          </p>
          <p className='text-md sm:text-xl'>
            운영시간 : {working_hours === 'null' ? '정보없음' : working_hours}
          </p>
          <p className='text-md sm:text-xl'>
            휴무일 : {holidays === 'null' ? '정보없음' : holidays}
          </p>
        </div>
      </div>
      <div className='flex gap-2 flex-wrap w-full'>
        {isInfoArray.map((item, index) => (
          <div key={index} className='w-[48%] lg:w-[32%]'>
            {item ? (
              <Chip
                className='bg-primary rounded-full text-md sm:text-base w-full max-w-full text-center'
                color='primary'
              >
                {infoDetails[index]}
              </Chip>
            ) : (
              <Chip className='rounded-xl text-md sm:text-base w-full max-w-full max-w text-center'>
                {infoDetails[index]}
              </Chip>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlaceDetail;
