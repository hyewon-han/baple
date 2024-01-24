import { getPost } from '@/apis/boards';
import MainWrapper from '@/components/layout/MainWrapper';
import { useBoards } from '@/hooks/useBoards';
import { toastSuccess } from '@/libs/toastifyAlert';
import { RootState } from '@/redux/config/configStore';
import { formatDate } from '@/utils/dateFormatter';
import { Avatar, Button, Spacer } from '@nextui-org/react';
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
      confirmButtonColor: '#FFD029',
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
              src={post.users?.avatar_url || undefined}
            />
            <p className='text-md'>{post.users?.user_name}</p>
          </div>
        </div>
        {userInfo.userId === post.user_id ? (
          <div className='flex gap-5'>
            <Button size='sm' color='primary' onClick={delPost}>
              삭제
            </Button>
            <Link href={`/board/write?boardId=${boardId}`}>
              <Button size='sm' color='primary'>
                수정
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
      <Spacer y={8} />

      <div className='shadow-md w-full min-h-[200px] p-4 rounded-md'>
        <p>{post.content}</p>
      </div>
    </MainWrapper>
  );
};

export default BoardPostPage;
