import { MergeDeep } from 'type-fest';
import { Database as DatabaseGenerated } from './supabase.d.ts';

import type { Tables } from '@/types/supabase';

export { Json } from './supabase.d.ts';

// Override the type for a specific column in a view:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Views: {
        comments: {
          Row: {
            // id is a primary key in public.comments, so it must be `not null`
            id: string;
          };
        };
      };
    };
  }
>;

export interface ReviewUpdateParams {
  id: string;
  editValue: string;
}

export interface CommentsWithUser extends Tables<'comments'> {
  users: {
    avatar_url: string;
    user_name: string;
  };
  reviews: {
    place_id: string;
  };
}

export interface ReviewCard {
  id: string;
  content: string;
  created_at: Date;
  images_url: string[];
  user_id: string;
  place_id: string;
  users?: {
    avatar_url: string | undefined;
    created_at: string;
    email: string | null;
    id: string;
    user_name: string | null;
  };
}
export interface PlacesWithBookmarksReviews extends Tables<'places'> {
  bookmarks: {
    id: string;
    place_id: string;
    user_id: string;
  }[];
  reviews: {
    content: string;
    created_at: string;
    id: string;
    images_url: string[];
    place_id: string;
    user_id: string;
  }[];
}

export interface ReviewWithPlaceAndUser extends Tables<'reviews'> {
  places: {
    place_name: string;
  };
  users: {
    avatar_url: string | null;
    user_name: string;
  };
}

export interface ReviewsFromRPC extends Tables<'reviews'> {
  images_url: string[];
  unique_review_id: string;
  user_avatar_url: string;
  user_name: string;
  place_name: string;
  comments_count: number;
  likes_count: number;
}

export interface Maplocation {
  center: {
    lat: number;
    lng: number;
  };
  errMsg: string | null;
  isLoading: boolean;
}

export interface PlacesForPlaceCard {
  bookmarks_count: number;
  reviews_count: number;
  city: string;
  image_url: string;
  place_name: string;
  unique_place_id: string;
}
export interface PlacesForSearch extends PlacesForPlaceCard {
  is_paid: boolean;
  is_easy_door: boolean;
  is_wheelchair_rental: boolean;
  is_guide_dog: boolean;
  is_braille_guide: boolean;
  is_audio_guide: boolean;
  is_disabled_toilet: boolean;
  is_disabled_parking: boolean;
}
