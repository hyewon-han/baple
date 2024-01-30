import { Spacer, Spinner } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import React from 'react';

const ReviewSubmitSpinner = () => {
  const { theme } = useTheme();
  return (
    <div
      className={`w-[100%] h-[100%] fixed  z-10 flex justify-center items-center`}
    >
      <div
        className={`z-20 bg-${
          theme === 'baple' ? 'white' : 'secondary'
        } rounded-md w-[300px] h-[200px] flex flex-col justify-center items-center opacity-100 absolute bg-opacity-100`}
      >
        <Spinner size='lg' />
        <Spacer y={10} />
        <p>업로드중.. 잠시만 기다려주세요 😜</p>
      </div>
      <div className='absolute w-[100%] h-[100%] bg-gray-900 opacity-50'></div>
    </div>
  );
};

export default ReviewSubmitSpinner;
