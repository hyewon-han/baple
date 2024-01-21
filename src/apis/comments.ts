import { supabase } from '@/libs/supabase';

import type newComment from '@/utils/newComment';
import type { CommentsWithUser } from '@/types/types';

export const getAllComments = async (id: string) => {
  let { data: comments, error } = await supabase
    .from('comments')
    .select(
      `
    *,
    users (
      user_name, avatar_url
    )
  `,
    )
    .eq('review_id', id);

  return comments?.reverse() as CommentsWithUser[];
};

export const insertNewComment = async (comment: newComment) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([comment])
    .select();
};

export const deleteComment = async (commentId: string) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);
};

export const getCommentsByReviewId = async (reviewId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select()
    .eq('review_id', reviewId);
  if (error) throw error;
  return data;
};
