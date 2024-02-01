import { Maplocation } from '@/types/types';
import React from 'react';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';

interface Props {
  mylocation: Maplocation;
}

const MylocationOverlayMap = ({ mylocation }: Props) => {
  return (
    <CustomOverlayMap position={mylocation.center} yAnchor={1.9} zIndex={2}>
      <div className=' w-[100px] bg-white flex justify-center rounded-md shadow-md h-[50px] items-center'>
        <span className='text-lg font-bold text-[#1e1e1e]'>현재위치!</span>
        <div className='w-3 h-3 bg-white absolute bottom-[-5px] rotate-45'></div>
      </div>
    </CustomOverlayMap>
  );
};

export default MylocationOverlayMap;
