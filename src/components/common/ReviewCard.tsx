import React from 'react';
import { Avatar } from '@nextui-org/react';
import Link from 'next/link';
import { formatDate } from '@/utils/dateFormatter';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useViewport } from '@/hooks/useViewport';

import type { ReviewsFromRPC } from '@/types/types';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';

interface Props {
  review: ReviewsFromRPC;
}

const ReviewCard = ({ review }: Props) => {
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
  const { isTablet } = useViewport();

  const { baple } = useCurrentTheme();

  return (
    <Link className='w-full' href={`/review/${unique_review_id}`}>
      <div className='card w-full  md:pr-[47px] py-[18px] p-2 border rounded-xl transition-all'>
        <div className='flex justify-between gap-x-4'>
          {isTablet ? (
            ''
          ) : (
            <section className='flex flex-col w-[127px] gap-y-2 min-w-[118px] items-center justify-center'>
              <Avatar
                showFallback
                src={user_avatar_url}
                className='w-[65px] h-[65px]'
              />
              <strong className='text-[15px]'>{user_name}</strong>
            </section>
          )}

          <section className='flex flex-col md:w-[60%] w-[80%]'>
            <div className='flex flex-col gap-4'>
              <div className='flex gap-x-1'>
                {images_url?.map((url) => (
                  <Image
                    key={url}
                    alt='review images'
                    src={url}
                    height={100}
                    width={100}
                    className='w-[100px] h-[100px] transition-all object-cover object-center rounded-md'
                  />
                ))}
              </div>
              <strong className={` ${displayPlaceName ? 'block' : 'hidden'}`}>
                {place_name}
              </strong>
              <div className='w-full overflow-hidden whitespace-nowrap overflow-ellipsis h-[25px]  text-[15px] '>
                {content}
              </div>
            </div>
          </section>
          <section className='flex text-end flex-col items-end justify-between h-auto w-[30%]'>
            <span className='text-sm text-gray-500'>
              {formatDate(review.created_at)}
            </span>
            <div className='flex justify-end gap-3'>
              <span className='flex gap-1'>
                <Image
                  src={`/images/icons/${
                    baple
                      ? 'comment_select.svg'
                      : 'CBicons/CBcomment_select.svg'
                  }`}
                  width={20}
                  height={20}
                  alt='comment icon'
                />
                {comments_count}
              </span>
              <span className='flex gap-1'>
                <Image
                  src={`/images/icons/${
                    baple ? 'heart_select.svg' : 'CBicons/CBfilled-heart.svg'
                  }`}
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

export default ReviewCard;
