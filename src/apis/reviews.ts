import { supabase } from '@/libs/supabase';

import type {
  Json,
  ReviewUpdateParams,
  ReviewWithPlaceAndUser,
  ReviewsFromRPC,
} from '@/types/types';

// 리뷰 가져오기 (by Id)
export const getReviewById = async (id: string) => {
  const { data: review, error } = await supabase
    .from('reviews')
    .select(
      `*,
      places(place_name,image_url),
      users(avatar_url,user_name)
      `,
    )
    .eq('id', id)
    .single();
  if (error) {
    throw error;
  }
  return review as ReviewWithPlaceAndUser;
};

// 리뷰 정보 (by placeId)
export const getReviewsByPlaceId = async (placeId: string) => {
  const { data: review, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('place_id', placeId);
  if (error) {
    throw error;
  }
  return review;
};

export const getLikesWithCommentsByPlaceId = async (placeId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(
      `
    *,
    likes(*),
    comments(*),
    users (
      user_name,avatar_url
    ),
    places(place_name)
  `,
    )
    .eq('place_id', placeId);

  if (error) {
    throw error;
  }
  return data;
};

//리뷰 수정
export const updateReviewContent = async ({
  id,
  editValue,
}: ReviewUpdateParams) => {
  const { data, error } = await supabase
    .from('reviews')
    .update({ content: editValue })
    .eq('id', id)
    .select();
};

interface InsertReviewParams {
  content: string;
  placeId: string;
  userId: string;
  publicUrlList: string[];
}

//리뷰 추가
export const insertNewReview = async ({
  content,
  placeId,
  userId,
  publicUrlList,
}: InsertReviewParams) => {
  const { data, error } = await supabase.from('reviews').insert([
    {
      content: content,
      place_id: placeId,
      user_id: userId,
      images_url: publicUrlList,
    },
  ]);
  console.log('리뷰 삽입 데이터 > ', data);
  if (error) throw error;
};

//리뷰가 많은 상위 8개 장소의 place_id 조회(remote procedure call)
export const getPlacesByReviewCount = async () => {
  let { data, error } = await supabase.rpc('get_top_place_ids');
  if (error) console.error(error);
  else {
    return data;
  }
};

//리뷰 삭제
export const deleteReview = async ({
  reviewId,
  imagesUrl,
}: {
  reviewId: string;
  imagesUrl?: string[];
}) => {
  // 테이블 삭제
  const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
  if (error) {
    throw error;
  }
  // 스토리지 (이미지) 삭제
  if (imagesUrl) {
    const fileNames = imagesUrl.map((url) =>
      url.substring(url.lastIndexOf('/') + 1),
    );
    fileNames.forEach(async (fileName) => {
      const { data, error } = await supabase.storage
        .from('review_images')
        .remove([`${fileName}`]);
      if (error) throw error;
    });
  }
};

//'좋아요' 한 장소 조회
export const getLikedReviews = async (userId: string) => {
  const { data, error } = await supabase.rpc('get_liked_reviews', {
    p_user_id: userId,
  });

  if (error) {
    throw error;
  }

  return data as ReviewsFromRPC[];
};

//placeId 기반 리뷰 조회
export const getReviewsByPlaceIdrpc = async (placeId: string) => {
  const { data, error } = await supabase.rpc('get_reviews_by_place_id', {
    p_place_id: placeId,
  });

  if (error) {
    throw error;
  }

  return data as ReviewsFromRPC[];
};

//userId 기반 리뷰 조회
export const getReviewsByUserIdrpc = async (userId: string) => {
  const { data, error } = await supabase.rpc('get_reviews_by_user_id', {
    p_user_id: userId,
  });

  if (error) {
    throw error;
  }

  return data as ReviewsFromRPC[];
};
