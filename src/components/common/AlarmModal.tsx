import { useAlarm } from '@/hooks/useAlarm';
import { RootState } from '@/redux/config/configStore';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import { useRouter } from 'next/router';
import { VscBell, VscBellDot } from 'react-icons/vsc';
import { useSelector } from 'react-redux';

interface Props {
  alarmState: boolean;
}

const AlarmModal = ({ alarmState }: Props) => {
  const { alarmData, updateCommentAlarm, updateCommentAllAlarm } = useAlarm();
  const router = useRouter();
  const { userId } = useSelector((state: RootState) => state.auth);

  const readAlarm = (AlarmId: string, reviewId: string) => {
    updateCommentAlarm(AlarmId);
    router.push(`/review/${reviewId}`);
  };

  const readAllAlarm = (userId: string) => {
    updateCommentAllAlarm(userId);
  };

  return (
    <>
      <Popover showArrow placement='bottom'>
        <PopoverTrigger>
          <Button variant='light'>
            {alarmState ? (
              <VscBellDot size={25} className='cursor-pointer' />
            ) : (
              <VscBell size={25} className='cursor-pointer' />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-4 flex gap-2'>
          <Button
            size='sm'
            isDisabled={alarmData?.length === 0 ? true : false}
            onClick={() => readAllAlarm(userId)}
          >
            모두 읽음
          </Button>
          {alarmData?.map((item) => (
            <div
              key={item.id}
              className='w-[200px] h-auto bg-white p-2 rounded-lg cursor-pointer hover:bg-slate-200 transition-background'
              onClick={() => readAlarm(item.id, item.review_id)}
            >
              💬 새로운 댓글이 있습니다.
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AlarmModal;
