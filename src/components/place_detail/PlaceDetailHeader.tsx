import { shareKakao } from '@/utils/shareKaKao';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { PlaceInfoAllData } from './PlaceDetail';
import Image from 'next/image';
import { useViewport } from '@/hooks/useViewport';

const PlaceDetailHeader = ({
  placeId,
  placeInfo,
  isLoggedIn,
  isBookmarked,
  toggleBookmark,
  showAlert,
}: PlaceInfoAllData) => {
  const { isMobile } = useViewport();
  return (
    <>
      <h1 className='text-2xl font-bold sm:text-3xl'>{placeInfo.place_name}</h1>
      <div className='flex'>
        {isLoggedIn ? (
          isBookmarked ? (
            <>
              <Image
                src='/images/icons/bookmark_select.svg'
                alt='bookmark'
                width={isMobile ? 24 : 34}
                height={isMobile ? 24 : 34}
                className='cursor-pointer mr-[10px]'
                onClick={toggleBookmark}
              />

              <Image
                src='/images/icons/share_select.svg'
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
                src='/images/icons/bookmark.svg'
                alt='bookmark'
                width={isMobile ? 24 : 34}
                height={isMobile ? 24 : 34}
                className='cursor-pointer mr-[10px]'
                onClick={toggleBookmark}
              />

              <Image
                src='/images/icons/share_select.svg'
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
              className='cursor-pointer'
              onClick={showAlert}
            />

            <Image
              src='/images/icons/share_select.svg'
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
