import { getPlaceInfo } from '@/apis/places';
import { getReviewsByPlaceIdrpc } from '@/apis/reviews';
import MainWrapper from '@/components/layout/MainWrapper';
import { useQuery } from '@tanstack/react-query';
import PlaceDetail from '@/components/place_detail/PlaceDetail';
import { useRouter } from 'next/router';
import Seo from '@/components/layout/Seo';
import _ from 'lodash';
import {
  CustomOverlayRoadview,
  Map,
  MapMarker,
  MapTypeControl,
  Roadview,
  RoadviewComponent,
  RoadviewMarker,
  ZoomControl,
} from 'react-kakao-maps-sdk';
import { useEffect, useRef, useState } from 'react';
import { Button, Divider, Spacer, Spinner } from '@nextui-org/react';
import CarouselThumb from '@/components/common/Carousel_Thumb';
import PaiginatedReviews from '@/components/place_detail/PaiginatedReviews';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import { toastSuccess, toastWarn } from '@/libs/toastifyAlert';
import PlaceDetailHeader from '@/components/place_detail/PlaceDetailHeader';
import { getBookmark } from '@/apis/bookmarks';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useTheme } from 'next-themes';

export type ToggleBookmarkType = () => void;
export type ShowAlertType = () => void;

const PlacePage = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const roadviewRef = useRef<kakao.maps.Roadview | null>(null);
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
  console.log('placeInfo', placeInfo);
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

  console.log({ placePosition });
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

  const Content = () => {
    return (
      <div className='bg-white  text-black w-[250px] h-[100px] rounded-[20px] flex items-center justify-center text-[20px] font-bold'>
        <p>{placeInfo.place_name}</p>
      </div>
    );
  };

  return (
    <MainWrapper>
      <Seo title={`${placeInfo.place_name} | `} />
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
      <div className='flex flex-col items-center justify-start h-auto md:h-[500px] mb-[50px] mt-[10px] md:mt-[80px] md:flex-row md:justify-between'>
        {imgList && (
          <div className='w-full mb-[30px] md:mb-0 md:mr-[30px] md:w-[40%]'>
            <CarouselThumb
              slideData={
                imgList.length !== 0 ? imgList : ['/images/default_image2.png']
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
        {toggle === 'map' && (
          <Map
            center={placePosition}
            draggable={false}
            // zoomable={true}
            scrollwheel={false}
            keyboardShortcuts={true}
            style={{
              // 지도의 크기
              width: '100%',
              height: '300px',
            }}
            level={4}
            minLevel={8}
          >
            <MapMarker
              position={placePosition}
              image={{
                src: `/images/icons/${
                  theme === 'baple' ? 'marker.svg' : 'CBicons/CBmarker.svg'
                }`, // 마커이미지의 주소입니다
                size: {
                  width: 44,
                  height: 40,
                },
              }}
            />
            <Button
              className='absolute flex z-10 top-[3px] left-[130px] w-[90px] h-[32px] justify-center'
              variant='solid'
              color='primary'
              onClick={() => setToggle('roadview')}
              title='지도 보기'
            >
              로드뷰 보기
            </Button>
            <MapTypeControl position={'TOPLEFT'} />
            <ZoomControl position={'LEFT'} />
          </Map>
        )}

        {toggle === 'roadview' && (
          <Roadview
            position={{ ...placePosition, radius: 200 }}
            style={{
              width: '100%',
              height: '300px',
            }}
            ref={roadviewRef}
          >
            {/* <RoadviewMarker position={placePosition} /> */}
            <Button
              className='absolute top-[5px] left-[5px] z-10 flex w-[90px] h-[32px] justify-center'
              variant='solid'
              color='primary'
              onClick={() => setToggle('map')}
              title='지도 보기'
            >
              지도
            </Button>
            <CustomOverlayRoadview
              position={placePosition}
              xAnchor={0.5}
              yAnchor={0.5}
              onCreate={(overlay) => {
                const roadview = roadviewRef.current;

                if (!roadview) {
                  return;
                }

                const projection = roadview.getProjection(); // viewpoint(화면좌표)값을 추출할 수 있는 projection 객체를 가져옵니다.
                // 커스텀오버레이의 position과 altitude값을 통해 viewpoint값(화면좌표)를 추출합니다.
                console.log(overlay.getPosition());
                const viewpoint = projection.viewpointFromCoords(
                  overlay.getPosition(),
                  overlay.getAltitude(),
                );
                roadview.setViewpoint(viewpoint); //커스텀 오버레이를 로드뷰의 가운데에 오도록 로드뷰의 시점을 변화 시킵니다.
              }}
            >
              <Content />
            </CustomOverlayRoadview>
          </Roadview>
        )}
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
              color='primary'
              className='px-8 py-2 rounded-full text-sm sm:text-md'
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
        <Spacer y={10} />
      </section>
    </MainWrapper>
  );
};

export default PlacePage;
