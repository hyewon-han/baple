import { Card, Skeleton } from '@nextui-org/react';
import React from 'react';

const SkeletonCard = () => {
  return (
    <>
      <Card className='sm:w-full sm:h-[14.5rem] space-y-5 p-4' radius='lg'>
        <Skeleton className='rounded-lg'>
          <div className='h-24 rounded-lg bg-default-300'></div>
        </Skeleton>
        <div className='space-y-3'>
          <Skeleton className='w-3/5 rounded-lg'>
            <div className='h-3 w-3/5 rounded-lg bg-default-200'></div>
          </Skeleton>
          <Skeleton className='w-4/5 rounded-lg'>
            <div className='h-3 w-4/5 rounded-lg bg-default-200'></div>
          </Skeleton>
          <Skeleton className='w-2/5 rounded-lg'>
            <div className='h-3 w-2/5 rounded-lg bg-default-300'></div>
          </Skeleton>
        </div>
      </Card>
    </>
  );
};

export default SkeletonCard;
