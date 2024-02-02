import {
  getAlarm,
  insertNewAlarm,
  updateAlarm,
  updateAllAlarm,
} from '@/apis/alarms';
import { RootState } from '@/redux/config/configStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

export const useAlarm = () => {
  const queryClient = useQueryClient();
  const { userId } = useSelector((state: RootState) => state.auth);

  // 알림
  const { data: alarmData } = useQuery({
    queryKey: ['alarms'],
    queryFn: () => getAlarm(userId),
    enabled: !!userId,
  });

  const insertCommentAlarmMutation = useMutation({
    mutationFn: insertNewAlarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarms'] });
    },
  });

  const updateCommentAlarmMutation = useMutation({
    mutationFn: updateAlarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarms'] });
    },
  });

  const updateCommentAllAlarmMutation = useMutation({
    mutationFn: updateAllAlarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarms'] });
    },
  });

  return {
    insertAlarm: insertCommentAlarmMutation.mutate,
    updateAlarm: updateCommentAlarmMutation.mutate,
    updateAllAlarm: updateCommentAllAlarmMutation.mutate,
    alarmData,
  };
};
