import { deleteLikes, getLike, getLikes, insertLikes } from '@/apis/likes';
import { Tables } from '@/types/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
interface Likes {
  id: string;
  user_id: string;
  review_id: string;
}

export const useLikes = (
  userId: string,
  reviewId: string,
  placeInfo: Tables<'places'>,
) => {
  const queryClient = useQueryClient();

  const { data: likeState } = useQuery({
    queryKey: ['likes', userId, reviewId],
    queryFn: () => getLike({ userId: userId, reviewId }),
    enabled: !!userId,
  });

  const { data: likeCount } = useQuery({
    queryKey: ['likes', reviewId],
    queryFn: () => getLikes(reviewId),
  });

  const insertLikesMutation = useMutation({
    mutationFn: insertLikes,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['likes', userId, reviewId],
      });
      const prev = queryClient.getQueryData(['likes', userId, reviewId]);
      const updateLikes = [{ user_id: userId, review_id: reviewId }];
      queryClient.setQueryData(['likes', userId, reviewId], updateLikes);
      return { prev };
    },
    onError: (error, updateReviewParams, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['likes', userId, reviewId], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['likes', userId, reviewId],
      });
      queryClient.invalidateQueries({
        queryKey: ['likes', userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['reviews', placeInfo.id],
      });
    },
  });

  const deleteLikesMutation = useMutation({
    mutationFn: deleteLikes,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['likes', userId, reviewId],
      });
      const prev = queryClient.getQueryData(['likes', userId, reviewId]);
      const updateLikes = undefined;
      queryClient.setQueryData(['likes', userId, reviewId], updateLikes);
      return { prev };
    },
    onError: (error, updateReviewParams, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['likes', userId, reviewId], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['likes', userId, reviewId],
      });
      queryClient.invalidateQueries({
        queryKey: ['likes', userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['reviews', placeInfo.id],
      });
    },
  });

  const plusLikesCountMutation = useMutation({
    mutationFn: getLikes,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['likes', reviewId],
      });
      const prev: Likes[] | undefined = queryClient.getQueryData([
        'likes',
        reviewId,
      ]);
      const updateLikesCount = [
        ...(prev || []),
        { user_id: userId, review_id: reviewId },
      ];
      queryClient.setQueryData(['likes', reviewId], updateLikesCount);
      return { prev };
    },
    onError: (error, updateReviewParams, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['likes', reviewId], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['likes', reviewId],
      });
    },
  });

  const minusLikesCountMutation = useMutation({
    mutationFn: getLikes,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['likes', reviewId],
      });
      const prev: Likes[] | undefined = queryClient.getQueryData([
        'likes',
        reviewId,
      ]);
      const updateLikesCount = prev?.slice(0, prev.length - 1);
      queryClient.setQueryData(['likes', reviewId], updateLikesCount);
      return { prev };
    },
    onError: (error, updateReviewParams, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['likes', reviewId], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['likes', reviewId],
      });
    },
  });

  return {
    insertLike: insertLikesMutation.mutate,
    deleteLike: deleteLikesMutation.mutate,
    plusLikeCount: plusLikesCountMutation.mutate,
    minusLikeCount: minusLikesCountMutation.mutate,
    likeState,
    likeCount,
  };
};
