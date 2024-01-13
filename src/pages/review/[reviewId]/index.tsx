import Carousel from '@/components/common/Carousel';
import MainWrapper from '@/components/layout/MainWrapper';
import CommentInput from '@/components/review_details/CommentInput';
import CommentList from '@/components/review_details/CommentList';
import ReviewBody from '@/components/review_details/ReviewBody';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { REVIEW_ID } from '@/constants/temp_develop';
import { getReviewById } from '@/apis/reviews';
import { Spacer } from '@nextui-org/react';
import Seo from '@/components/layout/Seo';
import ReviewLikes from '@/components/review_details/ReviewLikes';

const ReviewPage = () => {
  const {
    data: review,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['review', REVIEW_ID],
    queryFn: () => getReviewById(REVIEW_ID),
  });

  if (isLoading) {
    return <p>리뷰 데이터 로딩중...</p>;
  }

  if (error) {
    return <p>오류 발생...</p>;
  }

  if (review) {
    const imgUrl = review.images_url as string[];
    return (
      <>
        <ReviewLikes reviewId={review.id} />
        <MainWrapper>
          <Seo title='Review' />
          {review?.images_url && (
            <Carousel
              slideData={imgUrl}
              slideHeight={'300px'}
              slidesPerView={4}
            />
          )}
          <Spacer y={10} />
          <ReviewBody review={review} />
          <Spacer y={10} />
          <CommentInput reviewId={review.id} />
          <CommentList reviewId={review.id} />
        </MainWrapper>
      </>
    );
  }
};

export default ReviewPage;
