import { supabase } from '@/libs/supabase';
import { logInUser, logOutUser, updateUser } from '@/redux/modules/authSlice';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User,
  Divider,
} from '@nextui-org/react';
import { RootState } from '@/redux/config/configStore';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { getUserDataById } from '@/apis/users';
import Image from 'next/image';
import ThemeSwitcher from './ThemeSwitcher';
import { useViewport } from '@/hooks/useViewport';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import AlarmModal from '../common/AlarmModal';
import { useAlarmSubscribe } from '@/hooks/useAlarmSubscribe';

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { userId, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { isMobile } = useViewport();
  const [isLoaded, setIsLoaded] = useState(false);
  const { baple } = useCurrentTheme();
  const [alarmState, setAlarmState] = useState<boolean>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 실시간 알림
  useAlarmSubscribe(setAlarmState);

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
        <header
          className={`py-2 font-bold sticky top-0 z-20 shadow-xl bg-${
            baple ? 'white' : 'secondary'
          } bg-opacity-95 `}
        >
          <div className='m-auto flex items-center min-h-[48px] w-[90%]'>
            <nav className='flex md:flex w-full justify-between items-center'>
              {isLoggedIn ? (
                <div className='block md:hidden w-full'></div>
              ) : null}
              <div className='flex w-full justify-center '>
                <Link href='/' className='flex justify-center'>
                  <Image
                    src={`/images/icons/${
                      baple ? 'basic-logo.svg' : '/CBicons/CBbasic-logo.svg'
                    }`}
                    alt='main logo'
                    width={100}
                    height={100}
                  />
                </Link>

                <div className='hidden md:flex gap-16 items-center w-[65vw] justify-start pl-10'>
                  <Link
                    href='/about'
                    className={`hover:text-primary ${
                      router.pathname === '/about' ? 'text-primary' : ''
                    }`}
                  >
                    배플 소개
                  </Link>
                  <Link
                    href='/nearby'
                    className={`hover:text-primary w-auto ${
                      router.pathname === '/nearby' ? 'text-primary' : ''
                    }`}
                  >
                    내 주변 장소
                  </Link>
                  <Link
                    href='/places'
                    className={`hover:text-primary ${
                      router.pathname === '/places' ? 'text-primary' : ''
                    }`}
                  >
                    장소 검색
                  </Link>
                  <Link
                    href='/board'
                    className={`hover:text-primary ${
                      router.pathname === '/board' ? 'text-primary' : ''
                    }`}
                  >
                    건의 게시판
                  </Link>
                </div>
              </div>

              {currentUser ? (
                <div className='flex gap-4 items-center w-full justify-end'>
                  {/* {isTablet ? null : <ThemeSwitcher />} */}

                  {/* 실시간 알림 */}
                  <AlarmModal alarmState={alarmState} />

                  {/* 프로필 */}

                  <Popover
                    isOpen={isPopoverOpen}
                    onOpenChange={(open) => setIsPopoverOpen(open)}
                    shouldCloseOnInteractOutside={() => {
                      setIsPopoverOpen(false);
                      return true;
                    }}
                  >
                    <PopoverTrigger>
                      <Avatar
                        showFallback
                        src={user?.avatar_url}
                        className='hover:brightness-50 transition cursor-pointer'
                      />
                    </PopoverTrigger>
                    <PopoverContent className='flex gap-3'>
                      <div className='flex flex-col items-center mt-5'>
                        <User
                          name={`${user?.user_name}`}
                          description={`${user?.email}`}
                          avatarProps={{
                            src: user?.avatar_url,
                          }}
                        />
                      </div>
                      <Divider className='my-2' />
                      <Link
                        href={`/user`}
                        className='hover:bg-gray-200 brightness-30 transition-all w-full text-center rounded p-2 cursor-pointer'
                        onClick={() => setIsPopoverOpen(false)}
                      >
                        마이페이지
                      </Link>
                      <div
                        onClick={logOutHandler}
                        className='hover:bg-gray-200 brightness-30 transition-all w-full text-center rounded p-2 cursor-pointer'
                      >
                        로그아웃
                      </div>
                      <div className='w-full flex justify-center items-center gap-2 p-2'>
                        <span>색약모드</span>
                        <ThemeSwitcher />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <div className='hidden md:flex gap-4 w-full justify-end '>
                  {isMobile ? null : <ThemeSwitcher />}
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
