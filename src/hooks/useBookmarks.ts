import { deleteBookmark, insertBookmark } from '@/apis/bookmarks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useBookmarks = (userId: string, placeId: string) => {
  const queryClient = useQueryClient();

  const insertBookmarkMutation = useMutation({
    mutationFn: insertBookmark,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['bookmark', userId, placeId],
      });
      const prev = queryClient.getQueryData(['bookmark', userId, placeId]);
      const updateBookmark = [{ userId, place_id: placeId }];
      queryClient.setQueryData(['bookmark', userId, placeId], updateBookmark);
      return { prev };
    },
    onError: (error, updateReviewParams, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['bookmark', userId, placeId], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['bookmark', userId, placeId],
      });
      queryClient.invalidateQueries({
        queryKey: ['topBookmarkedPlacesList'],
      });
      queryClient.invalidateQueries({
        queryKey: ['topReviewedPlacesList'],
      });
    },
  });

  const deleteBookmarkMutation = useMutation({
    mutationFn: deleteBookmark,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['bookmark', userId, placeId],
      });
      const prev = queryClient.getQueryData(['bookmark', userId, placeId]);
      const updateBookmark = undefined;
      queryClient.setQueryData(['bookmark', userId, placeId], updateBookmark);
      return { prev };
    },
    onError: (error, updateReviewParams, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['bookmark', userId, placeId], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['bookmark', userId, placeId],
      });
      queryClient.invalidateQueries({
        queryKey: ['topBookmarkedPlacesList'],
      });
      queryClient.invalidateQueries({
        queryKey: ['topReviewedPlacesList'],
      });
    },
  });

  return {
    insertBookmark: insertBookmarkMutation.mutate,
    deleteBookmark: deleteBookmarkMutation.mutate,
  };
};
