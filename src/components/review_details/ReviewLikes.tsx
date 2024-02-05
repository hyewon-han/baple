import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FaPaperclip } from 'react-icons/fa';
import { Tables } from '@/types/supabase';
import { getPlaceInfo } from '@/apis/places';
import { toastSuccess, toastWarn } from '@/libs/toastifyAlert';
import { shareKakao } from '@/utils/shareKaKao';
import Image from 'next/image';
import { useLikes } from '@/hooks/useLikes';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { useAlarm } from '@/hooks/useAlarm';
import { useViewport } from '@/hooks/useViewport';

interface Props {
  review: Tables<'reviews'>;
}

const ReviewLikes = ({ review }: Props) => {
  const router = useRouter();
  const { userId, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isShown, setIsShown] = useState(false);
  const { insertAlarm } = useAlarm();
  const { isMobile } = useViewport();
  const { id: reviewId, user_id: reviewUserId } = review;

  const { data: placeInfo } = useQuery({
    queryKey: ['placeInfo', review.place_id],
    queryFn: () => getPlaceInfo(review.place_id),
  });

  const {
    likeState,
    likeCount,
    insertLike,
    deleteLike,
    plusLikeCount,
    minusLikeCount,
  } = useLikes(userId, reviewId, placeInfo);

  useEffect(() => {
    setIsLiked(likeState ? likeState.length > 0 : false);
  }, [likeState]);

  // 버튼 토글
  const toggleLikes = () => {
    const alarmInfo = {
      type: 'like',
      sender_id: userId,
      received_id: reviewUserId,
      review_id: reviewId,
      read: false,
    };
    if (isLiked) {
      setIsLiked(false);
      deleteLike({ userId: userId, reviewId });
      minusLikeCount(reviewId);
    } else {
      setIsLiked(true);
      insertLike({ userId: userId, reviewId });
      plusLikeCount(reviewId);
      insertAlarm(alarmInfo);
    }
  };

  // 로그인 안내 모달
  const showLoginAlert = () => {
    toastWarn('로그인 후 이용해주세요');
  };

  // 클립보드 성공 모달
  const showCopyAlert = () => {
    toastSuccess('클립보드에 복사 성공');
  };

  // 토글 공유 버튼
  const toggleShareBtn = () => {
    setIsShown((prev) => !prev);
    if (!isShown) {
      const time = setTimeout(() => setIsShown(false), 5000);
      return () => clearTimeout(time);
    }
  };

  // 클립보드 url 복사
  const copyClipboard = () => {
    const baseUrl = `${process.env.NEXT_PUBLIC_BASEURL}`;
    const currentPath = router.asPath;
    navigator.clipboard.writeText(`${baseUrl}${currentPath}`);
    showCopyAlert();
  };
  const { baple } = useCurrentTheme();

  return (
    <div className='relative'>
      <div className='absolute right-[100px] top-[245px] xl:left-[-90px] z-10'>
        {/* 좋아요 */}
        <div className='flex xl:flex-col justify-center items-center absolute xl:fixed top-[-250px] xl:top-[120px] w-[100px] xl:w-auto h-[40px] xl:h-auto p-3 rounded-full border border-gray-200 shadow-sm'>
          {isLoggedIn ? (
            isLiked ? (
              <div className='flex xl:flex-col xl:items-center'>
                <div className='w-[24px] h-[24px] mr-[6px] xl:mr-0 xl:w-[34px] xl:h-[34px] xl:mb-[4px]'>
                  <Image
                    src={`/images/icons/${
                      baple ? 'filled-heart.svg' : 'CBicons/CBfilled-heart.svg'
                    }`}
                    alt='like icon'
                    width={34}
                    height={34}
                    onClick={toggleLikes}
                    className='cursor-pointer'
                  />
                </div>

                <span className='mr-[6px] xl:mr-0 xl:mb-[4px]'>
                  {likeCount?.length}
                </span>
              </div>
            ) : (
              <div className='flex xl:flex-col xl:items-center'>
                <div className='w-[24px] h-[24px] mr-[6px] xl:mr-0 xl:w-[34px] xl:h-[34px] xl:mb-[4px]'>
                  <Image
                    src='/images/icons/empty-heart.svg'
                    alt='like icon'
                    width={34}
                    height={34}
                    onClick={toggleLikes}
                    className='cursor-pointer'
                  />
                </div>

                <span className='mr-[6px] xl:mr-0 xl:mb-[4px]'>
                  {likeCount?.length}
                </span>
              </div>
            )
          ) : (
            <div className='flex xl:flex-col xl:items-center'>
              <div className='w-[24px] h-[24px] mr-[6px] xl:mr-0 xl:w-[34px] xl:h-[34px] xl:mb-[4px]'>
                <Image
                  src='/images/icons/empty-heart.svg'
                  alt='like icon'
                  width={34}
                  height={34}
                  onClick={showLoginAlert}
                  className='cursor-pointer'
                />
              </div>
              <span className='mr-[6px] xl:mr-0 xl:mb-[4px]'>
                {likeCount?.length}
              </span>
            </div>
          )}

          {/* 토글버튼 */}
          <div>
            <div className='w-[24px] h-[24px] mr-[4px] xl:mr-0 xl:w-[34px] xl:h-[34px]'>
              <Image
                src={`/images/icons/${
                  baple ? 'share_select.svg' : 'CBicons/CBshare_select.svg'
                }`}
                alt='share button'
                width={34}
                height={34}
                onClick={toggleShareBtn}
                className='cursor-pointer'
              />
            </div>
          </div>

          {/* 공유하기 */}
          <div className='z-[5] relative w-full'>
            <div className='absolute'>
              <div
                className={`${isShown ? 'visible' : 'invisible'} opacity-${
                  isShown ? '100' : '0'
                } absolute w-[44px] h-[44px] xl:w-[50px] xl:h-[50px]  ${
                  baple ? 'bg-slate-200' : 'bg-slate-900'
                } top-[18px] xl:top-[-65px] left-[-64px] xl:left-[44px] rounded-full flex justify-center items-center transition-opacity duration-200 ease-in-out`}
              >
                <RiKakaoTalkFill
                  size={isMobile ? 20 : 24}
                  className='cursor-pointer text-primary'
                  onClick={() =>
                    shareKakao({
                      address: placeInfo?.address,
                      place_name: placeInfo?.place_name,
                      placeId: review.place_id,
                    })
                  }
                />
              </div>
              <div
                className={`${isShown ? 'visible' : 'invisible'} opacity-${
                  isShown ? '100' : '0'
                } absolute w-[44px] h-[44px] xl:w-[50px] xl:h-[50px] ${
                  baple ? 'bg-slate-200' : 'bg-slate-900'
                } top-[18px] xl:top-[-10px] left-[-16px] xl:left-[44px] rounded-full flex justify-center items-center transition-all duration-200 ease-in-out`}
              >
                <FaPaperclip
                  size={isMobile ? 20 : 24}
                  className='cursor-pointer text-primary'
                  onClick={copyClipboard}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewLikes;
