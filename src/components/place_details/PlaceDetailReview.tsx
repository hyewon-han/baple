import { toastWarn } from '@/libs/toastifyAlert';
import { Button, Divider, Spacer } from '@nextui-org/react';
import React from 'react';
import PaiginatedReviews from './PaiginatedReviews';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { ReviewsFromRPC } from '@/types/types';

interface Props {
  placeId: string;
  recentOrder: boolean;
  setRecentOrder: (value: boolean) => void;
  reviews:
    | {
        recentOrder?: ReviewsFromRPC[];
        likesOrder?: ReviewsFromRPC[];
      }
    | undefined;
}

const PlaceDetailReview = ({
  placeId,
  recentOrder,
  setRecentOrder,
  reviews,
}: Props) => {
  const router = useRouter();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { baple } = useCurrentTheme();
  return (
    <section>
      <div className='flex mt-[100px] mb-[30px] justify-between'>
        <h2 className='text-2xl sm:text-3xl font-bold'>방문자 리뷰</h2>
        {isLoggedIn ? (
          <Button
            color='primary'
            className={`px-4 text-${
              baple ? 'white' : 'black'
            } sm:px-8 py-2 rounded-full text-sm sm:text-md`}
            onClick={() => router.push(`/review/write/${placeId}`)}
          >
            리뷰 작성하기
          </Button>
        ) : (
          <Button
            color='primary'
            className={`px-8 py-2 text-${
              baple ? 'white' : 'black'
            } rounded-full text-sm sm:text-md`}
            onClick={() => toastWarn('로그인 후 이용해주세요')}
          >
            리뷰 작성하기
          </Button>
        )}
      </div>
      <Divider className='h-0.5 mb-[30px]' />
      <div className='text-right mb-[20px] px-[10px]'>
        <span
          className={`mr-[20px] text-gray-500 text-sm cursor-pointer ${
            recentOrder ? 'border-b-2' : ''
          }`}
          onClick={() => {
            setRecentOrder(true);
          }}
        >
          최신순
        </span>
        <span
          className={`text-gray-500 text-sm cursor-pointer ${
            !recentOrder ? 'border-b-2' : ''
          }`}
          onClick={() => {
            setRecentOrder(false);
          }}
        >
          추천순
        </span>
      </div>
      <div className='flex flex-col justify-center gap-y-5 items-center'>
        {/* 리뷰카드 */}
        {reviews?.likesOrder?.length === 0 ? (
          <p>등록된 리뷰가 없습니다</p>
        ) : (
          <PaiginatedReviews
            reviews={recentOrder ? reviews?.recentOrder : reviews?.likesOrder}
          />
        )}
      </div>
      <Spacer y={10} />
    </section>
  );
};

export default PlaceDetailReview;
