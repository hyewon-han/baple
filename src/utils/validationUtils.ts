import { supabase } from '@/libs/supabase';
import { toastSuccess, toastWarn } from '@/libs/toastifyAlert';

export const validateUsername = async (
  username: string,
  setIsCheckedUsername: (value: boolean) => void,
) => {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('user_name', username);

  if (error) throw error;
  if (username === undefined) {
    toastWarn('닉네임을 입력해주세요. 😅');
    setIsCheckedUsername(false);
  } else if (username.length < 2) {
    toastWarn('2글자 이상의 닉네임을 입력해주세요. 😅');
    setIsCheckedUsername(false);
  } else if (username.length > 8) {
    toastWarn('8글자 이하의 닉네임을 입력해주세요. 😅');
    setIsCheckedUsername(false);
  } else if (data?.length !== 0) {
    toastWarn('이미 사용중인 닉네임 입니다. 😅');
    setIsCheckedUsername(false);
  } else {
    toastSuccess('사용 가능한 닉네임 입니다. 😄');
    setIsCheckedUsername(true);
  }
};
