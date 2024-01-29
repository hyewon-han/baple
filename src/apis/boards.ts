import { supabase } from '@/libs/supabase';

// 게시글 쓰기
export const insertNewPost = async (formData: EditValueProps) => {
  const { userId, category, title, content, placeName } = formData;
  const { data, error } = await supabase.from('boards').insert([
    {
      user_id: userId,
      category,
      title,
      content,
      place_name: placeName,
    },
  ]);
  // console.log('post 추가 성공', data);
  if (error) throw error;
};

// 게시글 전부 가져오기
export const getPosts = async () => {
  const { data, error } = await supabase.from('boards').select(`
  *,
  users(
    user_name
  )
  `);
  if (error) {
    throw error;
  }
  return data;
};

// 게시글 가져오기
export const getPost = async (boardId: string) => {
  const { data, error } = await supabase
    .from('boards')
    .select(
      `*,
      users (
      user_name,
      avatar_url
    )`,
    )
    .eq('id', boardId)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

// 게시글 삭제
export const deletePost = async ({
  userId,
  boardId,
}: {
  userId: string;
  boardId: string;
}) => {
  const { error } = await supabase
    .from('boards')
    .delete()
    .eq('user_id', userId)
    .eq('id', boardId);

  if (error) {
    console.log(error);
  }
  // console.log('게시글 삭제');
};

interface EditValueProps {
  title: string;
  category: string;
  content: string;
  placeName: string;
  userId: string;
}

// 게시글 수정
export const updatePost = async ({
  boardId,
  editValue,
}: {
  boardId: string;
  editValue: EditValueProps;
}) => {
  const { title, category, content, placeName, userId } = editValue;
  const { data, error } = await supabase
    .from('boards')
    .update({
      title,
      category,
      content,
      place_name: placeName,
      user_id: userId,
    })
    .eq('id', boardId)
    .select();
};
