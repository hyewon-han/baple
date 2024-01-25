import { Avatar, Button, Divider, Spacer } from '@nextui-org/react';
import React from 'react';
import type { ReviewWithPlaceAndUser } from '@/types/types';
import { toastSuccess } from '@/libs/toastifyAlert';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useReviews } from '@/hooks/useReviews';

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
        deleteReview(review.id);
        router.back();
        toastSuccess('삭제 완료');
      }
    });
  };

  return (
    <>
      <Spacer y={10} />
      <Link href={`/place/${review.place_id}`}>
        <strong className='text-2xl'>{review.places.place_name}</strong>
      </Link>
      <Spacer y={5} />
      <Divider className='h-0.5' />

      <div className='flex justify-between items-center gap-4 py-5'>
        <div className='flex  items-center gap-4'>
          <Avatar
            className='w-[88px] h-[88px]'
            showFallback
            src={review.users.avatar_url || undefined}
          />
          <p className='text-[25px]'>{review.users.user_name}</p>
        </div>
        <div className={`flex gap-5 ${showDelEditBtn ? '' : 'hidden'}`}>
          <Button size='sm' color='primary' onClick={reviewDelete}>
            삭제
          </Button>
          <Button
            size='sm'
            color='primary'
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
