import { supabase } from '@/libs/supabase';

interface AlarmInfoType {
  type: string;
  review_id: string;
  sender_id: string;
  received_id: string;
  message: string;
}

// 알림 추가
export const insertNewCommentAlarm = async (alarmInfo: AlarmInfoType) => {
  await supabase.from('alarm').insert([alarmInfo]);
};

// 알림 가져오기
export const getCommentAlarm = async (userId: string) => {
  const { data, error } = await supabase
    .from('alarm')
    .select('*')
    .eq('received_id', userId)
    .eq('read', false);
  // .single();
  if (error) {
    throw error;
  }
  // console.log(data);
  return data;
};

// 읽음 처리
export const updateCommentAlarm = async (alarmId: string) => {
  await supabase
    .from('alarm')
    .update({
      read: true,
    })
    .eq('id', alarmId)
    .select();
};

// 모두 읽음 처리
export const updateCommentAllAlarm = async (receivedId: string) => {
  console.log(receivedId);
  await supabase
    .from('alarm')
    .update({
      read: true,
    })
    .eq('received_id', receivedId)
    .select();
};
