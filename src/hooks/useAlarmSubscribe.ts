import { supabase } from '@/libs/supabase';
import { RootState } from '@/redux/config/configStore';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAlarm } from './useAlarm';

export const useAlarmSubscribe = (setAlarmState: (value: boolean) => void) => {
  const queryClient = useQueryClient();
  const { userId } = useSelector((state: RootState) => state.auth);
  const { alarmData } = useAlarm();

  useEffect(() => {
    if (!userId) return;
    const subscription: RealtimeChannel = supabase
      .channel('custom-filter-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alarms',
          filter: `received_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({
            queryKey: ['alarms'],
          });
          setAlarmState(true);
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'alarms',
          filter: `received_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({
            queryKey: ['alarms'],
          });
        },
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (alarmData?.length === 0) {
      setAlarmState(false);
    }
  }, [alarmData]);

  useEffect(() => {
    setAlarmState(alarmData?.length === 0 ? false : true);
  }, [alarmData?.length]);
};
