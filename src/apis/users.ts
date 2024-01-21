import { supabase } from '@/libs/supabase';

// queryFn
export const getUserDataById = async (userId: string | null) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) {
    throw error;
  }
  return user;
};

type Props = {
  userId: string;
  newUsername: string;
  newAvatarUrl?: string;
};

// mutateFn
export const updateUser = async ({
  userId,
  newUsername,
  newAvatarUrl,
}: Props) => {
  // 메타데이터 업데이트
  const { data, error } = await supabase.auth.updateUser({
    data: { user_name: newUsername, avatar_url: newAvatarUrl },
  });
  // users 테이블 업데이트
  const { error: usersError } = await supabase
    .from('users')
    .update({ user_name: newUsername, avatar_url: newAvatarUrl })
    .eq('id', userId);
  if (error) throw error;
  if (usersError) throw usersError;
};
