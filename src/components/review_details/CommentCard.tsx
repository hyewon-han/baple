import React from 'react';
import { Avatar, Button, Card, CardBody } from '@nextui-org/react';
import { formatDate } from '@/utils/dateFormatter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '@/apis/comments';
import { toast } from 'react-toastify';

import type { CommentsWithUser } from '@/types/types';
import { toastSuccess } from '@/libs/toastifyAlert';

interface Props {
  comment: CommentsWithUser;
}

const CommentCard = ({ comment }: Props) => {
  const queryClient = useQueryClient();
  const deleteMutate = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      toastSuccess('삭제 완료');
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const deleteBtnHandler = (commentId: string) => {
    deleteMutate.mutate(commentId);
  };

  return (
    <div className='py-3 border-b-2 min-h-[90px] '>
      <div>
        <div className='flex gap-4 items-center'>
          <Avatar
            src={comment.users?.avatar_url}
            showFallback
            className='h-100px h-[60px] w-[60px]'
            radius='full'
            // size='lg'
          />
          <div className='w-full flex justify-between'>
            <div className='flex flex-col gap-3'>
              <div className='flex gap-x-6'>
                <strong className='text-md text-lg'>
                  {comment.users?.user_name}
                </strong>
                <span>{formatDate(comment.created_at)}</span>
              </div>

              <span>{comment.content}</span>
            </div>

            <div className='flex flex-col gap-3 items-end mr-6'>
              <button
                className='border w-7 border-primary text-primary'
                onClick={deleteBtnHandler.bind(null, comment.id)}
              >
                X
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
