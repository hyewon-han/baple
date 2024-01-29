import Carousel from '@/components/common/Carousel';
import MainWrapper from '@/components/layout/MainWrapper';
import CommentInput from '@/components/review_details/CommentInput';
import CommentList from '@/components/review_details/CommentList';
import ReviewBody from '@/components/review_details/ReviewBody';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { getReviewById } from '@/apis/reviews';
import { Spacer, Spinner } from '@nextui-org/react';
import Seo from '@/components/layout/Seo';
import { useRouter } from 'next/router';
import ReviewUpperSection from '@/components/review_details/ReviewUpperSection';
import { getAllComments } from '@/apis/comments';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import { useViewport } from '@/hooks/useViewport';
import _ from 'lodash';

const ReviewPage = () => {
  const router = useRouter();
  const reviewId = router.query.reviewId as string;
  const [isEditing, setIsEditing] = useState(false);

  const { userId: currentUserId } = useSelector(
    (state: RootState) => state.auth,
  );

  const { isTablet, isMobile } = useViewport();

  const { data: comments } = useQuery({
    queryKey: ['comments', reviewId],
    queryFn: () => getAllComments(reviewId),
    select: (data) => {
      const descComments = _.orderBy(data, 'created_at', 'desc');
      return { descComments };
    },
  });

  const {
    data: review,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['review', reviewId],
    queryFn: () => getReviewById(reviewId),
  });

  const placeId = review?.place_id;

  if (isLoading) {
    return (
      <div className='w-[100%] h-[90vh] flex items-center justify-center'>
        <Spinner
          label='로딩중!'
          color='primary'
          size='lg'
          labelColor='primary'
        />
      </div>
    );
  }

  if (error) {
    return <p>오류 발생...</p>;
  }

  if (review) {
    const imgUrl = review.images_url as string[];
    const commentsCount = comments?.descComments.length;
    // console.log('commentsCount', commentsCount);
    return (
      <>
        <MainWrapper>
          <Seo />
          <ReviewUpperSection
            review={review}
            setIsEditing={setIsEditing}
            isEditing={isEditing}
            currentUserId={currentUserId}
          />
          {review?.images_url && (
            <Carousel
              slideData={imgUrl}
              slideHeight={'300px'}
              slidesPerView={isMobile ? 1 : 3}
            />
          )}
          <Spacer y={10} />
          <ReviewBody
            review={review}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
          <Spacer y={10} />
          <CommentInput
            reviewId={review.id}
            placeId={review.place_id}
            commentsCount={commentsCount}
          />
          <Spacer y={1} />

          <div className='flex flex-col'>
            <CommentList comments={comments?.descComments} />
          </div>
        </MainWrapper>
      </>
    );
  }
};

export default ReviewPage;
