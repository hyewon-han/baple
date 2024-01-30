import { useQuery } from '@tanstack/react-query';
import { getTopReviewedPlaces } from '@/apis/places';
import PlaceCard from '../common/PlaceCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Spacer } from '@nextui-org/react';
import { useViewport } from '@/hooks/useViewport';
import type { PlacesForPlaceCard, PlacesForSearch } from '@/types/types';
import PlaceCard3 from '../common/PlaceCard3';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';

interface Props {
  initialData: PlacesForSearch[];
}

const MostReviews = ({ initialData }: Props) => {
  const { isMobile, isTablet } = useViewport();
  const { baple } = useCurrentTheme();

  const { data: topReviewedPlacesList, isLoading: placesListLoading } =
    useQuery({
      queryKey: ['topReviewedPlacesList'],
      queryFn: getTopReviewedPlaces,
      initialData: initialData,
    });

  if (placesListLoading) {
    return <p>데이터 불러오는중...</p>;
  }

  return (
    <div className='w-full '>
      <div className='flex flex-col gap-2'>
        <span className='text-2xl text-primary font-bold'>
          리뷰가 많은 장소
        </span>
        <span className='font-light'>리뷰가 많이 달렸어요!</span>
      </div>
      <Spacer y={4} />
      <Swiper
        loop={true} // 슬라이드 루프
        spaceBetween={5}
        slidesPerView={isMobile ? 2 : isTablet ? 2 : 4}
        navigation={true} // prev, next button
        modules={[Navigation, Autoplay]}
        autoplay={true}
        className=''
        allowTouchMove={false}
        id={`${baple ? 'baple' : 'color_blind'}`}
      >
        {topReviewedPlacesList?.map((place) => {
          return (
            <SwiperSlide key={place.unique_place_id}>
              <PlaceCard3 key={place.unique_place_id} place={place} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MostReviews;
