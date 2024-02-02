import React, { useState } from 'react';
import { Avatar, Input } from '@nextui-org/react';
import { formatDate } from '@/utils/dateFormatter';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import { useComments } from '@/hooks/useComments';
import Swal from 'sweetalert2';

import type { CommentsWithUser } from '@/types/types';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';

interface Props {
  comment: CommentsWithUser;
}

const CommentCard = ({ comment }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState('');
  const { deleteComment, updateComment } = useComments();
  const { baple } = useCurrentTheme();
  const { userId: currentUserId } = useSelector(
    (state: RootState) => state.auth,
  );
  const showBtn = comment.user_id == currentUserId ? true : false;

  const deleteBtnHandler = (commentId: string) => {
    Swal.fire({
      icon: 'warning',
      title: '정말 삭제하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      confirmButtonColor: baple ? '#7b4cff' : '#66b6ff',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteComment(commentId);
      }
    });
  };

  return (
    <div className='py-3 border-b-1  border-t-1 min-h-[90px] '>
      <div>
        <div className='flex gap-4 items-center'>
          <Avatar
            src={comment.users?.avatar_url}
            showFallback
            className='h-100px h-[60px] w-[60px]'
            radius='full'
          />
          <div className='w-full flex justify-between'>
            <div className='flex flex-col gap-3'>
              <div className='flex gap-x-6 items-center'>
                <strong className='text-md text-lg'>
                  {comment.users?.user_name}
                </strong>
                <span className='text-gray-500 text-[13px]'>
                  {formatDate(comment.created_at)}
                </span>
              </div>
              {isEditing ? (
                <Input
                  defaultValue={comment?.content}
                  onChange={(e) => setNewContent(e.target.value)}
                  className='w-96'
                />
              ) : (
                <span>{comment.content}</span>
              )}
            </div>

            <div className={`flex items-center ${showBtn ? '' : 'hidden'}`}>
              {isEditing ? (
                <div className='flex gap-3 mr-6'>
                  <button
                    className='border rounded w-12 border-primary text-primary'
                    onClick={() => {
                      updateComment({ commentId: comment.id, newContent });
                      setIsEditing(false);
                    }}
                  >
                    저장
                  </button>
                  <button
                    className='border rounded w-12 border-primary text-primary'
                    onClick={() => setIsEditing(false)}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <div className='flex gap-3 mr-6'>
                  <button
                    className='border rounded w-12 border-primary text-primary'
                    onClick={() => setIsEditing(true)}
                  >
                    수정
                  </button>
                  <button
                    className={`border rounded w-12 border-primary text-primary`}
                    onClick={deleteBtnHandler.bind(null, comment.id)}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
