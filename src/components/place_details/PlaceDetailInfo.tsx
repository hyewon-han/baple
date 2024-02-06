import { ShowAlertType, ToggleBookmarkType } from '@/pages/place/[placeId]';
import PlaceDetailInfoHeader from './PlaceDetailInfoHeader';
import PlaceDetailInfoBody from './PlaceDetailInfoBody';
import PlaceDetailInfoFooter from './PlaceDetailInfoFooter';

import type { Tables } from '@/types/supabase';

export interface PlaceInfoAllData {
  placeId: string;
  placeInfo: Tables<'places'>;
  isBookmarked: boolean;
  isLoggedIn: boolean;
  toggleBookmark: ToggleBookmarkType;
  showAlert: ShowAlertType;
}

const PlaceDetail = ({
  placeInfo,
  placeId,
  isBookmarked,
  isLoggedIn,
  toggleBookmark,
  showAlert,
}: PlaceInfoAllData) => {
  return (
    <section className='flex flex-col justify-between w-full h-auto md:h-[500px] md:w-[60%] '>
      <div>
        <div className='justify-between w-full hidden md:inline-flex md:mb-[20px]'>
          <PlaceDetailInfoHeader
            placeId={placeId}
            placeInfo={placeInfo}
            isLoggedIn={isLoggedIn}
            isBookmarked={isBookmarked}
            toggleBookmark={toggleBookmark}
            showAlert={showAlert}
          />
        </div>
        <PlaceDetailInfoBody placeInfo={placeInfo} />
      </div>
      <PlaceDetailInfoFooter placeInfo={placeInfo} />
    </section>
  );
};

export default PlaceDetail;
