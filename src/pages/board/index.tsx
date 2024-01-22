import { getPosts } from '@/apis/boards';
import MainWrapper from '@/components/layout/MainWrapper';
import { toastWarn } from '@/libs/toastifyAlert';
import { RootState } from '@/redux/config/configStore';
import { formatDate } from '@/utils/dateFormatter';
import { Button, Divider, Spacer } from '@nextui-org/react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Pagination,
} from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const rows = [
  {
    key: '1',
    category: '신규',
    title: '화장실 공사중이에요',
    content: '홍길동',
    place_name: '관악구민',
    created_at: '24-01-19',
  },
  {
    key: '2',
    category: '불편사항',
    title: '경사가 있어요',
    content: '임꺽정',
    place_name: '시청',
    created_at: '24-01-19',
  },
  {
    key: '3',
    category: '신규',
    title: '여름엔 문 닫아요',
    content: '빨강머리 앤',
    place_name: '아이스링크장',
    created_at: '24-01-19',
  },
];

const columns = [
  {
    key: 'category',
    label: '카테고리',
  },
  {
    key: 'title',
    label: '제목',
  },
  {
    key: 'content',
    label: '작성자',
  },
  {
    key: 'place_name',
    label: '장소',
  },
  {
    key: 'created_at',
    label: '작성일',
  },
];

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
        created_at: formatDate(post.created_at),
      }));
    },
  });

  const postsPerPage = 4;
  const pages = Math.ceil((posts?.length || 0) / postsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;

    return posts?.slice(start, end);
  }, [page, posts]);

  if (isLoading) {
    return <p>로딩중...</p>;
  }

  return (
    <MainWrapper>
      <header className='flex mt-[50px] mb-[30px] justify-between'>
        <h2 className='text-3xl font-bold'>게시판</h2>
      </header>

      <Table
        aria-label='Example table with dynamic content'
        bottomContent={
          <div className='flex w-full justify-center'>
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
        }
        classNames={{
          wrapper: 'min-h-[222px]',
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} className='text-center'>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow
              key={item.key}
              className='cursor-pointer hover:scale-[1.003] text-center'
              onClick={() => router.push(`board/${item.id}`)}
            >
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Spacer y={8} />
      <Divider className='bg-primary h-0.5 mb-[18px]' />
      <div className='text-right'>
        {userInfo.userId ? (
          <Button
            className='bg-primary px-8 py-2 rounded-full text-black'
            onClick={() => router.push('/board/write')}
          >
            글쓰기
          </Button>
        ) : (
          <Button
            className='bg-primary px-8 py-2 rounded-full text-black'
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
