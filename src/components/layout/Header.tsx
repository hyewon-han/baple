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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserDataById } from '@/apis/users';
import Image from 'next/image';
import ThemeSwitcher from './ThemeSwitcher';
import { useViewport } from '@/hooks/useViewport';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import AlarmModal from '../common/AlarmModal';
import { useAlarm } from '@/hooks/useAlarm';
import { RealtimeChannel } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  // const [userId, setUserId] = useState('');
  const { userId, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { isMobile, isTablet } = useViewport();
  const [isLoaded, setIsLoaded] = useState(false);
  const { baple } = useCurrentTheme();
  const [alarmState, setAlarmState] = useState(false);
  const { alarmData } = useAlarm();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;
    const subscription: RealtimeChannel = supabase
      .channel('custom-filter-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alarm',
          filter: `received_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({
            queryKey: ['alarm', userId],
          });
          setAlarmState(true);
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'alarm',
          filter: `received_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({
            queryKey: ['alarm', userId],
          });
        },
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  useEffect(() => {
    if (alarmData?.length === 0) {
      setAlarmState(false);
    }
  }, [alarmData]);

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
                  <div
                    className={`hover:text-primary ${
                      router.pathname === '/about' ? 'text-primary' : ''
                    }`}
                    onClick={() => Swal.fire('준비중입니다!')}
                  >
                    배플 소개
                  </div>
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
                  <span className='hidden md:block'>
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
                      <DropdownItem key='mode'>
                        색맹모드 <ThemeSwitcher />
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
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
