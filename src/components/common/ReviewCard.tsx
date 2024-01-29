import { getCommentsByReviewId } from '@/apis/comments';
import { getLikes } from '@/apis/likes';
import { getUserDataById } from '@/apis/users';
import { Tables } from '@/types/supabase';
// import { ReviewCard } from '@/types/types';
import { formatDate } from '@/utils/dateFormatter';
import { Avatar, Card, CardBody, CardFooter, Image } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {
  review: Tables<'reviews'>;
};

const ReviewCard = ({ review }: Props) => {
  const router = useRouter();
  // console.log('reviewProps! >> ', review);

  const { data: likes } = useQuery({
    queryKey: ['like', review.id],
    queryFn: () => getLikes(review.id),
  });

  const { data: comments } = useQuery({
    queryKey: ['comment', review.id],
    queryFn: () => getCommentsByReviewId(review.id),
  });

  const { data: user } = useQuery({
    queryKey: ['user', review.user_id],
    queryFn: () => getUserDataById(review.user_id),
  });

  // console.log('likesCount길이', likes?.length);
  // console.log('comments길이', comments?.length);
  // console.log('user data', user);

  return (
    <Card
      shadow='sm'
      // key={index}
      isPressable
      onPress={() => router.push(`/review/${review.id}`)}
      className='p-2 w-[230px] h-[280px]'
    >
      <CardBody className='overflow-visible p-0'>
        <Image
          shadow='sm'
          radius='lg'
          width='100%'
          height={230}
          alt='review image'
          className='w-full object-cover h-[140px]'
          src={
            Array.isArray(review?.images_url)
              ? (review?.images_url[0] as string)
              : undefined
          }
        />
      </CardBody>
      <CardFooter className='text-small justify-between flex flex-col'>
        <div className='flex flex-row w-full justify-between'>
          <div className='flex items-center gap-2'>
            <Avatar showFallback src={user?.avatar_url} />
            <span>{user?.user_name}</span>
          </div>
          <span className='text-gray-400 text-xs'>
            {formatDate(review.created_at)}
          </span>
        </div>
        <div className='flex flex-row justify-end'>
          <span className='mr-[6px]'>{comments?.length}개의 댓글</span>
          <span className='mr-[6px]'>❤️ {likes?.length}</span>
        </div>
        <p className='w-[100%] h-[100px] p-2 mt-2 bg-white'>{review.content}</p>
      </CardFooter>
    </Card>
  );
};

export default ReviewCard;
