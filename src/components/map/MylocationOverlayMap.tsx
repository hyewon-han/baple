import { Maplocation } from '@/types/types';
import React from 'react';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';

interface Props {
  mylocation: Maplocation;
}

const MylocationOverlayMap = ({ mylocation }: Props) => {
  return (
    <CustomOverlayMap position={mylocation.center} yAnchor={1.8} zIndex={2}>
      <div className=' w-[100px] bg-white flex justify-center rounded-md shadow-md h-[50px] items-center'>
        <span className='text-lg font-bold'>현재위치!</span>
      </div>
    </CustomOverlayMap>
  );
};

export default MylocationOverlayMap;
