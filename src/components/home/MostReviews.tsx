import { useQuery } from '@tanstack/react-query';
import { getTopReviewedPlaces } from '@/apis/places';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Chip, Spacer } from '@nextui-org/react';
import { useViewport } from '@/hooks/useViewport';
import PlaceCard3 from '../common/PlaceCard3';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';

import type { PlacesForSearch } from '@/types/types';

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
      <div className='flex gap-2 items-center'>
        <span className='text-2xl text-primary font-bold'>
          리뷰가 많은 장소
        </span>
        <Chip color='primary' size='md' variant='flat'>
          TOP 8
        </Chip>
        {/* <span className='font-light'>리뷰가 많이 달렸어요!</span> */}
      </div>
      <Spacer y={4} />
      <Swiper
        loop={true} // 슬라이드 루프
        spaceBetween={5}
        // slidesPerView={2}
        navigation={true} // prev, next button
        modules={[Navigation, Autoplay]}
        // autoplay={true}
        className=''
        allowTouchMove={false}
        id={`${baple ? 'baple' : 'color_blind'}`}
        breakpoints={{
          375: { slidesPerView: 2 },
          640: { slidesPerView: 2 },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
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
