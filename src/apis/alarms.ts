import { supabase } from '@/libs/supabase';

interface AlarmInfoType {
  type: string;
  review_id: string;
  sender_id: string;
  received_id: string;
  read: boolean;
}

// 알림 추가
export const insertNewAlarm = async (alarmInfo: AlarmInfoType) => {
  await supabase.from('alarms').insert([alarmInfo]);
};

// 알림 가져오기
export const getAlarm = async (userId: string) => {
  const { data, error } = await supabase
    .from('alarms')
    .select('*')
    .eq('received_id', userId)
    .eq('read', false);
  // .eq('type', 'comment');
  // .single();
  if (error) {
    throw error;
  }
  // console.log(data);
  return data;
};

// 읽음 처리
export const updateAlarm = async (alarmId: string) => {
  await supabase
    .from('alarms')
    .update({
      read: true,
    })
    .eq('id', alarmId)
    .select();
};

// 모두 읽음 처리
export const updateAllAlarm = async (receivedId: string) => {
  console.log(receivedId);
  await supabase
    .from('alarms')
    .update({
      read: true,
    })
    .eq('received_id', receivedId)
    .select();
};
