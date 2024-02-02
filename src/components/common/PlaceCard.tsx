import { Chip } from '@nextui-org/react';
import { useRouter } from 'next/router';
import type { PlacesForSearch } from '@/types/types';
import NextImage from 'next/image'; // 모듈명 변경
import Link from 'next/link';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import useLocalStorage from 'use-local-storage';

interface Props {
  place: PlacesForSearch;
}

const PlaceCard = ({ place }: Props) => {
  const router = useRouter();
  const {
    bookmarks_count,
    reviews_count,
    city,
    image_url,
    place_name,
    unique_place_id,
    is_audio_guide,
    is_braille_guide,
    is_disabled_parking,
    is_disabled_toilet,
    is_easy_door,
    is_guide_dog,
    is_paid,
    is_wheelchair_rental,
  } = place;

  const imgURL = image_url !== '' ? image_url : '/images/default_image2.png';

  const { baple } = useCurrentTheme();
  const [scrollY, setScrollY] = useLocalStorage('places_list_scroll', 0);

  return (
    <Link
      href={`/place/${unique_place_id}`}
      onClick={() => setScrollY(window.scrollY)}
    >
      <div className='relative w-[90%] h-[200px] mx-auto sm:w-full sm:h-[14.5rem] transition-all ring-2 ring-gray-100 rounded-3xl overflow-hidden shadow-md hover:ring-4 hover:ring-primary '>
        <NextImage
          src={imgURL}
          alt='place_image'
          fill={true}
          className='rounded-3xl'
        />
        <div className='absolute top-0 w-full h-full transition-opacity cursor-pointer backdrop-blur-sm backdrop-brightness-50 opacity-0 hover:opacity-100 grid grid-cols-2 place-items-start pb-16 px-5 pt-5 rounded-xl'>
          {is_paid ? (
            <Chip size='sm' variant='solid'>
              입장료 있음
            </Chip>
          ) : null}
          {is_easy_door ? (
            <Chip size='sm' variant='solid'>
              장애인용 출입문
            </Chip>
          ) : null}
          {is_wheelchair_rental ? (
            <Chip size='sm' variant='solid'>
              휠체어 대여
            </Chip>
          ) : null}
          {is_guide_dog ? (
            <Chip size='sm' variant='solid'>
              안내견 동반
            </Chip>
          ) : null}
          {is_braille_guide ? (
            <Chip size='sm' variant='solid'>
              점자 가이드
            </Chip>
          ) : null}
          {is_disabled_parking ? (
            <Chip size='sm' variant='solid'>
              장애인용 주차장
            </Chip>
          ) : null}
          {is_audio_guide ? (
            <Chip size='sm' variant='solid'>
              오디오 가이드
            </Chip>
          ) : null}
          {is_disabled_toilet ? (
            <Chip size='sm' variant='solid'>
              장애인용 화장실
            </Chip>
          ) : null}
        </div>
        <div className='absolute h-[4rem]  w-full bottom-0 p-2  text-black bg-white bg-opacity-90'>
          <div className='flex'>
            <p className='text-xs mt-1 w-full whitespace-nowrap text-ellipsis overflow-hidden'>
              {city}
            </p>
            <div className='flex gap-2 w-full justify-end'>
              <span className='flex gap-1 items-center justify-center'>
                <NextImage
                  src={`/images/icons/${
                    baple ? 'write_select.svg' : 'CBicons/CBwrite_select.svg'
                  }`}
                  width={20}
                  height={20}
                  alt='write_icon'
                  // className='object-cover'
                />
                {reviews_count}
              </span>
              <span className='flex gap-2 items-center justify-center'>
                <NextImage
                  src={`/images/icons/${
                    baple
                      ? 'bookmark_select.svg'
                      : 'CBicons/CBbookmark_select_.svg'
                  }`}
                  width={15}
                  height={15}
                  alt='bookmark_icon'
                  className='object-cover'
                />
                {bookmarks_count}
              </span>
            </div>
          </div>
          <p className='font-bold text-md whitespace-nowrap text-ellipsis overflow-hidden'>
            {place_name}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;
