import React from 'react';
import { getUserDataById } from '@/apis/users';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@nextui-org/react';
import Seo from '@/components/layout/Seo';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import MyTabs from '@/components/mypage/MyTabs';
import MyProfile from '@/components/mypage/MyProfile';

const UserPage = () => {
  const { userId } = useSelector((state: RootState) => state.auth);

  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserDataById(userId),
    enabled: !!userId,
  });

  // if (isLoading) return <div>로딩중...</div>;
  // if (error) return <div>에러 발생!</div>;
  return (
    <div className='flex m-8 flex-col justify-center items-center'>
      <Seo title={`${user?.user_name}님의 페이지`} />
      <MyProfile />
      <MyTabs />
    </div>
  );
};

export default UserPage;
