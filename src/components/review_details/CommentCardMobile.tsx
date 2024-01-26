import React, { useState } from 'react';
import type { CommentsWithUser } from '@/types/types';
import Swal from 'sweetalert2';
import { useComments } from '@/hooks/useComments';
import { RootState } from '@/redux/config/configStore';
import { useSelector } from 'react-redux';
import { Avatar, Input } from '@nextui-org/react';
import { formatDate } from '@/utils/dateFormatter';

interface Props {
  comment: CommentsWithUser;
}

const CommentCardMobile = ({ comment }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState('');
  const { deleteComment, updateComment } = useComments();

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
      confirmButtonColor: '#7b4cff',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteComment(commentId);
      }
    });
  };

  return (
    <div className='flex flex-col gap-y-2 border-b-1 py-2 border-t-1'>
      <section className='flex gap-x-2 justify-between items-center'>
        <div className='flex gap-x-2 items-center'>
          <Avatar
            src={comment.users?.avatar_url}
            showFallback
            className='h-100px h-[30px] w-[30px]'
            radius='full'
            // size='lg'
          />
          <strong>{comment.users?.user_name}</strong>
        </div>

        <span className='text-[12px] text-gray-500'>
          {formatDate(comment.created_at)}
        </span>
      </section>
      <section>
        {isEditing ? (
          <Input
            defaultValue={comment?.content}
            onChange={(e) => setNewContent(e.target.value)}
            className='w-96'
          />
        ) : (
          <span>{comment.content}</span>
        )}
      </section>
      <section>
        <div className={`flex items-center ${showBtn ? '' : 'hidden'}`}>
          {isEditing ? (
            <div className='flex gap-3 mr-6'>
              <button
                className='border rounded w-10 h-6 border-primary text-[12px] text-primary'
                onClick={() => {
                  updateComment({ commentId: comment.id, newContent });
                  setIsEditing(false);
                }}
              >
                저장
              </button>
              <button
                className='border rounded w-10 h-6 border-primary text-[12px] text-primary'
                onClick={() => setIsEditing(false)}
              >
                취소
              </button>
            </div>
          ) : (
            <div className='flex gap-3 mr-6'>
              <button
                className='border rounded w-10 h-6 border-primary text-[12px] text-primary'
                onClick={() => setIsEditing(true)}
              >
                수정
              </button>
              <button
                className='border rounded w-10 h-6 border-primary text-[12px] text-primary'
                onClick={deleteBtnHandler.bind(null, comment.id)}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CommentCardMobile;
