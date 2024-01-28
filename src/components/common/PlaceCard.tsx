import { Chip } from '@nextui-org/react';
import { useRouter } from 'next/router';
import type { PlacesForSearch } from '@/types/types';
import NextImage from 'next/image'; // 모듈명 변경
import Link from 'next/link';
import { useTheme } from 'next-themes';

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

  const imgURL =
    image_url !== null
      ? image_url
      : 'https://velog.velcdn.com/images/jetiiin/post/6cd59108-3d13-449c-814b-4ee50af9fc9f/image.png';

  const { theme } = useTheme();

  return (
    <div className='m-1'>
      {/* <Card
        shadow='sm'
        // key={index}
        isPressable
        isHoverable
        onPress={() => router.push(`/place/${unique_place_id}`)}
        className='w-full h-full flex flex-col items-center rounded-3xl aspect-auto '
      >
        <CardBody
          className='overflow-visible rounded-3xl flex items-center'
          // onMouseEnter={() => setIsHovered(true)}
          // onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            width='100%'
            height='100%'
            alt={place_name}
            className='w-96 object-cover h-80 rounded-3xl shadow-xl hover:bg-red-300'
            src={imgURL}
          />
          {isHovered && (
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
              <MdPhotoCameraBack size={40} />
            </div>
          )}
        </CardBody>
        <CardFooter className='flex flex-col w-full'>
          <div className='flex flex-col items-start w-full'>
            <span className='text-sm'>{city}</span>
            <span className='text-base font-bold'>{place_name}</span>
          </div>
          <div className='flex gap-2 w-full justify-end'>
            <span className='flex gap-1 items-center justify-center'>
              <NextImage
                src='/images/icons/write_select.svg'
                width={20}
                height={20}
                alt='write_icon'
                // className='object-cover'
              />
              {reviews_count}
            </span>
            <span className='flex gap-2 items-center justify-center'>
              <NextImage
                src='/images/icons/bookmark_select.svg'
                width={20}
                height={20}
                alt='bookmark_icon'
                className='object-cover'
              />
              {bookmarks_count}
            </span>
          </div>
        </CardFooter>
      </Card> */}
      {/* <Card
        isFooterBlurred
        isPressable
        isHoverable
        onPress={() => router.push(`/place/${unique_place_id}`)}
        className='w-full h-[300px] col-span-12 sm:col-span-5'
      >
        <CardHeader className='absolute z-10 top-1 flex-col items-start '></CardHeader>
        <Image
          removeWrapper
          alt='Card example background'
          className='z-0 w-full h-full scale-125 -translate-y-6 object-cover'
          src={imgURL}
        />
        <CardFooter className='absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 flex flex-col justify-start items-start'>
          <div className='flex justify-between w-full'>
            <p className='text-tiny text-gray-800 uppercase font-bold'>
              {city}
            </p>
            <div className='flex gap-2 justify-end'>
              <span className='flex gap-1 items-center justify-center'>
                <NextImage
                  src='/images/icons/write_select.svg'
                  width={20}
                  height={20}
                  alt='write_icon'
                  // className='object-cover'
                />
                {reviews_count}
              </span>
              <span className='flex gap-2 items-center justify-center'>
                <NextImage
                  src='/images/icons/bookmark_select.svg'
                  width={15}
                  height={15}
                  alt='bookmark_icon'
                  className='object-cover'
                />
                {bookmarks_count}
              </span>
            </div>
          </div>
          <h4 className='text-gray-800 font-bold text-base'>{place_name}</h4>
        </CardFooter>
      </Card>
      <div className='grid grid-cols-3 gap-2 place-items-start mt-2'>
        {is_paid ? (
          <Chip size='sm' variant='flat'>
            입장료
          </Chip>
        ) : null}
        {is_easy_door ? (
          <Chip size='sm' variant='flat'>
            장애인용 출입문
          </Chip>
        ) : null}
        {is_wheelchair_rental ? (
          <Chip size='sm' variant='flat'>
            휠체어 대여
          </Chip>
        ) : null}
        {is_guide_dog ? (
          <Chip size='sm' variant='flat'>
            안내견 동반
          </Chip>
        ) : null}
        {is_braille_guide ? (
          <Chip size='sm' variant='flat'>
            점자 가이드
          </Chip>
        ) : null}
        {is_audio_guide ? (
          <Chip size='sm' variant='flat'>
            오디오 가이드
          </Chip>
        ) : null}
        {is_disabled_toilet ? (
          <Chip size='sm' variant='flat'>
            장애인용 화장실
          </Chip>
        ) : null}
        {is_disabled_parking ? (
          <Chip size='sm' variant='flat'>
            장애인용 주차장
          </Chip>
        ) : null}
      </div> */}
      <Link href={`/place/${unique_place_id}`}>
        <div className='relative w-[9.5rem] h-[7.25rem] mx-auto sm:w-[19rem] sm:h-[14.5rem] transition-all ring-2 ring-gray-100 rounded-3xl overflow-hidden shadow-md hover:ring-4 hover:ring-primary '>
          <NextImage
            src={imgURL}
            alt='place_image'
            fill={true}
            className='rounded-3xl'
          />
          <div className='absolute top-0 w-full h-full transition-opacity cursor-pointer backdrop-blur-sm backdrop-brightness-50 opacity-0 hover:opacity-100 grid grid-cols-2 place-items-start pb-16 px-5 pt-5 rounded-xl'>
            {is_paid ? (
              <Chip size='sm' variant='solid'>
                입장료
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
                      theme === 'baple'
                        ? 'write_select.svg'
                        : 'CBicons/CBwrite_select.svg'
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
                      theme === 'baple'
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
    </div>
  );
};

export default PlaceCard;
