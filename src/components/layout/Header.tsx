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
import Image from 'next/image';
import ThemeSwitcher from './ThemeSwitcher';

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  // const [userId, setUserId] = useState('');
  const { userId, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
      if (event === 'INITIAL_SESSION' && session !== null) {
        setCurrentUser(session?.user);
        dispatch(
          logInUser({
            userId,
            email,
            avatarUrl: user?.avatar_url,
            username: user?.user_name,
          }),
        );
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
        // window.history.replaceState(null, '', '/');
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
    <>
      {isLoaded ? (
        <header className='py-2 font-bold sticky top-0 z-20 shadow-xl bg-white bg-opacity-95'>
          <div className='m-auto flex items-center min-h-[48px] w-[90%]'>
            <nav className='flex sm:flex w-full justify-between items-center'>
              {isLoggedIn ? (
                <div className='block sm:hidden w-full'></div>
              ) : null}
              <div className='flex w-full justify-center '>
                <Link href='/' className='flex justify-center'>
                  <Image
                    src='/images/icons/basic-logo.svg'
                    alt='main logo'
                    width={100}
                    height={100}
                  />
                </Link>
                <div className='hidden md:flex gap-16 items-center w-full justify-center '>
                  <Link
                    href='/nearby'
                    className={`hover:text-primary ${
                      router.pathname === '/nearby'
                        ? 'text-primary'
                        : 'text-gray-500'
                    }`}
                  >
                    내 주변 장소
                  </Link>
                  <Link
                    href='/places'
                    className={`hover:text-primary ${
                      router.pathname === '/places'
                        ? 'text-primary'
                        : 'text-gray-500'
                    }`}
                  >
                    장소 검색
                  </Link>
                  <Link
                    href='/board'
                    className={`hover:text-primary ${
                      router.pathname === '/board'
                        ? 'text-primary'
                        : 'text-gray-500'
                    }`}
                  >
                    게시판
                  </Link>
                </div>
              </div>
              <ThemeSwitcher />
              {currentUser ? (
                <div className='flex gap-4 items-center w-full justify-end'>
                  <span className='hidden sm:block'>
                    반가워요 {user?.user_name}님!
                  </span>
                  <Dropdown>
                    <DropdownTrigger>
                      <Avatar
                        showFallback
                        src={user?.avatar_url}
                        className='hover:brightness-50 transition cursor-pointer'
                      />
                    </DropdownTrigger>
                    <DropdownMenu aria-label='Static Actions'>
                      <DropdownItem
                        key='mypage'
                        // href={`/user/${currentUser.id}`}
                      >
                        <Link
                          className='block'
                          href={`/user/${currentUser.id}`}
                        >
                          마이페이지
                        </Link>
                      </DropdownItem>
                      <DropdownItem key='logout' onClick={logOutHandler}>
                        로그아웃
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              ) : (
                <div className='hidden sm:flex gap-4 w-full justify-end'>
                  <Link href='/login'>
                    <Button variant='solid' color='primary'>
                      로그인
                    </Button>
                  </Link>
                  <Link href='/signup'>
                    <Button variant='bordered' color='primary'>
                      회원가입
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </header>
      ) : null}
    </>
  );
};

export default Header;
