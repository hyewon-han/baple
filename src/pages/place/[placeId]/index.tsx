import { getPlaceInfo } from '@/apis/places';
import { getReviewsByPlaceIdrpc } from '@/apis/reviews';
import MainWrapper from '@/components/layout/MainWrapper';
import { useQuery } from '@tanstack/react-query';
import PlaceDetail from '@/components/place_details/PlaceDetailInfo';
import { useRouter } from 'next/router';
import Seo from '@/components/layout/Seo';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import CarouselThumb from '@/components/common/Carousel_Thumb';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import { toastSuccess, toastWarn } from '@/libs/toastifyAlert';
import PlaceDetailInfoHeader from '@/components/place_details/PlaceDetailInfoHeader';
import { useBookmarks } from '@/hooks/useBookmarks';
import PlaceDetailReview from '@/components/place_details/PlaceDetailReview';
import PlaceDetailMap from '@/components/place_details/PlaceDetailMap';

export type ToggleBookmarkType = () => void;
export type ShowAlertType = () => void;

const PlacePage = () => {
  const router = useRouter();

  const placeId: string = router.query.placeId as string;

  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [recentOrder, setRecentOrder] = useState(true);
  const { userId, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { bookmarkState, insertBookmark, deleteBookmark } = useBookmarks(
    userId,
    placeId,
  );

  const { data: placeInfo, isLoading: placeInfoLoading } = useQuery({
    queryKey: ['placeInfo', placeId],
    queryFn: () => getPlaceInfo(placeId),
  });

  const { data: reviews, isLoading: reviewLoading } = useQuery({
    queryKey: ['reviews', placeId],
    queryFn: () => getReviewsByPlaceIdrpc(placeId),
    enabled: !!placeId,
    select: (data) => {
      const recentOrder = _.orderBy(data, 'created_at', 'desc');
      const likesOrder = _.orderBy(data, 'likes_count', 'desc');
      return { recentOrder, likesOrder };
    },
  });

  useEffect(() => {
    setIsBookmarked(bookmarkState ? bookmarkState.length > 0 : false);
  }, [bookmarkState]);

  const imgList = reviews?.recentOrder
    ?.map((item) => item.images_url)
    .flat()
    .filter((url) => url !== null) as string[];

  // 버튼 토글
  const toggleBookmark = () => {
    if (isBookmarked) {
      setIsBookmarked(false);
      deleteBookmark({ userId, placeId });
      toastSuccess('북마크가 해제되었습니다');
    } else {
      setIsBookmarked(true);
      insertBookmark({ userId, placeId });
      toastSuccess('북마크에 추가되었습니다');
    }
  };

  // 모달
  const showAlert = () => {
    toastWarn('로그인 후 이용해 주세요');
  };

  if (placeInfoLoading || reviewLoading) {
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

  return (
    <>
      <MainWrapper>
        <Seo title={`${placeInfo.place_name} | `} />
        {/* 장소 상세정보 - 모바일에서만 보임 */}
        <div className='flex items-center justify-between w-full mb-[20px] md:hidden'>
          <PlaceDetailInfoHeader
            placeId={placeId}
            placeInfo={placeInfo}
            isLoggedIn={isLoggedIn}
            isBookmarked={isBookmarked}
            toggleBookmark={toggleBookmark}
            showAlert={showAlert}
          />
        </div>
        {/* 이미지 캐러셀 */}
        <div className='flex flex-col items-center justify-start h-auto md:h-[500px] mb-[50px] mt-[10px] md:mt-[80px] md:flex-row md:justify-between'>
          <div className='w-full mb-[30px] md:mb-0 md:mr-[30px] md:w-[40%]'>
            {imgList && (
              <CarouselThumb
                slideData={
                  imgList.length !== 0
                    ? imgList
                    : ['/images/default_image2.png']
                } // imgList가 없으면 빈배열
              />
            )}
          </div>
          {/* 장소 상세정보 */}
          <PlaceDetail
            placeInfo={placeInfo}
            placeId={placeId}
            isLoggedIn={isLoggedIn}
            isBookmarked={isBookmarked}
            toggleBookmark={toggleBookmark}
            showAlert={showAlert}
          />
        </div>

        {/* 지도 */}
        <PlaceDetailMap placeInfo={placeInfo} />

        {/* 리뷰 */}
        <PlaceDetailReview
          placeId={placeId}
          recentOrder={recentOrder}
          setRecentOrder={setRecentOrder}
          reviews={reviews}
        />
      </MainWrapper>
    </>
  );
};

export default PlacePage;
