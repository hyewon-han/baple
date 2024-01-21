import React, { useState } from 'react';
import { Button, Spacer } from '@nextui-org/react';
import { updateReviewContent } from '@/apis/reviews';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Tables } from '@/types/supabase';
import { toastSuccess } from '@/libs/toastifyAlert';

interface Props {
  review: Tables<'reviews'>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReviewBody = ({ review, isEditing, setIsEditing }: Props) => {
  const { id, created_at, content, user_id, place_id } = review;
  const [editValue, setEditValue] = useState(content);

  console.log('content', content);

  const queryClient = useQueryClient();

  const updateReviewMutate = useMutation({
    mutationFn: updateReviewContent,
    onMutate: async (updateReviewParams) => {
      await queryClient.cancelQueries({ queryKey: ['review', id] });
      const prevReview: object | undefined = queryClient.getQueryData([
        'review',
        id,
      ]);
      const updatedReview = {
        ...prevReview,
        content: updateReviewParams.editValue,
      };
      queryClient.setQueryData(['review', id], updatedReview);

      return { prevReview };
    },
    onError: (error, updateReviewParams, context) => {
      // Rollback to the previous review data in case of an error
      if (context?.prevReview) {
        queryClient.setQueryData(['review', id], context.prevReview);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['review', id] });
      setIsEditing(false);
    },
  });

  const editDoneButtonHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    updateReviewMutate.mutate({ id, editValue });

    toastSuccess('수정 완료되었습니다');
  };

  return (
    <>
      {!isEditing && (
        <textarea
          className='w-full min-h-[200px] text-black bg-white resize-none'
          value={content}
          disabled
          draggable={false}
        />
      )}
      {isEditing && (
        <form onSubmit={editDoneButtonHandler}>
          <div className='flex flex-col items-center'>
            <textarea
              className='w-full h-[300px] text-black resize-none'
              onChange={(e) => {
                console.log(e.target.value);
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
