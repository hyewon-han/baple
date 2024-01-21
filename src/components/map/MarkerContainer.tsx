import { Tables } from '@/types/supabase';
import { useEffect, useRef, useState } from 'react';
import { CustomOverlayMap, MapMarker, useMap } from 'react-kakao-maps-sdk';
import PlaceCard2 from '../common/PlaceCard2';

const EventMarkerContainer = ({ place }: { place: Tables<'places'> }) => {
  const map = useMap();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const clickOutside = (event: MouseEvent) => {
      if (isVisible && !overlayRef.current?.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => {
      document.removeEventListener('mousedown', clickOutside);
    };
  }, [isVisible]);

  return (
    <>
      <MapMarker
        position={{ lat: place.lat, lng: place.lng }} // 마커를 표시할 위치
        onClick={(marker) => {
          map.panTo(marker.getPosition());
          setIsVisible(true);
        }}
      />
      {isVisible && (
        <CustomOverlayMap
          position={{ lat: place.lat, lng: place.lng }}
          key={place.id}
          yAnchor={1.15}
        >
          <div ref={overlayRef}>
            <div
              className='close w-[30px] h-[30px] bg-black text-white text-xs flex items-center justify-center'
              onClick={() => setIsVisible(false)}
              title='닫기'
            >
              X
            </div>

            {/* <Link href={`/place/${place.id}`}>
              <div className='info'>
                <div className='title'>{place.place_name}</div>
                <div className='body'>
                  <div className='desc'>
                    <div className='jibun ellipsis'>{place.address}</div>
                  </div>
                </div>
              </div>
            </Link>  */}
            <PlaceCard2 place={place} />
          </div>
        </CustomOverlayMap>
      )}
    </>
  );
};

export default EventMarkerContainer;
