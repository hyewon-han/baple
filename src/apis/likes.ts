import { supabase } from '@/libs/supabase';
import { Tables } from '@/types/supabase';

interface Props {
  userId: string;
  reviewId: string;
}

// 좋아요 추가
export const insertLikes = async ({
  userId,
  reviewId,
}: Props): Promise<void> => {
  const { error } = await supabase
    .from('likes')
    .insert({ user_id: userId, review_id: reviewId })
    .select();
  if (error) {
    throw error;
  }
};

// 좋아요 모두 가져오기
export const getLikes = async (
  reviewId: string,
): Promise<Tables<'likes'>[]> => {
  const { data, error } = await supabase
    .from('likes')
    .select()
    .eq('review_id', reviewId);

  if (error) {
    throw error;
  }

  return data as Tables<'likes'>[];
};

// 현재 유저가 누른 좋아요 상태
export const getLike = async ({
  userId,
  reviewId,
}: Props): Promise<Tables<'likes'>[]> => {
  const { data, error } = await supabase
    .from('likes')
    .select()
    .eq('review_id', reviewId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
  return data as Tables<'likes'>[];
};

// 좋아요 삭제
export const deleteLikes = async ({
  userId,
  reviewId,
}: Props): Promise<void> => {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', userId)
    .eq('review_id', reviewId);

  if (error) {
    console.log(error);
  }
};

export const getLikesByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('likes')
    .select(
      `
    reviews (
      *
    )`,
    )
    .eq('user_id', userId);
  if (error) throw error;
  return data?.flatMap((item) => item.reviews) || [];
};
