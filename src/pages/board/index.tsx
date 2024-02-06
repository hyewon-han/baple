import { getPosts } from '@/apis/boards';
import MainWrapper from '@/components/layout/MainWrapper';
import { toastWarn } from '@/libs/toastifyAlert';
import { RootState } from '@/redux/config/configStore';
import { Button, Divider, Spacer, Spinner } from '@nextui-org/react';
import { Pagination } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import Seo from '@/components/layout/Seo';
import BoardTable from '@/components/board/BoardTable';

const BoardPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const userInfo = useSelector((state: RootState) => state.auth);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
    select: (posts) => {
      return posts.map((post) => ({
        ...post,
        user_name: post.users.user_name,
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
    return (
      <div className='w-[100%] h-[90vh] flex items-center justify-center'>
        <Spinner
          label='로딩중!'
          color='primary'
          size='lg'
          labelColor='primary'
        />
      </div>
    );
  }

  return (
    <MainWrapper>
      <Seo />
      <header className='flex mt-[50px] mb-3 sm:mb-6 justify-between'>
        <h2 className='text-2xl sm:text-3xl font-bold'>게시판</h2>
      </header>
      <Divider className='h-0.5 mb-[18px]' />
      <BoardTable items={items} />
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
      <Divider className='h-0.5 mb-[18px]' />
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
