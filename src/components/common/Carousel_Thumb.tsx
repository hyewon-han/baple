import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Scrollbar,
  Autoplay,
  FreeMode,
  Thumbs,
} from 'swiper/modules';
import SwiperCore from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import Image from 'next/image';
import { useState } from 'react';

const CarouselThumb = ({
  slidesPerView,
  slideHeight,
  slideData,
}: {
  slidesPerView: number;
  slideHeight: string;
  slideData: string[];
}) => {
  SwiperCore.use([Navigation, Scrollbar, Autoplay, Thumbs, FreeMode]);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);

  return (
    <section className={`swiper-container`}>
      <Swiper
        loop={true} // 슬라이드 루프
        spaceBetween={10} // 슬라이스 사이 간격
        slidesPerView={slidesPerView} // 보여질 슬라이스 수
        navigation={true} // prev, next button
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className='mb-[4px]'
        id='imgCarousel'
        // autoplay={{
        //   delay: 2500,
        //   disableOnInteraction: false, // 사용자 상호작용시 슬라이더 일시 정지 비활성
        // }}
      >
        {slideData.map((slide: string) => (
          <SwiperSlide key={slide}>
            <div className={`bg-slate-400 h-[400px]`}>
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
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true} // 슬라이드 루프
        spaceBetween={4} // 슬라이스 사이 간격
        slidesPerView={5} // 보여질 슬라이스 수
        navigation={true} // prev, next button
        watchSlidesProgress={true}
        slideToClickedSlide
        className='thumbs cursor-pointer'
        // autoplay={{
        //   delay: 2500,
        //   disableOnInteraction: false, // 사용자 상호작용시 슬라이더 일시 정지 비활성
        // }}
      >
        {slideData.map((slide: string) => (
          <SwiperSlide key={slide}>
            <div className={`bg-slate-400 h-[100px]`}>
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

export default CarouselThumb;
