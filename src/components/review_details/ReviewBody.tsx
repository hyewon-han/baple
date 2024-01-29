import React, { useState } from 'react';
import { Button, Spacer } from '@nextui-org/react';

import type { Tables } from '@/types/supabase';
import { toastSuccess } from '@/libs/toastifyAlert';
import { useReviews } from '@/hooks/useReviews';

interface Props {
  review: Tables<'reviews'>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReviewBody = ({ review, isEditing, setIsEditing }: Props) => {
  const { id, created_at, content, user_id, place_id } = review;
  const [editValue, setEditValue] = useState(content);
  const { updateReview } = useReviews(setIsEditing, place_id, undefined, id);
  const editDoneButtonHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    updateReview({ id, editValue });
    toastSuccess('수정 완료되었습니다');
  };

  return (
    <>
      {!isEditing && (
        <div className='break-all whitespace-pre-wrap'>{content}</div>
      )}
      {isEditing && (
        <form onSubmit={editDoneButtonHandler}>
          <div className='flex flex-col items-center'>
            <textarea
              className='w-full h-[300px] text-black resize-none p-1'
              onChange={(e) => {
                // console.log(e.target.value);
                setEditValue(e.target.value);
              }}
              value={editValue}
              draggable={false}
            />
            <Spacer y={3} />
            <Button color='primary' type='submit'>
              수정완료
            </Button>
          </div>
        </form>
      )}

      <Spacer y={10} />
    </>
  );
};

export default ReviewBody;
