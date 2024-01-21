import { supabase } from '@/libs/supabase';
import { Tables } from '@/types/supabase';

export interface FormValues
  extends Omit<
    Tables<'boards'>,
    'id' | 'user_id' | 'created_at' | 'place_name'
  > {
  placeName: string;
  userId: string;
}

// 게시글 쓰기
export const insertNewPost = async (formData: FormValues) => {
  const { userId, category, title, content, placeName } = formData;
  console.log(userId);
  const { data, error } = await supabase.from('boards').insert([
    {
      user_id: userId,
      category,
      title,
      content,
      place_name: placeName,
    },
  ]);
  console.log('post 추가 성공');
  if (error) throw error;
};

// 게시글 가져오기
export const getPosts = async () => {
  const { data, error } = await supabase.from('boards').select();
  if (error) {
    throw error;
  }
  return data;
};

export const getPost = async (id: string) => {
  const { data, error } = await supabase
    .from('boards')
    .select(
      `*,
       users (
      user_name,
      avatar_url
    )`,
    )
    .eq('id', id)
    .single();
  if (error) {
    throw error;
  }
  return data;
};
