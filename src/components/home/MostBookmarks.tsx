import { useQuery } from '@tanstack/react-query';
import { getTopBookmarkedPlaces } from '@/apis/places';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Chip, Spacer } from '@nextui-org/react';
import PlaceCard3 from '../common/PlaceCard3';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';

import type { PlacesForSearch } from '@/types/types';

interface Props {
  initialData: PlacesForSearch[];
}

const MostBookmarks = ({ initialData }: Props) => {
  const { baple } = useCurrentTheme();

  const { data: topBookmarkedPlacesList, isLoading: placesListLoading } =
    useQuery({
      queryKey: ['topBookmarkedPlacesList'],
      queryFn: getTopBookmarkedPlaces,
      initialData: initialData,
    });

  if (placesListLoading) {
    return <p>데이터 불러오는중...</p>;
  }

  return (
    <div className='w-full'>
      <div className='flex gap-2 items-center'>
        <span className='text-2xl text-primary font-bold'>
          사람들이 즐겨 찾는 장소
        </span>
        <Chip color='primary' size='md' variant='flat'>
          TOP 8
        </Chip>
      </div>
      <Spacer y={4} />
      <Swiper
        loop={true} // 슬라이드 루프
        spaceBetween={5}
        navigation={true} // prev, next button
        modules={[Navigation, Autoplay]}
        autoplay={true}
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
        {topBookmarkedPlacesList?.map((place) => {
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

export default MostBookmarks;
