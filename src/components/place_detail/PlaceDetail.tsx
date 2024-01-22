import { deleteBookmark, getBookmark, insertBookmark } from '@/apis/bookmarks';
import { RootState } from '@/redux/config/configStore';
import { Tables } from '@/types/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toastSuccess, toastWarn } from '@/libs/toastifyAlert';
import { Chip } from '@nextui-org/react';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { shareKakao } from '@/utils/shareKaKao';
import Image from 'next/image';

interface PlaceInfoAllData {
  placeId: string;
  placeInfo: Tables<'places'>;
}

const PlaceDetail = ({ placeInfo, placeId }: PlaceInfoAllData) => {
  const queryClient = useQueryClient();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const userInfo = useSelector((state: RootState) => state.auth);
  const { place_name, tel, address, working_hours, holidays } = placeInfo;

  const { data: bookmarkState } = useQuery({
    queryKey: ['bookmark', userInfo.userId, placeId],
    queryFn: () => getBookmark({ userId: userInfo.userId, placeId }),
    enabled: !!userInfo.userId,
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

  // 낙관적 업데이트 (추가)
  const addBookmark = useMutation({
    mutationFn: insertBookmark,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['bookmark', userInfo.userId, placeId],
      });
      const prev = queryClient.getQueryData([
        'bookmark',
        userInfo.userId,
        placeId,
      ]);
      const updateBookmark = [{ user_id: userInfo.userId, place_id: placeId }];
      queryClient.setQueryData(
        ['bookmark', userInfo.userId, placeId],
        updateBookmark,
      );
      return { prev };
    },
    onError: (error, updateReviewParams, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          ['bookmark', userInfo.userId, placeId],
          context.prev,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['bookmark', userInfo.userId, placeId],
      });
    },
  });

  // 낙관적 업데이트 (삭제)
  const delBookmark = useMutation({
    mutationFn: deleteBookmark,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['bookmark', userInfo.userId, placeId],
      });
      const prev = queryClient.getQueryData([
        'bookmark',
        userInfo.userId,
        placeId,
      ]);
      const updateBookmark = undefined;
      queryClient.setQueryData(
        ['bookmark', userInfo.userId, placeId],
        updateBookmark,
      );
      return { prev };
    },
    onError: (error, updateReviewParams, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          ['bookmark', userInfo.userId, placeId],
          context.prev,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['bookmark', userInfo.userId, placeId],
      });
    },
  });

  // 버튼 토글
  const toggleBookmark = () => {
    if (isBookmarked) {
      setIsBookmarked(false);
      delBookmark.mutate({ userId: userInfo.userId, placeId });
      toastSuccess('북마크에 해제되었습니다');
    } else {
      setIsBookmarked(true);
      addBookmark.mutate({ userId: userInfo.userId, placeId });
      toastSuccess('북마크에 추가되었습니다');
    }
  };

  // 모달
  const showAlert = () => {
    toastWarn('로그인 후 이용해 주세요');
  };

  return (
    <section className='flex flex-col justify-between w-[48%] h-[500px]'>
      <div>
        <div className=' flex justify-between'>
          <h1 className='text-4xl text-bold mt-[10px] mb-[30px]'>
            {place_name}
          </h1>
          <div className='flex'>
            {userInfo.isLoggedIn ? (
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
        <div>
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
