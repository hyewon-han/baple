import { getPlacesByReviewCount } from '@/apis/reviews';
import { useQuery } from '@tanstack/react-query';
import { getPlaceInfoList } from '@/apis/places';
import PlaceCard from '../common/PlaceCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Spacer } from '@nextui-org/react';

const MostReviews = () => {
  const { data: topReviewedPlaces, isLoading } = useQuery({
    queryKey: ['topReviewedPlaces'],
    queryFn: getPlacesByReviewCount,
  });

  const { data: topReviewedPlacesList, isLoading: placesListLoading } =
    useQuery({
      queryKey: ['topReviewedPlacesList'],
      queryFn: () => getPlaceInfoList(topReviewedPlaces),
      enabled: !!topReviewedPlaces,
    });

  if (isLoading || placesListLoading) {
    return <p>데이터 불러오는중...</p>;
  }

  return (
    <div className='w-[1050px] p-1'>
      <p>가장 많은 리뷰가 달린 장소</p>
      <Spacer y={4} />
      <Swiper
        loop={true} // 슬라이드 루프
        spaceBetween={1}
        slidesPerView={4}
        navigation={true} // prev, next button
        modules={[Navigation, Autoplay]}
        autoplay={true}
        className='w-full h-full'
        allowTouchMove={false}
      >
        {topReviewedPlacesList?.map((place) => {
          return (
            <SwiperSlide key={place.id}>
              <PlaceCard key={place.id} place={place} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MostReviews;
