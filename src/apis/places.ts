import { supabase } from '@/libs/supabase';
import { PlacesForSearch } from '@/types/types';

export const getPlaceInfo = async (id: string) => {
  const { data: placeInfo, error } = await supabase
    .from('places')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return placeInfo;
};

export const getPlaceInfoList = async (ids: string[]) => {
  const { data: placeInfoList, error } = await supabase
    .from('places')
    .select(
      `
    *,
    bookmarks(*),
    reviews(*)

  `,
    )
    .in('id', ids);

  if (error) {
    throw error;
  }

  return placeInfoList;
};

type Params = {
  id: string;
  imageUrl: string;
};

export const updatePlaceImage = async ({ id, imageUrl }: Params) => {
  const { error } = await supabase
    .from('places')
    .update({ image_url: imageUrl })
    .eq('id', id);

  if (error) throw error;
};

// 무한스크롤을 위한 queryFn
export const fetchPlacesData = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: (string | string[])[];
}) => {
  const [_, searchValue, selectedBtn, selecetedCity] = queryKey;
  const PAGESIZE = 21;
  let result;
  const { data: explainData, error } = await supabase
    .rpc('search_places', {
      p_search_value: searchValue,
    })
    .explain({ format: 'json', analyze: true });

  console.log('explainData', explainData);

  if (Array.isArray(explainData)) {
    result = explainData
      .map((item) => item.Plan)
      .map((item: any) => item.Plans)
      .map((item) => item[0])
      .map((item) => item)[0];
  }
  let query = supabase.rpc('search_places', {
    p_search_value: searchValue,
  });

  if (selecetedCity) {
    if (!Array.isArray(selecetedCity)) {
      // selectedBtn가 배열이 아니면 단일 값으로 처리
      query = query.in('city', [selecetedCity]);
    }
  }

  if (selectedBtn) {
    // selectedBtn가 배열이면 forEach 실행
    if (Array.isArray(selectedBtn)) {
      selectedBtn.forEach((select) => {
        query = query.in(select, [true]);
      });
    } else {
      // selectedBtn가 배열이 아니면 단일 값으로 처리
      query = query.in(selectedBtn, [true]);
    }
  }
  console.log('query', query);

  const { data } = await query.range(
    (pageParam - 1) * PAGESIZE,
    pageParam * PAGESIZE - 1,
  );

  console.log('data!!', data);

  const resultPlaces = {
    total_length: result['Actual Rows'] as number,
    data: data,
    page: pageParam,
    total_pages: Math.ceil(result['Actual Rows'] / PAGESIZE),
  };

  if (resultPlaces) return resultPlaces;
};

export const getMyBookmarkedPlaces = async (userId: string) => {
  const { data, error } = await supabase.rpc('get_bookmarked_places', {
    p_user_id: userId,
  });

  if (error) {
    throw error;
  }
  return data as PlacesForSearch[];
};

export const getTopReviewedPlaces = async () => {
  const { data, error } = await supabase.rpc('get_top_reviewed_places');

  if (error) {
    throw error;
  }
  return data as PlacesForSearch[];
};
export const getTopBookmarkedPlaces = async () => {
  const { data, error } = await supabase.rpc('get_top_bookmarked_places');

  if (error) {
    throw error;
  }
  return data as PlacesForSearch[];
};
