import {
  getCommentAlarm,
  insertNewCommentAlarm,
  updateCommentAlarm,
  updateCommentAllAlarm,
} from '@/apis/commentAlarm';
import { RootState } from '@/redux/config/configStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

export const useAlarm = () => {
  const queryClient = useQueryClient();
  const { userId } = useSelector((state: RootState) => state.auth);

  const { data: alarmData } = useQuery({
    queryKey: ['alarm', userId],
    queryFn: () => getCommentAlarm(userId),
    enabled: !!userId,
  });

  const insertCommentAlarmMutation = useMutation({
    mutationFn: insertNewCommentAlarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarm', userId] });
    },
  });

  const updateCommentAlarmMutation = useMutation({
    mutationFn: updateCommentAlarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarm', userId] });
    },
  });

  const updateCommentAllAlarmMutation = useMutation({
    mutationFn: updateCommentAllAlarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarm', userId] });
    },
  });

  return {
    insertCommentAlarm: insertCommentAlarmMutation.mutate,
    updateCommentAlarm: updateCommentAlarmMutation.mutate,
    updateCommentAllAlarm: updateCommentAllAlarmMutation.mutate,
    alarmData,
  };
};
