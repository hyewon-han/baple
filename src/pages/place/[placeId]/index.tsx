import { getPlaceInfo } from '@/apis/places';
import { getReviewsByPlaceIdrpc } from '@/apis/reviews';
import MainWrapper from '@/components/layout/MainWrapper';
import { useQuery } from '@tanstack/react-query';
import PlaceDetail from '@/components/place_detail/PlaceDetail';
import { useRouter } from 'next/router';
import Seo from '@/components/layout/Seo';
import _ from 'lodash';
import {
  Map,
  MapMarker,
  MapTypeControl,
  Roadview,
  RoadviewMarker,
  ZoomControl,
} from 'react-kakao-maps-sdk';
import { useEffect, useState } from 'react';
import { Button, Divider } from '@nextui-org/react';
import CarouselThumb from '@/components/common/Carousel_Thumb';
import PaiginatedReviews from '@/components/place_detail/PaiginatedReviews';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import { toastSuccess, toastWarn } from '@/libs/toastifyAlert';
import PlaceDetailHeader from '@/components/place_detail/PlaceDetailHeader';
import { getBookmark } from '@/apis/bookmarks';
import { useBookmarks } from '@/hooks/useBookmarks';

export type ToggleBookmarkType = () => void;
export type ShowAlertType = () => void;

const PlacePage = () => {
  const router = useRouter();
  const placeId: string = router.query.placeId as string;
  const [toggle, setToggle] = useState('map');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [recentOrder, setRecentOrder] = useState(true);
  const { userId, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { insertBookmark, deleteBookmark } = useBookmarks(userId, placeId);

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

  const { data: bookmarkState } = useQuery({
    queryKey: ['bookmark', userId, placeId],
    queryFn: () => getBookmark({ userId, placeId }),
    enabled: !!userId,
  });

  useEffect(() => {
    setIsBookmarked(bookmarkState ? bookmarkState.length > 0 : false);
  }, [bookmarkState]);

  const imgList = reviews?.recentOrder
    ?.map((item) => item.images_url)
    .flat()
    .filter((url) => url !== null) as string[];

  let placePosition = {
    lat: placeInfo?.lat,
    lng: placeInfo?.lng,
  };

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
    return <div>Loading...</div>;
  }

  return (
    <MainWrapper>
      <Seo title={placeInfo.place_name} />
      <div className='flex items-center justify-between w-full mb-[20px] sm:hidden'>
        <PlaceDetailHeader
          placeId={placeId}
          placeInfo={placeInfo}
          isLoggedIn={isLoggedIn}
          isBookmarked={isBookmarked}
          toggleBookmark={toggleBookmark}
          showAlert={showAlert}
        />
      </div>
      {/* 이미지 캐러셀 */}
      <div className='flex flex-col items-center justify-start h-auto sm:h-[500px] mb-[50px] mt-[10px] sm:mt-[80px] sm:flex-row sm:justify-between'>
        {imgList && (
          <div className='w-full mb-[20px] sm:w-[48%]'>
            <CarouselThumb
              slideData={
                imgList.length !== 0
                  ? imgList
                  : ['https://dummyimage.com/600x400/000/fff.png&text=baple']
              } // imgList가 없으면 빈배열
            />
          </div>
        )}
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
      <section className='mb-[30px] relative'>
        <Map
          center={placePosition}
          draggable={false}
          style={{
            // 지도의 크기
            width: '100%',
            height: '500px',
            display: toggle === 'map' ? 'block' : 'none',
          }}
          level={8}
          maxLevel={8}
        >
          <MapMarker
            position={placePosition}
            image={{
              src: '/images/icons/marker.svg', // 마커이미지의 주소입니다
              size: {
                width: 44,
                height: 40,
              },
            }}
          />
          {toggle === 'map' && (
            <Button
              className='absolute flex z-10 top-[3px] left-[130px] w-[90px] h-[32px] justify-center'
              variant='solid'
              color='primary'
              onClick={() => setToggle('roadview')}
              title='지도 보기'
            >
              로드맵 보기
            </Button>
          )}
          <MapTypeControl position={'TOPLEFT'} />
          <ZoomControl position={'LEFT'} />
        </Map>

        <Roadview
          position={{ ...placePosition, radius: 200 }}
          style={{
            display: toggle === 'roadview' ? 'block' : 'none',
            width: '100%',
            height: '500px',
          }}
        >
          <RoadviewMarker position={placePosition} />
          {toggle === 'roadview' && (
            <Button
              className='absolute top-[5px] left-[5px] z-10 flex w-[90px] h-[32px] justify-center'
              variant='solid'
              color='primary'
              onClick={() => setToggle('map')}
              title='지도 보기'
            >
              지도
            </Button>
          )}
          <RoadviewMarker position={placePosition}>
            <div className='flex justify-center items-center rounded-[20px]'>
              {placeInfo.place_name}
            </div>
          </RoadviewMarker>
        </Roadview>
      </section>

      {/* 리뷰 */}
      <section>
        <div className='flex mt-[100px] mb-[30px] justify-between'>
          <h2 className='text-2xl sm:text-3xl font-bold'>방문자 리뷰</h2>
          {isLoggedIn ? (
            <Button
              color='primary'
              className='px-4 sm:px-8 py-2 rounded-full text-sm sm:text-md'
              onClick={() => router.push(`/review/write/${placeId}`)}
            >
              리뷰 작성하기
            </Button>
          ) : (
            <Button
              className='bg-primary px-8 py-2 rounded-full text-black'
              onClick={() => toastWarn('로그인 후 이용해주세요')}
            >
              리뷰 작성하기
            </Button>
          )}
        </div>
        <Divider className='h-0.5 mb-[30px]' />
        <div className='text-right mb-[20px] px-[10px]'>
          <span
            className={`mr-[20px] text-gray-500 text-sm cursor-pointer ${
              recentOrder ? 'border-b-2' : ''
            }`}
            onClick={() => {
              setRecentOrder(true);
            }}
          >
            최신순
          </span>
          <span
            className={`text-gray-500 text-sm cursor-pointer ${
              !recentOrder ? 'border-b-2' : ''
            }`}
            onClick={() => {
              setRecentOrder(false);
            }}
          >
            추천순
          </span>
        </div>
        <div className='flex flex-col justify-center gap-y-5 items-center'>
          {/* 리뷰카드 */}
          {reviews?.likesOrder.length === 0 ? (
            <p>등록된 리뷰가 없습니다</p>
          ) : (
            <PaiginatedReviews
              reviews={recentOrder ? reviews?.recentOrder : reviews?.likesOrder}
            />
          )}
        </div>
      </section>
    </MainWrapper>
  );
};

export default PlacePage;
