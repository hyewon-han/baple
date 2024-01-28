import { shareKakao } from '@/utils/shareKaKao';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { PlaceInfoAllData } from './PlaceDetail';
import Image from 'next/image';
import { useViewport } from '@/hooks/useViewport';
import { useTheme } from 'next-themes';

const PlaceDetailHeader = ({
  placeId,
  placeInfo,
  isLoggedIn,
  isBookmarked,
  toggleBookmark,
  showAlert,
}: PlaceInfoAllData) => {
  const { isMobile } = useViewport();
  const { theme } = useTheme();
  return (
    <>
      <h1 className='text-2xl font-bold md:text-3xl'>{placeInfo.place_name}</h1>
      <div className='flex'>
        {isLoggedIn ? (
          isBookmarked ? (
            <>
              <Image
                src={`/images/icons/${
                  theme === 'baple'
                    ? 'bookmark_select.svg'
                    : 'CBicons/CBbookmark_select_.svg'
                }`}
                alt='bookmark'
                width={isMobile ? 24 : 34}
                height={isMobile ? 24 : 34}
                className='cursor-pointer mr-[10px]'
                onClick={toggleBookmark}
              />

              <Image
                src={`/images/icons/${
                  theme === 'baple'
                    ? 'share_select.svg'
                    : 'CBicons/CBshare_select.svg'
                }`}
                alt='kakao share'
                width={isMobile ? 24 : 34}
                height={isMobile ? 24 : 34}
                className='cursor-pointer'
                onClick={() =>
                  shareKakao({
                    address: placeInfo?.address,
                    place_name: placeInfo?.place_name,
                    placeId,
                  })
                }
              />
            </>
          ) : (
            <>
              <Image
                src={`/images/icons/${
                  theme === 'baple' ? 'bookmark.svg' : 'CBicons/CBbookmark.svg'
                }`}
                alt='bookmark'
                width={isMobile ? 24 : 34}
                height={isMobile ? 24 : 34}
                className='cursor-pointer mr-[10px]'
                onClick={toggleBookmark}
              />

              <Image
                src={`/images/icons/${
                  theme === 'baple'
                    ? 'share_select.svg'
                    : 'CBicons/CBshare_select.svg'
                }`}
                alt='kakao share'
                width={isMobile ? 24 : 34}
                height={isMobile ? 24 : 34}
                className='cursor-pointer'
                onClick={() =>
                  shareKakao({
                    address: placeInfo?.address,
                    place_name: placeInfo?.place_name,
                    placeId,
                  })
                }
              />
            </>
          )
        ) : (
          <>
            <Image
              src='/images/icons/bookmark.svg'
              alt='bookmark'
              width={isMobile ? 24 : 34}
              height={isMobile ? 24 : 34}
              className='cursor-pointer mr-[10px]'
              onClick={showAlert}
            />

            <Image
              src={`/images/icons/${
                theme === 'baple'
                  ? 'share_select.svg'
                  : 'CBicons/CBshare_select.svg'
              }`}
              alt='kakao share'
              width={isMobile ? 24 : 34}
              height={isMobile ? 24 : 34}
              className='cursor-pointer'
              onClick={() =>
                shareKakao({
                  address: placeInfo?.address,
                  place_name: placeInfo?.place_name,
                  placeId,
                })
              }
            />
          </>
        )}
      </div>
    </>
  );
};

export default PlaceDetailHeader;
