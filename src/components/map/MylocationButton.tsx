import { Maplocation } from '@/types/types';
import { Button } from '@nextui-org/react';
import React from 'react';
import { useMap } from 'react-kakao-maps-sdk';

const MylocationButton = ({
  mylocation,
  setLocation,
}: {
  mylocation: Maplocation;
  setLocation: React.Dispatch<React.SetStateAction<Maplocation>>;
}) => {
  const map = useMap();

  const location = new kakao.maps.LatLng(
    mylocation.center.lat,
    mylocation.center.lng,
  );

  return (
    <div className='absolute flex  z-10 top-[3px] left-[130px] w-[90px] h-[32px] justify-center'>
      <Button
        color='primary'
        onClick={() => {
          map.setCenter(location);
          setLocation({
            center: {
              lat: mylocation.center.lat,
              lng: mylocation.center.lng,
            },
            errMsg: null,
            isLoading: true,
          });
        }}
      >
        나의 위치
      </Button>
    </div>
  );
};

export default MylocationButton;
