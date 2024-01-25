import { getBookmark } from '@/apis/bookmarks';
import { RootState } from '@/redux/config/configStore';
import { Tables } from '@/types/supabase';
import { useQuery } from '@tanstack/react-query';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toastSuccess, toastWarn } from '@/libs/toastifyAlert';
import { Chip } from '@nextui-org/react';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { shareKakao } from '@/utils/shareKaKao';
import { useBookmarks } from '@/hooks/useBookmarks';

interface PlaceInfoAllData {
  placeId: string;
  placeInfo: Tables<'places'>;
}

const PlaceDetail = ({ placeInfo, placeId }: PlaceInfoAllData) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const { userId, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { place_name, tel, address, working_hours, holidays } = placeInfo;
  const { insertBookmark, deleteBookmark } = useBookmarks(userId, placeId);

  const { data: bookmarkState } = useQuery({
    queryKey: ['bookmark', userId, placeId],
    queryFn: () => getBookmark({ userId, placeId }),
    enabled: !!userId,
  });

  useEffect(() => {
    setIsBookmarked(bookmarkState ? bookmarkState.length > 0 : false);
  }, [bookmarkState]);

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

  // 버튼 토글
  const toggleBookmark = () => {
    if (isBookmarked) {
      setIsBookmarked(false);
      deleteBookmark({ userId, placeId });
      toastSuccess('북마크가 해제되었습니다');
    } else {
      setIsBookmarked(true);
      insertBookmark({ userId, placeId });
      toastSuccess('북마크에 추가되었습니다');
    }
  };

  // 모달
  const showAlert = () => {
    toastWarn('로그인 후 이용해 주세요');
  };

  return (
    <section className='flex flex-col justify-between w-[90%] h-auto md:h-[500px] md:w-[48%]'>
      <div>
        <div className='flex justify-between w-full'>
          <h1 className='text-4xl text-bold mt-[10px] mb-[30px]'>
            {place_name}
          </h1>
          <div className='flex'>
            {isLoggedIn ? (
              isBookmarked ? (
                <>
                  {/* <Image
                    src='/images/icons/bookmark.svg'
                    alt='bookmark'
                    width={34}
                    height={34}
                    className='cursor-pointer mr-[10px]'
                    onClick={toggleBookmark}
                  /> */}
                  <FaBookmark
                    className='cursor-pointer mr-[10px]'
                    size='34px'
                    onClick={toggleBookmark}
                  />
                  <RiKakaoTalkFill
                    className='cursor-pointer '
                    size='34px'
                    onClick={() =>
                      shareKakao({
                        address: placeInfo?.address,
                        place_name: placeInfo?.place_name,
                        placeId,
                      })
                    }
                  />
                </>
              ) : (
                <>
                  {/* <Image
                    src='/images/icons/bookmark.svg'
                    alt='bookmark'
                    width={34}
                    height={34}
                    className='cursor-pointer mr-[10px]'
                    onClick={toggleBookmark}
                  /> */}
                  <FaRegBookmark
                    className='cursor-pointer mr-[10px]'
                    size='34px'
                    onClick={toggleBookmark}
                  />
                  <RiKakaoTalkFill
                    className='cursor-pointer '
                    size='34px'
                    onClick={() =>
                      shareKakao({
                        address: placeInfo?.address,
                        place_name: placeInfo?.place_name,
                        placeId,
                      })
                    }
                  />
                </>
              )
            ) : (
              <>
                {/* <Image
                  src='/images/icons/bookmark.svg'
                  alt='bookmark'
                  width={34}
                  height={34}
                  className='cursor-pointer'
                  onClick={showAlert}
                /> */}
                <FaRegBookmark
                  className='cursor-pointer'
                  size='34px'
                  onClick={showAlert}
                />
                <RiKakaoTalkFill
                  className='cursor-pointer '
                  size='34px'
                  onClick={() =>
                    shareKakao({
                      address: placeInfo?.address,
                      place_name: placeInfo?.place_name,
                      placeId,
                    })
                  }
                />
              </>
            )}
          </div>
        </div>
        <div className='mb-[30px] md:mb-0'>
          <p className='text-xl'>주소 : {address}</p>
          <p className='text-xl'>전화 : {tel === '' ? '정보없음' : tel}</p>
          <p className='text-xl'>
            운영시간 : {working_hours === 'null' ? '정보없음' : working_hours}
          </p>
          <p className='text-xl'>
            휴무일 : {holidays === 'null' ? '정보없음' : holidays}
          </p>
        </div>
      </div>
      <div className='flex gap-2 flex-wrap w-full'>
        {isInfoArray.map((item, index) => (
          <div key={index} className='w-[32%]'>
            {item ? (
              <Chip
                className='bg-primary rounded-xl text-lg w-full max-w-full text-center'
                color='primary'
              >
                {infoDetails[index]}
              </Chip>
            ) : (
              <Chip className='rounded-xl text-lg w-full max-w-full max-w text-center'>
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
