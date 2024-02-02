import { Tables } from '@/types/supabase';
import { useEffect, useRef, useState } from 'react';
import { CustomOverlayMap, MapMarker, useMap } from 'react-kakao-maps-sdk';
import PlaceCard2 from '../common/PlaceCard2';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';

const EventMarkerContainer = ({ place }: { place: Tables<'places'> }) => {
  const map = useMap();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const clickOutside = (event: MouseEvent | TouchEvent) => {
      if (isVisible && !overlayRef.current?.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    document.addEventListener('touchend', clickOutside);
    return () => {
      document.removeEventListener('mousedown', clickOutside);
      document.removeEventListener('touchend', clickOutside);
    };
  }, [isVisible]);

  const { baple } = useCurrentTheme();

  return (
    <>
      <MapMarker
        position={{ lat: place.lat, lng: place.lng }} // 마커를 표시할 위치
        onClick={(marker) => {
          map.panTo(marker.getPosition());
          setIsVisible(true);
        }}
        image={{
          src: `/images/icons/${baple ? 'marker.svg' : 'CBicons/CBmarker.svg'}`, // 마커이미지의 주소입니다
          size: {
            width: 44,
            height: 40,
          },
        }}
      />

      {isVisible && (
        <CustomOverlayMap
          position={{ lat: place.lat, lng: place.lng }}
          key={place.id}
          yAnchor={1.2}
          zIndex={2}
        >
          <div ref={overlayRef}>
            <PlaceCard2 place={place} />
          </div>
          {/* <PlaceCard place={place} /> */}
        </CustomOverlayMap>
      )}
    </>
  );
};

export default EventMarkerContainer;
