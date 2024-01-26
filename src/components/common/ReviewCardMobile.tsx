import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReviewsFromRPC } from '@/types/types';
// import Image from 'next/image';
import { formatDate } from '@/utils/dateFormatter';
import { Image } from '@nextui-org/react';

interface Props {
  review: ReviewsFromRPC;
}

const ReviewCardMobile = ({ review }: Props) => {
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
      <div className='border rounded-md p-2 w-full flex flex-col gap-2'>
        <section className='flex gap-1'>
          {images_url?.map((url) => (
            <Image
              key={url}
              alt='review images'
              src={url}
              height={90}
              width={90}
              className='w-[100px] h-[100px] transition-all object-cover object-center rounded-md'
            />
          ))}
        </section>
        <section className='flex flex-col'>
          <strong className={` ${displayPlaceName ? 'block' : 'hidden'}`}>
            {place_name}
          </strong>
          <div className='w-full overflow-hidden whitespace-nowrap overflow-ellipsis h-[25px]  text-[15px] '>
            {content}
          </div>
        </section>
        <section>
          <div className='flex justify-end gap-3'>
            <span className='text-sm text-gray-500'>
              {formatDate(review.created_at)}
            </span>
            <span className='flex justify-between gap-1'>
              <Image
                src='/images/icons/comment_select.svg'
                width={20}
                height={20}
                alt='comment icon'
              />
              {comments_count}
            </span>
            <span className='flex gap-1'>
              <Image
                src='/images/icons/heart_select.svg'
                width={20}
                height={20}
                alt='likes icon'
              />
              {likes_count}
            </span>
          </div>
        </section>
      </div>
    </Link>
  );
};

export default ReviewCardMobile;
