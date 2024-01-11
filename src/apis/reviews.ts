import { supabase } from '@/libs/supabase';

import type { Tables } from '@/types/supabase';
import { ReviewUpdateParams } from '@/types/types';
// 리뷰 아이디 가져오기
export const getReviewById = async (id: string) => {
  const { data: review, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .single();
  // console.log('reviews.ts 에서 읽은 부분>>', review, '에러>>', error);
  if (error) {
    throw error;
  }
  return review as Tables<'reviews'>;
};

// 리뷰 이미지 가져오기
export const getReviewImgList = async (id: string) => {
  const { data: reviewImgList, error } = await supabase
    .from('reviews')
    .select('images_url')
    .eq('place_id', id);

  if (error) {
    throw error;
  }
  return reviewImgList?.map((item) => item.images_url).flat() as string[];
};

export const updateReviewContent = async ({
  id,
  editValue,
}: ReviewUpdateParams) => {
  console.log('editvalue >> ', editValue);
  const { data, error } = await supabase
    .from('reviews')
    .update({ content: editValue })
    .eq('id', id)
    .select();

  console.log('수정시도됨');
  console.log('수정 data>>', data, '수정 error>>', error);
};
