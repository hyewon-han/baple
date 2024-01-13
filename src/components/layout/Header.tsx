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
} from '@nextui-org/react';
import { RootState } from '@/redux/config/configStore';
import { useRouter } from 'next/router';

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  // const { nickname, userId, avatarUrl } = useSelector(
  //   (state: RootState) => state.auth,
  // );
  // const [nickname, setNickname] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      const userId = session?.user.id as string;
      const email = session?.user.email;
      const avatarUrl = session?.user.user_metadata.avatar_url;
      const nickname = session?.user.user_metadata.nickname;

      if (event === 'INITIAL_SESSION') {
        setCurrentUser(session?.user);
        dispatch(logInUser({ userId, email, avatarUrl, nickname }));
        // setNickname(nickname);
      } else if (event === 'SIGNED_IN') {
        // handle sign in event
        setCurrentUser(session?.user);
        dispatch(logInUser({ userId, email, avatarUrl, nickname }));
      } else if (event === 'SIGNED_OUT') {
        dispatch(logOutUser());
        setCurrentUser(null);
      } else if (event === 'PASSWORD_RECOVERY') {
        // handle password recovery event
      } else if (event === 'TOKEN_REFRESHED') {
        // handle token refreshed event
      } else if (event === 'USER_UPDATED') {
        // handle user updated event
        dispatch(updateUser({ avatarUrl, nickname }));
        setCurrentUser(session?.user);
        // setNickname(nickname);
      }
    });
  }, [dispatch]);

  const logOutHandler = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/');
  };
  console.log('currentUser', currentUser);
  return (
    <header className='bg-yellow-300 py-2 font-bold sticky top-0 z-20 shadow-md'>
      <div className='container m-auto flex items-center max-w-[1200px] min-h-[48px] w-[90%]'>
        <nav className='flex gap-6 w-full justify-between'>
          <Link href='/'>BAPLE</Link>
          <Link href='/nearby'>주변 장소</Link>
          <Link href='/places'>장소 목록</Link>
          <Link href='/place/bf2dafff-f2a1-41ff-942f-056a242e53f1'>
            장소 상세
          </Link>
          <Link href='/review/53e08a2f-6048-48cb-b369-3ebb27fa0d33'>
            리뷰 상세
          </Link>
          <Link href='/review/write'>리뷰 작성</Link>

          {currentUser ? (
            <>
              <span>반가워요 {currentUser.user_metadata.nickname}님!</span>
              <Dropdown>
                <DropdownTrigger>
                  <Avatar
                    showFallback
                    src={currentUser.user_metadata.avatar_url}
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
              <Link href='/login'>로그인</Link>
              <Link href='/signup'>회원가입</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
