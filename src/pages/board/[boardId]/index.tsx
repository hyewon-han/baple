import { getPost } from '@/apis/boards';
import MainWrapper from '@/components/layout/MainWrapper';
import { useBoards } from '@/hooks/useBoards';
import { toastSuccess } from '@/libs/toastifyAlert';
import { RootState } from '@/redux/config/configStore';
import { formatDate } from '@/utils/dateFormatter';
import { Avatar, Button, Divider, Spacer, Spinner } from '@nextui-org/react';
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
      <header className='flex flex-col sm:flex-row mt-[50px] mb-3 sm:mb-6 items-start sm:items-center'>
        <h2 className='text-2xl mr-3 sm:mr-5 sm:text-3xl font-bold order-2 sm:order-1'>
          {post.title}
        </h2>
        <span className='text-gray-600 font-bold text-sm sm:text-lg mb-1 sm:mb-0 order-1 sm:order-2'>
          {post.category}
        </span>
      </header>

      <Divider className='bg-primary h-0.5' />

      <Spacer y={8} />
      <div className='flex justify-between px-4'>
        <div className='flex flex-col sm:flex-row justify-between w-full items-start gap-2 sm:gap-4'>
          <div className='flex items-center gap-4'>
            <Avatar
              size='sm'
              showFallback
              src={post.users?.avatar_url || undefined}
            />
            <p className='text-md'>{post.users?.user_name}</p>
          </div>
          <div className='flex items-center'>
            <span className='text-sm sm:text-base text-gray-400'>
              {formatDate(post.created_at)}
            </span>
          </div>
        </div>
      </div>
      <div className='w-full min-h-[200px] p-4 rounded-md sm:mt-2'>
        <p className='break-all whitespace-pre-wrap'>{post.content}</p>
      </div>
      <Spacer y={5} />
      <Divider className='bg-primary h-0.5' />
      <Spacer y={5} />
      {userInfo.userId === post.user_id ? (
        <div className='flex justify-end gap-5 mb-6 sm:md-0'>
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
