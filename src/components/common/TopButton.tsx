import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

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
      className={`z-20 fixed bottom-8 right-8 p-2 bg-primary rounded-full w-12 h-12 cursor-pointer transition-opacity flex justify-center items-center shadow-lg ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <FaArrowUp className='text-white w-6 h-6' />
    </div>
  );
};

export default TopButton;
