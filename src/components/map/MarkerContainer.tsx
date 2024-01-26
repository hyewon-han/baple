import { Tables } from '@/types/supabase';
import { useEffect, useRef, useState } from 'react';
import { CustomOverlayMap, MapMarker, useMap } from 'react-kakao-maps-sdk';
import PlaceCard2 from '../common/PlaceCard2';

const EventMarkerContainer = ({ place }: { place: Tables<'places'> }) => {
  const map = useMap();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<HTMLDivElement | null>(null);

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
      <div ref={markerRef}>
        <MapMarker
          position={{ lat: place.lat, lng: place.lng }} // 마커를 표시할 위치
          onClick={(marker) => {
            map.panTo(marker.getPosition());
            setIsVisible(true);
          }}
          image={{
            src: '/images/icons/marker.svg', // 마커이미지의 주소입니다
            size: {
              width: 44,
              height: 40,
            },
          }}
        />
      </div>
      {isVisible && (
        <div ref={overlayRef}>
          <CustomOverlayMap
            position={{ lat: place.lat, lng: place.lng }}
            key={place.id}
            yAnchor={1.15}
            zIndex={2}
          >
            <PlaceCard2 place={place} />
          </CustomOverlayMap>
        </div>
      )}
    </>
  );
};

export default EventMarkerContainer;
