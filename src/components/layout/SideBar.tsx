import React, { useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { MdClose } from 'react-icons/md';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';

const SideBar = () => {
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  const { userId, isLoggedIn } = useSelector((state: RootState) => state.auth);

  return (
    <div className='w-full h-full absolute md:hidden'>
      <RxHamburgerMenu
        className={`sticky cursor-pointer ${
          isSidebarOpened ? 'hidden' : 'block'
        } absolute top-4 left-4 z-40`}
        onClick={() => setIsSidebarOpened(true)}
      />
      <MdClose
        className={`sticky cursor-pointer ${
          isSidebarOpened ? 'block' : 'hidden'
        } absolute top-4 left-4 z-40`}
        onClick={() => setIsSidebarOpened(false)}
      />
      <div
        className={`bg-gray-200 bg-opacity-90 h-[100vh] absolute w-[100vw] transition-transform transform ${
          isSidebarOpened ? 'translate-x-0' : '-translate-x-full'
        } ease-in-out duration-300 z-30`}
      >
        {/* Content of the sidebar */}
        <div className='flex flex-col m-12 gap-5'>
          <Link href='/nearby'>주변 장소</Link>
          <Link href='/places'>장소 검색</Link>
          <Link href='/board'>게시판</Link>
          {isLoggedIn ? (
            <Link href={`/user/${userId}`}>마이페이지</Link>
          ) : (
            <>
              <Link href='/login'>로그인</Link>
              <Link href='/signup'>회원가입</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
