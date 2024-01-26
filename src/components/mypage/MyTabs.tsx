import { getBookmarksByUserId } from '@/apis/bookmarks';
import { getLikedReviews, getReviewsByUserIdrpc } from '@/apis/reviews';
import PlaceCard2 from '../common/PlaceCard2';
import ReviewCard2 from '../common/ReviewCard2';
import { useQuery } from '@tanstack/react-query';
import { Card, CardBody, Tabs, Tab } from '@nextui-org/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import CardProfile from './MyProfile';
import { getMyBookmarkedPlaces } from '@/apis/places';
import PlaceCard from '../common/PlaceCard';
import ReviewCardMobile from '../common/ReviewCardMobile';
import { useViewport } from '@/hooks/useViewport';

const MyTabs = () => {
  const { userId } = useSelector((state: RootState) => state.auth);

  const { data: bookmarkedPlaces, isLoading: isBookmarksLoading } = useQuery({
    queryKey: ['bookmarkRPC', userId],
    queryFn: () => getMyBookmarkedPlaces(userId),
    enabled: !!userId,
  });

  const { data: likedReviews, isLoading: isLikesLoading } = useQuery({
    queryKey: ['likes', userId],
    queryFn: () => getLikedReviews(userId),
  });

  const { data: writtenReviews, isLoading: isWrittenReviewsLoading } = useQuery(
    {
      queryKey: ['reviews', userId],
      queryFn: () => getReviewsByUserIdrpc(userId),
    },
  );

  const { isMobile } = useViewport();

  console.log('내가 북마크한 장소', bookmarkedPlaces);
  console.log('내가 좋아요한 리뷰', likedReviews);
  console.log('내가 작성한 리뷰', writtenReviews);

  if (isBookmarksLoading || isLikesLoading || isWrittenReviewsLoading)
    return <div>로딩중...</div>;

  return (
    <div className='flex w-full flex-col'>
      <Tabs
        aria-label='Options'
        color='primary'
        className='w-full flex justify-center'
        size='lg'
        variant='underlined'
      >
        <Tab key='bookmarked' title='내가 북마크한 장소'>
          <Card>
            <CardBody>
              {bookmarkedPlaces?.length !== 0 ? (
                <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-12'>
                  {bookmarkedPlaces?.map((place, idx) => (
                    <PlaceCard key={idx} place={place} />
                  ))}
                </div>
              ) : (
                <div className='flex justify-center w-full '>
                  북마크한 장소가 없습니다 😢
                </div>
              )}
            </CardBody>
          </Card>
        </Tab>
        <Tab key='liked' title='내가 좋아요한 리뷰'>
          <Card>
            <CardBody>
              {likedReviews?.length === 0 && (
                <div className='flex justify-center w-full'>
                  좋아요한 리뷰가 없습니다. 😢
                </div>
              )}
              {!isMobile && (
                <div className='flex flex-col gap-1'>
                  {likedReviews?.map((review, idx) => (
                    <ReviewCard2 review={review} key={idx} />
                  ))}
                </div>
              )}
              {isMobile && (
                <div className='flex flex-col gap-1'>
                  {likedReviews?.map((review, idx) => (
                    <ReviewCardMobile review={review} key={idx} />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </Tab>

        <Tab key='written' title='내가 작성한 리뷰'>
          <Card>
            <CardBody>
              {writtenReviews?.length === 0 && (
                <div className='flex justify-center w-full'>
                  작성한 리뷰가 없습니다. 😢
                </div>
              )}
              {!isMobile && (
                <div className='flex flex-col gap-1'>
                  {writtenReviews?.map((review, idx) => (
                    <ReviewCard2 review={review} key={idx} />
                  ))}
                </div>
              )}
              {isMobile && (
                <div className='flex flex-col gap-1'>
                  {writtenReviews?.map((review, idx) => (
                    <ReviewCardMobile review={review} key={idx} />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default MyTabs;
