import { useAlarm } from '@/hooks/useAlarm';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { RootState } from '@/redux/config/configStore';
import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { VscBell } from 'react-icons/vsc';
import { useSelector } from 'react-redux';

interface Props {
  alarmState: boolean | undefined;
}

const AlarmModal = ({ alarmState }: Props) => {
  const { alarmData, updateAlarm, updateAllAlarm } = useAlarm();
  const router = useRouter();
  const { userId } = useSelector((state: RootState) => state.auth);
  const { baple } = useCurrentTheme();

  // 읽음 처리
  const readAlarm = (AlarmId: string, reviewId: string) => {
    updateAlarm(AlarmId);
    router.push(`/review/${reviewId}`);
  };

  // 모두 읽음 처리
  const readAllAlarm = (userId: string) => {
    updateAllAlarm(userId);
  };

  return (
    <>
      <Popover placement='bottom'>
        <PopoverTrigger>
          <div className='sm:mr-4 flex'>
            {alarmState ? (
              <Badge content={alarmData?.length} color='primary'>
                <VscBell size={25} className='cursor-pointer' />
              </Badge>
            ) : (
              <VscBell size={25} className='cursor-pointer' />
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className='p-4 sm:py-4 flex gap-2'>
          <Button
            size='sm'
            className={`rounded-full bg-primary ${
              baple ? 'text-white' : 'text-black'
            }`}
            isDisabled={alarmData?.length === 0 ? true : false}
            onClick={() => readAllAlarm(userId)}
          >
            모두 읽음
          </Button>
          {alarmData?.map((item) => (
            <div
              key={item.id}
              className={`w-[200px] sm:w-[220px] h-auto ${
                baple ? 'bg-white' : 'bg-black'
              } p-2 text-xs sm:text-sm rounded-lg cursor-pointer hover:bg-slate-200 transition-background`}
              onClick={() => readAlarm(item.id, item.review_id)}
            >
              {item.type === 'comment' ? (
                <div className='flex'>
                  <Image
                    src={`/images/icons/${
                      baple ? 'comment_select' : 'CBicons/CBcomment_select'
                    }.svg`}
                    width={14}
                    height={14}
                    alt='likes icon'
                    className='mr-2'
                  />
                  <span>새로운 댓글이 있습니다.</span>
                </div>
              ) : (
                <div className='flex'>
                  <Image
                    src={`/images/icons/${
                      baple ? 'heart_select' : 'CBIcons/CBfilled-heart'
                    }.svg`}
                    width={14}
                    height={14}
                    alt='likes icon'
                    className='mr-2'
                  />
                  <span>새로운 좋아요가 있습니다.</span>
                </div>
              )}
            </div>
          ))}
          {alarmData?.length === 0 && (
            <div className={`p-2 ${baple ? 'text-gray-600' : 'text-white'}`}>
              새로운 알림이 없습니다.
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AlarmModal;
