import { getPosts } from '@/apis/boards';
import MainWrapper from '@/components/layout/MainWrapper';
import { toastWarn } from '@/libs/toastifyAlert';
import { RootState } from '@/redux/config/configStore';
import { formatDate } from '@/utils/dateFormatter';
import { Button, Divider, Spacer } from '@nextui-org/react';
import { Pagination } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { useViewport } from '@/hooks/useViewport';

const BoardPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const userInfo = useSelector((state: RootState) => state.auth);
  const { isMobile } = useViewport();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
    select: (posts) => {
      return posts.map((post) => ({
        ...post,
        user_name: post.users.user_name,
        created_at: formatDate(post.created_at),
      }));
    },
  });

  const recentOrder = _.orderBy(posts, 'created_at', 'desc');

  const postsPerPage = 10;
  const pages = Math.ceil((recentOrder?.length || 0) / postsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;

    return recentOrder?.slice(start, end);
  }, [page, recentOrder]);

  if (isLoading) {
    return <p>로딩중...</p>;
  }

  return (
    <MainWrapper>
      <header className='flex mt-[50px] mb-3 sm:mb-6 justify-between'>
        <h2 className='text-2xl sm:text-3xl font-bold'>게시판</h2>
      </header>

      <Divider className='bg-primary h-0.5 mb-[18px]' />
      <table className='w-[96%] m-auto h-auto'>
        <thead>
          <tr className='text-lg sm:text-xl'>
            <th>카테고리</th>
            <th>제목</th>
            <th className='hidden md:table-cell lg:table-cell'>작성자</th>
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
              <td className='text-center hidden md:table-cell lg:table-cell'>
                {item.users.user_name}
              </td>
              <td className='text-center hidden lg:table-cell whitespace-nowrap'>
                {item.place_name.length > 10
                  ? item.place_name.substr(0, 10) + '...'
                  : item.place_name}
              </td>
              <td className='text-center hidden lg:table-cell'>
                {item.created_at.slice(0, 11)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Spacer y={6} />
      <div className='flex justify-center w-full'>
        <Pagination
          isCompact
          showControls
          showShadow
          color='primary'
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
      </div>
      <Spacer y={8} />
      <Divider className='bg-primary h-0.5 mb-[18px]' />
      <div className='text-right mb-6 sm:mb-0'>
        {userInfo.userId ? (
          <Button
            className='bg-primary px-8 py-2 rounded-full text-white'
            onClick={() => router.push('/board/write')}
          >
            글쓰기
          </Button>
        ) : (
          <Button
            className='bg-primary px-8 py-2 rounded-full text-white'
            onClick={() => toastWarn('로그인 후 이용해주세요')}
          >
            글쓰기
          </Button>
        )}
      </div>
    </MainWrapper>
  );
};

export default BoardPage;
