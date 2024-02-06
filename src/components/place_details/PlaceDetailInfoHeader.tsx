import { shareKakao } from '@/utils/shareKaKao';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { PlaceInfoAllData } from './PlaceDetailInfo';
import Image from 'next/image';
import { useViewport } from '@/hooks/useViewport';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';

const PlaceDetailInfoHeader = ({
  placeId,
  placeInfo,
  isLoggedIn,
  isBookmarked,
  toggleBookmark,
  showAlert,
}: PlaceInfoAllData) => {
  const { isMobile } = useViewport();
  const { baple } = useCurrentTheme();

  return (
    <>
      <h1 className='text-2xl font-bold md:text-3xl'>
        {placeInfo?.place_name}
      </h1>
      <div className='flex'>
        {isLoggedIn ? (
          isBookmarked ? (
            <>
              <Image
                src={`/images/icons/${
                  baple
                    ? 'bookmark_select.svg'
                    : 'CBicons/CBbookmark_select.svg'
                }`}
                alt='bookmark'
                width={isMobile ? 24 : 34}
                height={isMobile ? 24 : 34}
                className='cursor-pointer mr-[10px]'
                onClick={toggleBookmark}
              />

              <RiKakaoTalkFill
                size={isMobile ? 34 : 40}
                className='cursor-pointer text-primary'
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
                  baple ? 'bookmark.svg' : 'CBicons/CBbookmark.svg'
                }`}
                alt='bookmark'
                width={isMobile ? 24 : 34}
                height={isMobile ? 24 : 34}
                className='cursor-pointer mr-[10px]'
                onClick={toggleBookmark}
              />

              <RiKakaoTalkFill
                size={isMobile ? 34 : 40}
                className='cursor-pointer text-primary'
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
              src={`/images/icons/${
                baple ? 'bookmark.svg' : 'CBicons/CBbookmark.svg'
              }`}
              alt='bookmark'
              width={isMobile ? 24 : 34}
              height={isMobile ? 24 : 34}
              className='cursor-pointer mr-[10px]'
              onClick={showAlert}
            />

            <RiKakaoTalkFill
              size={isMobile ? 34 : 40}
              className='cursor-pointer text-primary'
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

export default PlaceDetailInfoHeader;
