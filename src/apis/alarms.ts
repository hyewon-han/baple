import { supabase } from '@/libs/supabase';
import { Tables } from '@/types/supabase';

interface AlarmInfoType {
  type: string;
  review_id: string;
  sender_id: string;
  received_id: string;
  read: boolean;
}

interface Props extends Tables<'alarms'> {
  review_id: string;
}

// 알림 추가
export const insertNewAlarm = async (
  alarmInfo: AlarmInfoType,
): Promise<void> => {
  await supabase.from('alarms').insert([alarmInfo]);
};

// 알림 가져오기
export const getAlarm = async (userId: string): Promise<Props[]> => {
  const { data, error } = await supabase
    .from('alarms')
    .select('*')
    .eq('received_id', userId)
    .eq('read', false);
  if (error) {
    throw error;
  }
  return data as Props[];
};

// 읽음 처리
export const updateAlarm = async (alarmId: string): Promise<void> => {
  await supabase
    .from('alarms')
    .update({
      read: true,
    })
    .eq('id', alarmId)
    .select();
};

// 모두 읽음 처리
export const updateAllAlarm = async (receivedId: string): Promise<void> => {
  await supabase
    .from('alarms')
    .update({
      read: true,
    })
    .eq('received_id', receivedId)
    .select();
};
