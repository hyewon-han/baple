import { useEffect, useState } from 'react';

const TopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrolled = document.documentElement.scrollTop;
    const threshold = 200; // 일정 수준 이상으로 스크롤될 때 버튼을 표시

    setIsVisible(scrolled > threshold);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      onClick={scrollToTop}
      className={`z-20 fixed bottom-8 right-8 bg-blue-500 p-2 cursor-pointer transition-opacity ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <span className='bg-primary text-white font-black text-2xl p-5 rounded-full w-full h-full'>
        &uarr;
      </span>
    </div>
  );
};

export default TopButton;
