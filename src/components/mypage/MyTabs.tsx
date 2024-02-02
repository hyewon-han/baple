import { getBookmarksByUserId } from '@/apis/bookmarks';
import { getLikedReviews, getReviewsByUserIdrpc } from '@/apis/reviews';
import ReviewCard from '../common/ReviewCard';
import { useQuery } from '@tanstack/react-query';
import { Card, CardBody, Tabs, Tab, Spinner } from '@nextui-org/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import { getMyBookmarkedPlaces } from '@/apis/places';
import PlaceCard from '../common/PlaceCard';
import ReviewCardMobile from '../common/ReviewCardMobile';
import { useViewport } from '@/hooks/useViewport';
import Image from 'next/image';
import _ from 'lodash';

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
    select: (data) => {
      const recentOrderLiked = _.orderBy(data, 'created_at', 'desc');
      return { recentOrderLiked };
    },
  });

  const { data: writtenReviews, isLoading: isWrittenReviewsLoading } = useQuery(
    {
      queryKey: ['reviews', userId],
      queryFn: () => getReviewsByUserIdrpc(userId),
      select: (data) => {
        const recentOrderWritten = _.orderBy(data, 'created_at', 'desc');
        return { recentOrderWritten };
      },
    },
  );

  const { isMobile } = useViewport();

  if (isBookmarksLoading || isLikesLoading || isWrittenReviewsLoading)
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

  return (
    <div className='flex w-full flex-col'>
      <Tabs
        aria-label='Options'
        color='primary'
        className='w-full flex justify-center'
        size={isMobile ? 'sm' : 'lg'}
        variant='underlined'
      >
        <Tab key='bookmarked' title='북마크한 장소'>
          <Card>
            <CardBody>
              {bookmarkedPlaces?.length !== 0 ? (
                <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2 places-items-center '>
                  {bookmarkedPlaces?.map((place, idx) => (
                    <PlaceCard key={idx} place={place} />
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center gap-3 justify-center w-full my-5'>
                  <Image
                    src='/images/icons/character.svg'
                    alt='main_character'
                    width={100}
                    height={100}
                  />
                  <span className='font-bold'>
                    북마크한 장소가 없습니다. 😢
                  </span>
                </div>
              )}
            </CardBody>
          </Card>
        </Tab>
        <Tab key='liked' title='좋아요한 리뷰'>
          <Card>
            <CardBody>
              {likedReviews?.recentOrderLiked.length === 0 && (
                <div className='flex flex-col items-center gap-3 justify-center w-full my-5'>
                  <Image
                    src='/images/icons/character.svg'
                    alt='main_character'
                    width={100}
                    height={100}
                  />
                  <span className='font-bold'>
                    좋아요한 리뷰가 없습니다. 😢
                  </span>
                </div>
              )}
              {!isMobile && (
                <div className='flex flex-col gap-1'>
                  {likedReviews?.recentOrderLiked.map((review, idx) => (
                    <ReviewCard review={review} key={idx} />
                  ))}
                </div>
              )}
              {isMobile && (
                <div className='flex flex-col gap-1'>
                  {likedReviews?.recentOrderLiked.map((review, idx) => (
                    <ReviewCardMobile review={review} key={idx} />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </Tab>

        <Tab key='written' title='작성한 리뷰'>
          <Card>
            <CardBody>
              {writtenReviews?.recentOrderWritten.length === 0 && (
                <div className='flex flex-col items-center gap-3 justify-center w-full my-5'>
                  <Image
                    src='/images/icons/character.svg'
                    alt='main_character'
                    width={100}
                    height={100}
                  />
                  <span className='font-bold'>작성한 리뷰가 없습니다. 😢</span>
                </div>
              )}
              {!isMobile && (
                <div className='flex flex-col gap-1'>
                  {writtenReviews?.recentOrderWritten.map((review, idx) => (
                    <ReviewCard review={review} key={idx} />
                  ))}
                </div>
              )}
              {isMobile && (
                <div className='flex flex-col gap-1'>
                  {writtenReviews?.recentOrderWritten.map((review, idx) => (
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
