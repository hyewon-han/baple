import { getPost } from '@/apis/boards';
import MainWrapper from '@/components/layout/MainWrapper';
import { useBoards } from '@/hooks/useBoards';
import { toastSuccess } from '@/libs/toastifyAlert';
import { RootState } from '@/redux/config/configStore';
import { formatDate } from '@/utils/dateFormatter';
import { Avatar, Button, Divider, Spacer } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const BoardPostPage = () => {
  const router = useRouter();
  const boardId: string = router.query.boardId as string;
  const userInfo = useSelector((state: RootState) => state.auth);
  const { deletePost } = useBoards();

  const { data: post, isLoading } = useQuery({
    queryKey: ['posts', boardId],
    queryFn: () => getPost(boardId),
  });

  const delPost = () => {
    Swal.fire({
      icon: 'warning',
      title: '정말 삭제하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      confirmButtonColor: '#7b4cff',
    }).then((result) => {
      if (result.isConfirmed) {
        deletePost({ userId: userInfo.userId, boardId });
        toastSuccess('삭제 되었습니다');
      }
    });
  };

  if (isLoading) {
    return <p>로딩중...</p>;
  }

  return (
    <MainWrapper>
      <header className='flex mt-[50px] items-center'>
        <h2 className='text-2xl mr-5 md:text-3xl font-bold'>{post.title}</h2>
        <span className='text-gray-600 font-bold text-md md:text-lg'>
          {post.category}
        </span>
      </header>
      <Spacer y={3} />
      <Divider className='bg-primary h-0.5' />

      <Spacer y={8} />
      <div className='flex justify-between'>
        <div className='flex justify-between w-full items-center gap-4'>
          <div className='flex items-center gap-4'>
            <Avatar
              size='sm'
              showFallback
              src={post.users?.avatar_url || undefined}
            />
            <p className='text-md'>{post.users?.user_name}</p>
          </div>
          <div className='flex items-center'>
            <span className='text-gray-400'>{formatDate(post.created_at)}</span>
          </div>
        </div>
      </div>
      <Spacer y={8} />

      <div className='w-full min-h-[200px] p-4 rounded-md'>
        <p>{post.content}</p>
      </div>
      <Spacer y={5} />
      <Divider className='bg-primary h-0.5' />
      <Spacer y={5} />
      {userInfo.userId === post.user_id ? (
        <div className='flex justify-end gap-5'>
          <Button
            className='rounded-full px-8 hover:bg-pink hover:text-white'
            onClick={delPost}
          >
            삭제
          </Button>
          <Link href={`/board/write?boardId=${boardId}`}>
            <Button className='rounded-full px-8 hover:bg-primary hover:text-white'>
              수정
            </Button>
          </Link>
        </div>
      ) : null}
    </MainWrapper>
  );
};

export default BoardPostPage;
