import React from 'react';
import CommentCard from './CommentCard';
import { Spacer } from '@nextui-org/react';
import { CommentsWithUser } from '@/types/types';

interface Props {
  comments: CommentsWithUser[] | undefined;
}

const CommentList = ({ comments }: Props) => {
  if (comments?.length === 0) {
    return (
      <>
        <Spacer y={10} />
        <p>등록된 댓글이 없습니다</p>
        <Spacer y={10} />
      </>
    );
  }
  return (
    <section className='flex flex-col gap-y-2'>
      {comments?.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
      <Spacer y={10} />
    </section>
  );
};

export default CommentList;
