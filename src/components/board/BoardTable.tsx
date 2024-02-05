import { useViewport } from '@/hooks/useViewport';
import { formatDateNoTime } from '@/utils/dateFormatter';
import { useRouter } from 'next/router';
import React from 'react';

import type { fetchedPosts } from '@/types/types';

interface Props {
  items: fetchedPosts[];
}

const BoardTable = ({ items }: Props) => {
  const router = useRouter();
  const { isMobile } = useViewport();
  console.log('items 가 뭐임?', items);

  return (
    <table className='w-[96%] m-auto h-auto'>
      <thead>
        <tr className='text-lg sm:text-xl'>
          <th>카테고리</th>
          <th>제목</th>
          <th className='hidden lg:table-cell'>작성자</th>
          <th className='hidden lg:table-cell'>장소</th>
          <th className='hidden lg:table-cell'>작성일</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr
            key={item.id}
            className='cursor-pointer hover:scale-[1.003] text-sm h-[40px]'
            onClick={() => router.push(`board/${item.id}`)}
          >
            <td className='text-center'>{item.category}</td>
            <td className='text-center w-[70%] lg:w-[50%] pre-line'>
              {isMobile
                ? item.title.length > 14
                  ? item.title.slice(0, 14) + '...'
                  : item.title
                : item.title}
            </td>
            <td className='text-center hidden lg:table-cell'>
              {item.users.user_name}
            </td>
            <td className='text-center hidden lg:table-cell whitespace-nowrap'>
              {item.place_name.length > 10
                ? item.place_name.substr(0, 10) + '...'
                : item.place_name}
            </td>
            <td className='text-center hidden lg:table-cell'>
              {formatDateNoTime(item.created_at)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BoardTable;
