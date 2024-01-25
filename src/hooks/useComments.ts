import {
  deleteComment,
  insertNewComment,
  updateComment,
} from '@/apis/comments';
import { toastSuccess } from '@/libs/toastifyAlert';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useComments = (userId?: string, placeId?: string) => {
  const queryClient = useQueryClient();

  const insertCommentMutation = useMutation({
    mutationFn: insertNewComment,
    onSuccess: () => {
      toastSuccess('댓글이 성공적으로 등록되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['likes', userId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', userId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', placeId] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      toastSuccess('댓글이 수정되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      toastSuccess('댓글이 성공적으로 삭제되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['likes', userId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', userId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', placeId] });
    },
  });

  return {
    insertComment: insertCommentMutation.mutate,
    updateComment: updateCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
  };
};
