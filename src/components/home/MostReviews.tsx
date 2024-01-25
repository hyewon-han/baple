import { getPlacesByReviewCount } from '@/apis/reviews';
import { useQuery } from '@tanstack/react-query';
import { getPlaceInfoList, getTopReviewedPlaces } from '@/apis/places';
import PlaceCard from '../common/PlaceCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Spacer } from '@nextui-org/react';
import { PlacesForPlaceCard } from '@/types/types';
import { useViewport } from '@/hooks/useViewport';

interface Props {
  initialData: PlacesForPlaceCard[];
}

const MostReviews = ({ initialData }: Props) => {
  const { isTablet } = useViewport();
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
    <div className='w-[90%] p-1'>
      <div className='flex flex-col gap-2'>
        <span className='text-2xl text-primary font-bold'>
          리뷰가 많은 장소
        </span>
        <span className='font-light'>리뷰가 많이 달렸어요!</span>
      </div>
      <Spacer y={4} />
      <Swiper
        loop={true} // 슬라이드 루프
        spaceBetween={20}
        slidesPerView={isTablet ? 2 : 4}
        navigation={true} // prev, next button
        modules={[Navigation, Autoplay]}
        autoplay={true}
        className=''
        allowTouchMove={false}
      >
        {topReviewedPlacesList?.map((place) => {
          return (
            <SwiperSlide key={place.unique_place_id}>
              <PlaceCard key={place.unique_place_id} place={place} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MostReviews;
