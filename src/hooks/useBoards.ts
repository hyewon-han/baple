import { deletePost, insertNewPost, updatePost } from '@/apis/boards';

import { toastSuccess } from '@/libs/toastifyAlert';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useBoards = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const insertPostMutation = useMutation({
    mutationFn: insertNewPost,
    onSuccess: () => {
      router.push('/board');
      toastSuccess('등록되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      router.push('/board');
      toastSuccess('수정되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      router.push('/board');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return {
    insertPost: insertPostMutation.mutate,
    updatePost: updatePostMutation.mutate,
    deletePost: deletePostMutation.mutate,
  };
};
