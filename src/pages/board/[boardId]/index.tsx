import { getPost } from '@/apis/boards';
import MainWrapper from '@/components/layout/MainWrapper';
import { formatDate } from '@/utils/dateFormatter';
import { Avatar, Button, Spacer } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

const BoardPostPage = () => {
  const router = useRouter();
  const boardId: string = router.query.boardId as string;
  const { data: post, isLoading } = useQuery({
    queryKey: ['posts', boardId],
    queryFn: () => getPost(boardId),
  });

  if (isLoading) {
    return <p>로딩중...</p>;
  }
  console.log(post);

  return (
    <MainWrapper>
      <span>{post.category}</span>
      <Spacer y={3} />
      <div className='flex items-center'>
        <h1 className='text-2xl text-bold mr-[10px]'>{post.title}</h1>
        <span className='text-gray-600'> {formatDate(post.created_at)}</span>
      </div>
      <Spacer y={3} />
      <div className='flex justify-between'>
        <div className='flex justify-between items-center gap-4'>
          <div className='flex  items-center gap-4'>
            <Avatar
              size='sm'
              showFallback
              src={post.users.avatar_url || undefined}
            />
            <p className='text-md'>{post.users.user_name}</p>
          </div>
        </div>
        <div className='flex gap-5'>
          <Button size='sm' color='primary'>
            삭제
          </Button>
          <Button size='sm' color='primary'>
            수정
          </Button>
        </div>
      </div>
      <Spacer y={8} />

      <div className='shadow-md w-full min-h-[200px] p-4 rounded-md'>
        <p>{post.content}</p>
      </div>
    </MainWrapper>
  );
};

export default BoardPostPage;
