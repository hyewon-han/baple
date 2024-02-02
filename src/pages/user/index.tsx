import React, { useEffect, useState } from 'react';
import { getUserDataById } from '@/apis/users';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@nextui-org/react';
import Seo from '@/components/layout/Seo';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import MyTabs from '@/components/mypage/MyTabs';
import MyProfile from '@/components/mypage/MyProfile';
import MainWrapper from '@/components/layout/MainWrapper';
import { useRouter } from 'next/router';

const UserPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { userId, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserDataById(userId),
    enabled: !!userId,
  });

  if (isLoading)
    return (
      <div className='w-[100%] h-[90vh] flex items-center justify-center'>
        <Spinner
          label='로딩중!'
          color='primary'
          size='lg'
          labelColor='primary'
        />
      </div>
    );
  return (
    <MainWrapper>
      {isLoaded ? (
        <div className='flex m-8 flex-col justify-center items-center'>
          <Seo title={`${user?.user_name}님의 페이지 | `} />
          <MyProfile />
          <MyTabs />
        </div>
      ) : null}
    </MainWrapper>
  );
};

export default UserPage;
