import { Tables } from '@/types/supabase';
import { Chip } from '@nextui-org/react';
import { ShowAlertType, ToggleBookmarkType } from '@/pages/place/[placeId]';
import PlaceDetailHeader from './PlaceDetailHeader';
import Image from 'next/image';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import Link from 'next/link';

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
  const { tel, address, working_hours, holidays, homepage } = placeInfo;

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
    { icon: '오디오가이드', label: '오디오 가이드' },
    { icon: '점자안내', label: '점자 가이드' },
    { icon: '장애인주차장', label: '장애인 주차장' },
    { icon: '장애인화장실', label: '장애인 화장실' },
    { icon: '장애인출입문', label: '장애인용 출입문' },
    { icon: '안내견동반', label: '안내견 동반' },
    { icon: '입장료', label: '입장료 있음' },
    { icon: '휠체어대여가능', label: '휠체어 대여' },
  ];
  const { baple } = useCurrentTheme();

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
        <div className='flex flex-col mb-3 md:mb-0 mx-2 md:my-0'>
          <div className='flex w-full mb-1 md:mb-2'>
            <span className='md:text-xl font-bold w-1/4'>주소</span>
            <span className='w-3/4 md:text-xl'>{address}</span>
          </div>
          <div className='flex w-full mb-1 md:mb-2'>
            <span className='md:text-xl font-bold w-1/4'>전화</span>
            <span className='w-3/4 md:text-xl'>
              {tel === '' ? '정보없음' : tel}
            </span>
          </div>
          <div className='flex w-full mb-1 md:mb-2'>
            <span className='md:text-xl font-bold w-1/4'>운영시간</span>
            <span className='w-3/4 md:text-xl'>
              {working_hours === 'null' ? '정보없음' : working_hours}
            </span>
          </div>
          <div className='flex w-full mb-1 md:mb-2'>
            <span className='md:text-xl font-bold w-1/4'>휴무일</span>
            <span className='w-3/4 md:text-xl'>
              {holidays === 'null' ? '정보없음' : holidays}
            </span>
          </div>
          <div className='flex w-full mb-1 md:mb-2'>
            <span className='md:text-xl font-bold w-1/4'>홈페이지</span>
            {homepage === '정보없음' ? (
              <span className='w-3/4 md:text-xl'>정보없음</span>
            ) : (
              <Link target='_blank' href={`http://${homepage}`}>
                <span className='w-3/4 md:text-xl text-gray-600 hover:text-primary'>
                  🔗 바로가기
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
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
                    src={`/images/icons/place_icons/${
                      infoDetails[index].icon
                    }_${baple ? 'white' : 'black'}.svg`}
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
                    src={`/images/icons/place_icons/${
                      infoDetails[index].icon
                    }_${baple ? 'black' : 'white'}.svg`}
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
