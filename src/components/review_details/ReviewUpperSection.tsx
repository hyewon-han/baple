import { Avatar, Button, Divider, Spacer } from '@nextui-org/react';
import React from 'react';
import type { ReviewWithPlaceAndUser } from '@/types/types';
import { toastSuccess } from '@/libs/toastifyAlert';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useReviews } from '@/hooks/useReviews';
import ReviewLikes from './ReviewLikes';

interface Props {
  review: ReviewWithPlaceAndUser;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  currentUserId: string | null;
}

const ReviewUpperSection = ({
  review,
  setIsEditing,
  isEditing,
  currentUserId,
}: Props) => {
  const router = useRouter();

  const showDelEditBtn = currentUserId === review.user_id ? true : false;

  const { deleteReview } = useReviews(
    undefined,
    review.place_id,
    currentUserId as string,
  );

  const reviewDelete = () => {
    Swal.fire({
      icon: 'warning',
      title: '정말 삭제하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      confirmButtonColor: '#7b4cff',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReview({
          reviewId: review.id,
          imagesUrl: review.images_url as string[],
        });
        router.back();
        toastSuccess('삭제 완료');
      }
    });
  };
  console.log('리뷰!', review);
  return (
    <>
      <Spacer y={10} />
      <ReviewLikes review={review} />
      <Link href={`/place/${review.place_id}`}>
        <strong className='text-2xl'>{review.places.place_name}</strong>
      </Link>
      <Spacer y={5} />
      <Divider className='h-0.5' />

      <div className='flex justify-between items-center gap-4 py-5'>
        <div className='flex  items-center gap-4'>
          <Avatar
            className='sm:w-[88px] sm:h-[88px] w-[45px] h-[45px]'
            showFallback
            src={review.users.avatar_url || undefined}
          />
          <p className='sm:text-[25px] text-[18px]'>{review.users.user_name}</p>
        </div>
        <div
          className={`flex sm:gap-5 gap-2 ${showDelEditBtn ? '' : 'hidden'}`}
        >
          <Button
            size='sm'
            color='primary'
            className='min-w-[50px] sm:min-w-[68px]'
            onClick={reviewDelete}
          >
            삭제
          </Button>
          <Button
            size='sm'
            color='primary'
            className='min-w-[50px] sm:min-w-[68px]'
            onClick={() => {
              setIsEditing((prev) => !prev);
            }}
          >
            {isEditing ? '취소' : '수정'}
          </Button>
        </div>
      </div>
      <Spacer y={10} />
    </>
  );
};

export default ReviewUpperSection;
