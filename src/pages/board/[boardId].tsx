import { getPost, getPosts } from '@/apis/boards';
import QuillNoSSRWrapper from '@/components/common/QuillEditor';
import MainWrapper from '@/components/layout/MainWrapper';
import Seo from '@/components/layout/Seo';
import { useBoards } from '@/hooks/useBoards';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { toastSuccess } from '@/libs/toastifyAlert';
import { RootState } from '@/redux/config/configStore';
import { formatDate } from '@/utils/dateFormatter';
import { Avatar, Button, Divider, Spacer, Spinner } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

interface Props {
  initialPostData: any;
}

const BoardPostPage = ({ initialPostData }: Props) => {
  const router = useRouter();
  const boardId: string = router.query.boardId as string;
  const userInfo = useSelector((state: RootState) => state.auth);
  const { baple } = useCurrentTheme();
  const { deletePost } = useBoards();

  const { data: post, isLoading } = useQuery({
    queryKey: ['posts', boardId],
    queryFn: () => getPost(boardId),
    initialData: initialPostData,
  });

  //QUILL 관련 코드
  const quillInstance = useRef<ReactQuill>(null);
  const viewModeModules = {
    toolbar: false,
  };

  const delPost = () => {
    Swal.fire({
      icon: 'warning',
      title: '정말 삭제하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      confirmButtonColor: baple ? '#7b4cff' : '#66b6ff',
    }).then((result) => {
      if (result.isConfirmed) {
        deletePost({
          userId: userInfo.userId,
          boardId,
          images: post.attached_images,
        });
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
      <Seo />
      <header className='flex flex-col sm:flex-row mt-[50px] mb-3 sm:mb-6 items-start sm:items-center'>
        <h2 className='text-2xl mr-3 sm:mr-5 sm:text-3xl font-bold order-2 sm:order-1'>
          {post.title}
        </h2>
        <span className='text-gray-600 font-bold text-sm sm:text-lg mb-1 sm:mb-0 order-1 sm:order-2'>
          {post.category}
        </span>
      </header>

      <Divider className='h-0.5 mb-5' />
      <div className='px-4 text-gray-500 order-3'>{post.place_name}</div>
      <Spacer y={4} />

      <div className='flex justify-between px-4 mb-4'>
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
        <QuillNoSSRWrapper
          forwardedRef={quillInstance}
          modules={viewModeModules}
          readOnly
          value={post.content}
        />
      </div>
      <Spacer y={5} />
      <Divider className='h-0.5' />
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

export async function getStaticPaths() {
  const data = await getPosts();
  const ids = data.map((post) => post.id);
  const params = ids.map((id) => ({ params: { boardId: id } }));
  return {
    paths: params,
    fallback: 'blocking',
  };
}
export async function getStaticProps(context: any) {
  const { params } = context;
  const { boardId } = params;
  const initialPostData = await getPost(boardId);

  return {
    props: { initialPostData },
    revalidate: 60 * 60, // 60분마다 갱신
  };
}
