import { supabase } from '@/libs/supabase';

interface Props {
  userId: string | null;
  placeId: string | null;
}

// 북마크 추가
export const insertBookmark = async ({ userId, placeId }: Props) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .insert({ user_id: userId, place_id: placeId })
    .select();
  if (error) {
    throw error;
  }
  // console.log('북마크 성공', data);
  return data;
};

// 북마크 가져오기
export const getBookmark = async ({ userId, placeId }: Props) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select()
    .eq('place_id', placeId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
  return data;
};

// 북마크 삭제
export const deleteBookmark = async ({ userId, placeId }: Props) => {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('place_id', placeId);

  if (error) {
    console.log(error);
  }
  // console.log('북마크 삭제');
};

// 유저가 북마크한 장소
export const getBookmarksByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select(
      ` places (
      *
    )`,
    )
    .eq('user_id', userId);

  if (error) throw error;

  return data.flatMap((item) => item.places) || [];
};
// 장소별 북마크
export const getBookmarksByPlaceId = async (placeId: string) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select()
    .eq('place_id', placeId);

  if (error) throw error;
  return data;
};

//북마크가 많은 상위 8개 장소의 place_id 조회(remote procedure call)
export const getPlacesByBookmarkCount = async () => {
  let { data, error } = await supabase.rpc('get_top_bookmarked_places');
  if (error) console.error(error);
  else {
    return data;
  }
};
