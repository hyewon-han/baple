import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Carousel from '@/components/common/Carousel';
import YoutubeCard from '@/components/about/YoutubeCard';
import { Button } from '@nextui-org/react';
import { useViewport } from '@/hooks/useViewport';
import Link from 'next/link';

const AboutPage = () => {
  const { isMobile } = useViewport();
  const carouselData = [
    '/images/aboutPage/Carousel1.png',
    '/images/aboutPage/Carousel2.png',
    '/images/aboutPage/Carousel3.png',
    '/images/aboutPage/Carousel4.png',
    '/images/aboutPage/Carousel5.png',
  ];

  return (
    <div className='w-full flex flex-col justify-center items-center overflow-hidden'>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 2 }}
        className='sm:h-[60rem] h-auto w-full items-center flex-col flex'
      >
        <Image
          src={'/images/aboutPage/about_LOGO.png'}
          width={270}
          height={106}
          alt='이미지'
          className='relative sm:h-[162px] sm:w-[400px] h-[80px] w-[200px] z-10 mt-[100px]'
        />
        <p className='sm:mt-[200px] mt-[100px] text-[30px] font-extrabold'>
          Team Mission
        </p>
        <p className='w-[80%] sm:w-[60%] text-center mt-[80px] text-[18px] mb-[100px]  sm:text-[20px] break-words'>
          Baple은 Barrier Free와 Best Place를 결합해, 교통 약자들을 위한 배리어
          프리 정보를 소개하는 플랫폼입니다. 우리의 목표는 모든 사람이 쉽게
          이용할 수 있는 장소를 찾고 공유하며 더 나은 환경을 만들어가는
          것입니다.
        </p>
      </motion.div>

      <div className='w-full sm:h-[60rem]   h-auto flex flex-col  items-center bg-[#EFEAFF]'>
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
          className='w-full flex flex-col justify-center items-center  '
        >
          <YoutubeCard />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: '200px' }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
          className='w-[90%] sm:w-[50%]  '
        >
          <p className='font-extrabold text-[30px] mt-[50px] sm:mb-[10px] '>
            Barrier free?
          </p>
          <p className='text-[20px]  mb-[150px]'>
            배리어프리는 장벽을 뜻하는 배리어(Barrier)와 자유를 의미하는
            프리(Free) 의 합성어로, 장애인과 노약자 등 다양한 사회적 약자들이
            살기 좋은 사회를 만들기 위해 물리적, 제도적, 심리적 장벽을
            허물고자하는 노력입니다.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ x: '-200px', opacity: 0 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{ ease: 'easeInOut', duration: 1 }}
        className='sm:w-[50%] md:w-[80%] w-full h-full pt-[10%]'
        id='about'
      >
        <Carousel
          slidesPerView={1}
          slideHeight='full'
          slideData={carouselData}
        />
      </motion.div>

      <section className='bg-[#efe9ff] w-full h-auto relative p-10 md:p-20'>
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
        >
          <div className='text-center mb-4 md:mb-10 z-1'>
            <p className='text-xl font-bold md:text-3xl'>
              Barrier Free place is{' '}
              <span className='text-primary'>Best Place</span>
            </p>
            <p className='text-md md:text-xl'>
              당신을 위한 최고의 장소를 찾아보세요!
            </p>
          </div>
          <div>
            <div>
              <Image
                src={'/images/aboutPage/lastSectionImg.png'}
                width={800}
                height={500}
                sizes='100vw'
                alt='이미지'
                className='relative m-auto object-scale-down scale-90 sm:scale-100'
              />
            </div>
          </div>
          <div className='text-center'>
            <Link href={'/'}>
              <Button
                size={isMobile ? 'md' : 'lg'}
                className='rounded-full bg-primary text-white'
              >
                Baple 시작하기
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
