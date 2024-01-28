import Editor from '@/components/board/Editor';
import MainWrapper from '@/components/layout/MainWrapper';
import { Divider, Spacer } from '@nextui-org/react';
import { useRouter } from 'next/router';
import React from 'react';

const BoardWritePage = () => {
  const router = useRouter();
  const isEdit = !!router.query.boardId;

  return (
    <MainWrapper>
      <header className='flex mt-[50px] mb-3 sm:mb-6 justify-between'>
        <h2 className='text-2xl md:text-3xl font-bold'>
          {isEdit ? '게시글 수정' : '게시글 작성'}
        </h2>
      </header>
      <Divider className='h-0.5' />
      <Spacer y={6} />
      <Editor isEdit={isEdit} />
    </MainWrapper>
  );
};

export default BoardWritePage;
