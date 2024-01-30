import React, { useState } from 'react';
import { getUserDataById, updateUser } from '@/apis/users';
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Avatar, Button, Input } from '@nextui-org/react';
import { supabase } from '@/libs/supabase';
import { MdPhotoCameraBack } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import { toastWarn } from '@/libs/toastifyAlert';
import { validateUsername } from '@/utils/validationUtils';
import { useViewport } from '@/hooks/useViewport';

const MyProfile = () => {
  const { username, avatarUrl, userId } = useSelector(
    (state: RootState) => state.auth,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [isCheckedUsername, setIsCheckedUsername] = useState(false);
  const [isCheckedAvatar, setIsCheckedAvatar] = useState(false);
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(avatarUrl);
  const { isMobile } = useViewport();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserDataById(userId),
    enabled: !!userId,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        'user',
        userId,
      ] as InvalidateQueryFilters);
    },
  });

  const onEditDone = async () => {
    // avatar 수정이 있을 때
    if (newAvatar) {
      // storage 업로드
      const { data: fileData, error: fileError } = await supabase.storage
        .from('avatars')
        .upload(`${Date.now()}`, newAvatar);
      if (fileError) {
        console.error('이미지 업로드 에러', fileError.message);
        return;
      }
      const { data: imageData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileData.path);
      const newAvatarUrl = imageData.publicUrl;
      mutate({ userId, newUsername, newAvatarUrl });
      setIsEditing(false);
    } else {
      // 닉네임만 수정할 때
      mutate({ userId, newUsername });
      setIsEditing(false);
    }
  };

  const previewImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile?.size > 1024 * 1024) {
        return toastWarn('최대 1MB까지 업로드 가능합니다.');
      }
      const imgUrl = URL?.createObjectURL(selectedFile);
      setNewAvatar(selectedFile);
      setImagePreview(imgUrl);
      setIsCheckedAvatar(true);
    }
  };

  if (error) console.error(error.message);

  return (
    <div className='flex gap-6 items-center justify-center my-6 w-fit'>
      {isEditing ? (
        <label className='relative'>
          <Avatar
            showFallback
            src={imagePreview}
            className='w-16 h-16 sm:w-36 sm:h-36'
          />
          <div className='absolute top-0 w-full h-full flex flex-col justify-center items-center text-white transition-opacity cursor-pointer  rounded-full backdrop-blur-sm backdrop-brightness-50 opacity-0 hover:opacity-100'>
            <MdPhotoCameraBack className='text-3xl sm:text-[4rem] mx-auto ' />
            <p className='font-base text-xs sm:text-base sm:font-bold'>
              이미지 변경
            </p>
          </div>
          <input
            type='file'
            accept='image/*'
            className='hidden'
            onChange={previewImg}
          />
        </label>
      ) : (
        <Avatar
          showFallback
          src={user?.avatar_url}
          className='w-16 h-16 sm:w-36 sm:h-36'
        />
      )}
      <div className='flex flex-col gap-6'>
        <div className='flex gap-1 items-center'>
          <label className='w-16' htmlFor='username'>
            닉네임
          </label>
          {isEditing ? (
            <div className='flex gap-2 items-center'>
              <Input
                id='username'
                defaultValue={user?.user_name}
                onChange={(e) => setNewUsername(e.target.value)}
                size={isMobile ? 'sm' : 'md'}
              />
              <Button
                onClick={() =>
                  validateUsername(newUsername, setIsCheckedUsername)
                }
                size={isMobile ? 'sm' : 'md'}
              >
                중복 확인
              </Button>
            </div>
          ) : (
            <span className='text-md'>{user?.user_name}</span>
          )}
        </div>
        <div className='flex gap-1 items-center'>
          <label className='w-16'>이메일</label>
          <span className='text-small text-default-500'>{user?.email}</span>
        </div>
        {isEditing ? (
          <div className='flex gap-4 justify-center'>
            <Button
              onClick={onEditDone}
              color='primary'
              isDisabled={!isCheckedAvatar && !isCheckedUsername}
              size={isMobile ? 'sm' : 'md'}
            >
              수정완료
            </Button>
            <Button
              onClick={() => {
                setIsEditing(false);
                setIsCheckedAvatar(false);
                setIsCheckedUsername(false);
              }}
              color='primary'
              variant='bordered'
              size={isMobile ? 'sm' : 'md'}
            >
              취소
            </Button>
          </div>
        ) : (
          <div className='flex justify-center'>
            <Button
              onClick={() => setIsEditing(true)}
              color='primary'
              size={isMobile ? 'sm' : 'md'}
            >
              수정
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
