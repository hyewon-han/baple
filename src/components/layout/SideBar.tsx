import React, { useEffect, useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { MdClose } from 'react-icons/md';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import { useRouter } from 'next/router';

const SideBar = () => {
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  const { userId, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      {isLoaded && (
        <div className='z-50 fixed top-0 left-0 right-0'>
          <div className='z-50 absolute md:hidden bg-yellow'>
            <RxHamburgerMenu
              className={`cursor-pointer ${
                isSidebarOpened ? 'hidden' : 'block'
              } absolute top-5 left-5 z-50`}
              onClick={() => setIsSidebarOpened(true)}
              size={25}
            />
            <MdClose
              className={`cursor-pointer ${
                isSidebarOpened ? 'block' : 'hidden'
              } absolute top-5 left-5 z-50`}
              onClick={() => setIsSidebarOpened(false)}
              size={25}
            />
          </div>
          {isSidebarOpened && (
            <div
              className=' h-screen w-screen fixed top-0 left-0'
              onClick={() => setIsSidebarOpened(false)}
            />
          )}
          <div
            className={`bg-gray-200 bg-opacity-90 h-screen w-[300px] md:hidden fixed top-0 left-0 transition-transform transform ${
              isSidebarOpened ? 'translate-x-0' : '-translate-x-full'
            } ease-in-out duration-300 z-40`}
          >
            {/* Content of the sidebar */}
            <div className={`flex flex-col m-16 gap-5`}>
              <Link
                href='/nearby'
                className={` ${
                  router.pathname === '/nearby' ? 'text-primary' : ''
                }`}
              >
                주변 장소
              </Link>
              <Link
                href='/places'
                className={` ${
                  router.pathname === '/places' ? 'text-primary' : ''
                }`}
              >
                장소 검색
              </Link>
              <Link
                href='/board'
                className={` ${
                  router.pathname.startsWith('/board') ? 'text-primary' : ''
                }`}
              >
                게시판
              </Link>
              {isLoggedIn ? (
                <Link
                  href={`/user/${userId}`}
                  className={` ${
                    router.pathname.startsWith('/user') ? 'text-primary' : ''
                  }`}
                >
                  마이페이지
                </Link>
              ) : (
                <>
                  <Link
                    href='/login'
                    className={` ${
                      router.pathname === '/login' ? 'text-primary' : ''
                    }`}
                  >
                    로그인
                  </Link>
                  <Link
                    href='/signup'
                    className={` ${
                      router.pathname === '/signup' ? 'text-primary' : ''
                    }`}
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
