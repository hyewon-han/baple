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
import { toastSuccess, toastWarn } from '@/libs/toastifyAlert';

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
      if (selectedFile.size > 1024 * 1024) {
        return toastWarn('최대 1MB까지 업로드 가능합니다.');
      }
      const imgUrl = URL.createObjectURL(selectedFile);
      setNewAvatar(selectedFile);
      setImagePreview(imgUrl);
      setIsCheckedAvatar(true);
    }
  };

  const validateUsername = async (username: string) => {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('user_name', username);
    if (error) throw error;
    if (username === undefined) {
      toastWarn('닉네임을 변경해주세요. 😅');
      setIsCheckedUsername(false);
    } else if (data?.length !== 0) {
      toastWarn('이미 사용중인 닉네임 입니다. 😅');
      setIsCheckedUsername(false);
    } else {
      toastSuccess('사용 가능한 닉네임 입니다. 😄');
      setIsCheckedUsername(true);
    }
  };
  console.log('newUsername', newUsername);
  return (
    <div className='flex gap-6 items-center justify-center w-full m-6'>
      {isEditing ? (
        <label className='relative'>
          <Avatar showFallback src={imagePreview} className='w-36 h-36' />
          <div className='absolute top-0 w-full h-full flex flex-col justify-center items-center text-white transition-opacity cursor-pointer  rounded-full backdrop-blur-sm backdrop-brightness-50 opacity-0 hover:opacity-100'>
            <MdPhotoCameraBack className='text-[4rem] mx-auto ' />
            <p className='font-bold'>이미지 변경</p>
          </div>
          <input
            type='file'
            accept='image/*'
            className='hidden'
            onChange={previewImg}
          />
        </label>
      ) : (
        <Avatar showFallback src={user?.avatar_url} className='w-36 h-36' />
      )}
      <div className='flex flex-col gap-6'>
        <div className='flex gap-3 items-center'>
          <label className='w-16' htmlFor='username'>
            닉네임
          </label>
          {isEditing ? (
            <div className='flex gap-2 items-center'>
              <Input
                id='username'
                defaultValue={user?.user_name}
                onChange={(e) => setNewUsername(e.target.value)}
                className='w-32'
              />
              <Button onClick={() => validateUsername(newUsername)}>
                중복 확인
              </Button>
            </div>
          ) : (
            <span className='text-md'>{user?.user_name}</span>
          )}
        </div>
        <div className='flex gap-3 items-center'>
          <label className='w-16'>이메일</label>
          <span className='text-small text-default-500'>{user?.email}</span>
        </div>
        {isEditing ? (
          <div className='flex gap-4 justify-center'>
            <Button
              onClick={onEditDone}
              color='primary'
              isDisabled={!isCheckedAvatar && !isCheckedUsername}
            >
              수정완료
            </Button>
            <Button
              onClick={() => {
                setIsEditing(false);
                // setImagePreview('');
                setIsCheckedAvatar(false);
                setIsCheckedUsername(false);
              }}
              color='primary'
              variant='bordered'
            >
              취소
            </Button>
          </div>
        ) : (
          <div className='flex justify-center'>
            <Button
              onClick={() => setIsEditing(true)}
              color='primary'
              className='w-12'
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
