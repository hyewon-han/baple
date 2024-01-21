import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Scrollbar,
  Autoplay,
  Pagination,
  Keyboard,
} from 'swiper/modules';
import SwiperCore from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/pagination';
import Image from 'next/image';

const Carousel = ({
  slidesPerView,
  slideHeight,
  slideData,
}: {
  slidesPerView: number;
  slideHeight: string;
  slideData: string[];
}) => {
  SwiperCore.use([Navigation, Scrollbar, Autoplay]);

  return (
    <section id='imgCarousel' className={`swiper-container mb-[20px]`}>
      <Swiper
        pagination={{
          clickable: true,
        }}
        modules={[Keyboard, Pagination, Navigation]}
        className='mySwiper'
        loop={true} // 슬라이드 루프
        spaceBetween={10} // 슬라이스 사이 간격
        slidesPerView={slidesPerView} // 보여질 슬라이스 수
        navigation={true} // prev, next button
        autoplay={{
          delay: 2500,
          disableOnInteraction: false, // 사용자 상호작용시 슬라이더 일시 정지 비활성
        }}
        keyboard={{
          enabled: true,
        }}
      >
        {slideData.map((slide: string) => (
          <SwiperSlide key={slide}>
            <div className={`bg-slate-400 h-[${slideHeight}]`}>
              <Image
                src={slide}
                width={200}
                height={500}
                className='object-fill w-full h-full'
                alt='img'
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Carousel;
