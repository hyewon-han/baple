import React from 'react';
import { Avatar } from '@nextui-org/react';
import Link from 'next/link';
import { formatDate } from '@/utils/dateFormatter';
import Image from 'next/image';
import type { ReviewsFromRPC } from '@/types/types';
import { useRouter } from 'next/router';
import CommentIcon from 'images/icons/comment.svg';

interface Props {
  review: ReviewsFromRPC;
}

const ReviewCard2 = ({ review }: Props) => {
  const { pathname } = useRouter();
  const displayPlaceName = pathname === '/place/[placeId]' ? false : true;
  const {
    images_url,
    content,
    likes_count,
    comments_count,
    unique_review_id,
    place_name,
    user_name,
    user_avatar_url,
  } = review;

  return (
    <Link className='w-full' href={`/review/${unique_review_id}`}>
      <div className='card w-full p-2 border rounded-xl'>
        <div className='flex justify-between gap-x-4'>
          <section className='flex flex-col gap-y-2 min-w-[118px] items-center justify-center'>
            <Avatar
              showFallback
              src={user_avatar_url}
              className='w-[50px] h-[50px]'
            />
            <strong>{user_name}</strong>
          </section>
          <div className='flex flex-col w-full'>
            <div className='flex flex-col gap-4'>
              <div className='flex gap-x-1'>
                {images_url?.map((url) => (
                  <Image
                    key={url}
                    alt='review images'
                    src={url}
                    height={40}
                    width={40}
                    className='w-[40px] h-[40px] object-cover object-center rounded-md'
                  />
                ))}
              </div>
              <strong className={` ${displayPlaceName ? 'block' : 'hidden'}`}>
                {place_name}
              </strong>
              <div className='max-h-[24px] overflow-hidden'>{content}</div>
            </div>
          </div>
          <section className='flex text-end flex-col w-[190px]'>
            <span className='text-sm text-gray-500'>
              {formatDate(review.created_at)}
            </span>
            <div className='flex justify-end gap-3'>
              <span className='flex gap-1'>
                <Image
                  src='/images/icons/comment.svg'
                  width={20}
                  height={20}
                  alt='comment icon'
                />
                {comments_count}
              </span>
              <span className='flex gap-1'>
                <Image
                  src='/images/icons/filled-heart.svg'
                  width={20}
                  height={20}
                  alt='likes icon'
                />
                {likes_count}
              </span>
            </div>
          </section>
        </div>
      </div>
    </Link>
  );
};

export default ReviewCard2;
