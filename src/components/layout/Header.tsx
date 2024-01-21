import { supabase } from '@/libs/supabase';
import { logInUser, logOutUser, updateUser } from '@/redux/modules/authSlice';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react';
import { RootState } from '@/redux/config/configStore';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { getUserDataById } from '@/apis/users';

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  // const [userId, setUserId] = useState('');
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
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      const userId = session?.user.id as string;
      const email = session?.user.email;
      const avatarUrl = session?.user.user_metadata.avatar_url;
      const username = session?.user.user_metadata.user_name;

      // setUserId(userId);
      if (event === 'INITIAL_SESSION') {
        setCurrentUser(session?.user);
        dispatch(
          logInUser({
            userId,
            email,
            avatarUrl: user?.avatar_url,
            username: user?.user_name,
          }),
        );
        // setusername(username);
      } else if (event === 'SIGNED_IN') {
        // handle sign in event
        setCurrentUser(session?.user);
        dispatch(
          logInUser({
            userId,
            email,
            avatarUrl: user?.avatar_url,
            username: user?.user_name,
          }),
        );
      } else if (event === 'SIGNED_OUT') {
        dispatch(logOutUser());
        setCurrentUser(null);
      } else if (event === 'PASSWORD_RECOVERY') {
        // handle password recovery event
      } else if (event === 'TOKEN_REFRESHED') {
        // handle token refreshed event
      } else if (event === 'USER_UPDATED') {
        // handle user updated event
        dispatch(
          updateUser({
            avatarUrl: user?.avatar_url,
            username: user?.user_name,
          }),
        );
        setCurrentUser(session?.user);
        // setusername(username);
      }
    });
  }, [dispatch, user]);

  const logOutHandler = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/');
  };
  return (
    <header className='bg-[#FFD029] py-2 font-bold sticky top-0 z-20 shadow-md'>
      <div className='container m-auto flex items-center max-w-[1200px] min-h-[48px] w-[90%]'>
        <nav className='flex gap-6 w-full justify-between items-center'>
          <Link href='/' className='text-3xl font-black'>
            BAPLE
          </Link>
          <Link href='/nearby'>주변 장소</Link>
          <Link href='/places'>장소 검색</Link>

          <Link href='/board'>게시판</Link>

          {currentUser ? (
            <>
              <span>반가워요 {user?.user_name}님!</span>
              <Dropdown>
                <DropdownTrigger>
                  <Avatar
                    showFallback
                    src={user?.avatar_url}
                    className='hover:brightness-50 transition cursor-pointer'
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label='Static Actions'>
                  <DropdownItem key='mypage' href={`/user/${currentUser.id}`}>
                    마이페이지
                  </DropdownItem>
                  <DropdownItem key='logout' onClick={logOutHandler}>
                    로그아웃
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <>
              <div className='flex gap-4'>
                <Link href='/login'>
                  <Button variant='solid' color='warning'>
                    로그인
                  </Button>
                </Link>
                <Link href='/signup'>
                  <Button variant='bordered' color='warning'>
                    회원가입
                  </Button>
                </Link>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
