import {
  deleteReview,
  insertNewReview,
  updateReviewContent,
} from '@/apis/reviews';
import { toastError } from '@/libs/toastifyAlert';
import {
  useMutation,
  useQueryClient,
  InvalidateQueryFilters,
} from '@tanstack/react-query';

export const useReviews = (
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>,
  placeId?: string,
  currentUserId?: string,
  reviewId?: string,
) => {
  const queryClient = useQueryClient();

  const reviewDelteMutate = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', placeId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', currentUserId] });
    },
    onError: () => {
      toastError('문제가 발생하여 삭제하지 못했습니다');
      return;
    },
  });

  const updateReviewMutate = useMutation({
    mutationFn: updateReviewContent,
    onMutate: async (updateReviewParams) => {
      await queryClient.cancelQueries({ queryKey: ['review', reviewId] });
      const prevReview: object | undefined = queryClient.getQueryData([
        'review',
        reviewId,
      ]);
      const updatedReview = {
        ...prevReview,
        content: updateReviewParams.editValue,
      };
      queryClient.setQueryData(['review', reviewId], updatedReview);

      return { prevReview };
    },
    onError: (error, updateReviewParams, context) => {
      // Rollback to the previous review data in case of an error
      if (context?.prevReview) {
        queryClient.setQueryData(['review', reviewId], context.prevReview);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['review', reviewId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', placeId] });
      if (setIsEditing) {
        setIsEditing(false);
      }
    },
  });

  const insertReviewMutate = useMutation({
    mutationFn: insertNewReview,
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        'reviews',
        placeId,
      ] as InvalidateQueryFilters);
    },
  });

  return {
    deleteReview: reviewDelteMutate.mutate,
    updateReview: updateReviewMutate.mutate,
    insertReview: insertReviewMutate.mutate,
  };
};
