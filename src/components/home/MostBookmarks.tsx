import { useQuery } from '@tanstack/react-query';
import { getPlaceInfoList, getTopBookmarkedPlaces } from '@/apis/places';
import PlaceCard from '../common/PlaceCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { getPlacesByBookmarkCount } from '@/apis/bookmarks';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Spacer } from '@nextui-org/react';
import { PlacesForPlaceCard } from '@/types/types';
import { useViewport } from '@/hooks/useViewport';

interface Props {
  initialData: PlacesForPlaceCard[];
}

const MostBookmarks = ({ initialData }: Props) => {
  const { isTablet } = useViewport();
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
    <div className='w-[90%] p-1'>
      <div className='flex flex-col gap-2'>
        <span className='text-2xl text-primary font-bold'>
          많은 사람들이 즐겨 찾는 장소
        </span>
        <span className='font-light'>많은 사람들이 즐겨 찾았어요!</span>
      </div>
      <Spacer y={4} />
      <Swiper
        loop={true} // 슬라이드 루프
        spaceBetween={20}
        slidesPerView={isTablet ? 2 : 4}
        navigation={true} // prev, next button
        modules={[Navigation, Autoplay]}
        autoplay={true}
        allowTouchMove={false}
      >
        {topBookmarkedPlacesList?.map((place) => {
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

export default MostBookmarks;
