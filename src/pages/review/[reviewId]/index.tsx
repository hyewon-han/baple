import Carousel from '@/components/common/Carousel';
import MainWrapper from '@/components/layout/MainWrapper';
import CommentInput from '@/components/review_details/CommentInput';
import CommentList from '@/components/review_details/CommentList';
import ReviewBody from '@/components/review_details/ReviewBody';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { getReviewById } from '@/apis/reviews';
import { Card, CardBody, Spacer } from '@nextui-org/react';
import Seo from '@/components/layout/Seo';
import { useRouter } from 'next/router';
import ReviewLikes from '@/components/review_details/ReviewLikes';
import ReviewUpperSection from '@/components/review_details/ReviewUpperSection';
import { getAllComments } from '@/apis/comments';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';

const ReviewPage = () => {
  const router = useRouter();
  const reviewId = router.query.reviewId as string;
  const [isEditing, setIsEditing] = useState(false);

  const { userId: currentUserId } = useSelector(
    (state: RootState) => state.auth,
  );

  const { data: comments } = useQuery({
    queryKey: ['comments', reviewId],
    queryFn: () => getAllComments(reviewId),
  });

  const {
    data: review,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['review', reviewId],
    queryFn: () => getReviewById(reviewId),
  });

  if (isLoading) {
    return <p>리뷰 데이터 로딩중...</p>;
  }

  if (error) {
    return <p>오류 발생...</p>;
  }

  if (review) {
    const imgUrl = review.images_url as string[];
    const commentsCount = comments?.length;
    console.log('commentsCount', commentsCount);
    return (
      <>
        <MainWrapper>
          <Seo title='리뷰' />
          <Card>
            <CardBody className='px-[40px]'>
              <ReviewUpperSection
                review={review}
                setIsEditing={setIsEditing}
                isEditing={isEditing}
                currentUserId={currentUserId}
              />

              <Seo title='Review' />
              <ReviewLikes review={review} />
              {review?.images_url && (
                <Carousel
                  slideData={imgUrl}
                  slideHeight={'300px'}
                  slidesPerView={4}
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
                commentsCount={commentsCount}
              />
              <div className='flex flex-col'>
                <CommentList comments={comments} />
              </div>
            </CardBody>
          </Card>
        </MainWrapper>
      </>
    );
  }
};

export default ReviewPage;
