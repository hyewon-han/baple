import { supabase } from '@/libs/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useAlarmSubscribeComment = (
  currentUserId: string,
  reviewId: string,
) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!currentUserId) return;
    const subscription: RealtimeChannel = supabase
      .channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        (payload) => {
          queryClient.invalidateQueries({
            queryKey: ['comments', reviewId],
          });
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'comments' },
        (payload) => {
          queryClient.invalidateQueries({
            queryKey: ['comments', reviewId],
          });
        },
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);
};
