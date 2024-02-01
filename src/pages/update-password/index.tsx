import { Button, Input } from '@nextui-org/react';
import { EyeFilledIcon } from '@/components/login/EyeFilledIcon';
import { EyeSlashFilledIcon } from '@/components/login/EyeSlashFilledIcon';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { supabase } from '@/libs/supabase';
import { toastError, toastSuccess } from '@/libs/toastifyAlert';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

interface FormValues {
  password: string;
  confirmPassword: string;
}

const UpdatePasswordPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onChange' });
  const router = useRouter();
  const watchPassword = watch('password');
  const watchConfirmPassword = watch('confirmPassword');

  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const toggleVisibility1 = () => setIsVisible1(!isVisible1);
  const toggleVisibility2 = () => setIsVisible2(!isVisible2);

  //   useEffect(() => {
  //     supabase.auth.onAuthStateChange(async (event, session) => {
  //       if (event == "PASSWORD_RECOVERY") {
  //         const newPassword = prompt("What would you like your new password to be?");
  //         const { data, error } = await supabase.auth
  //           .updateUser({ password: watchPassword })

  //         if (data) alert("Password updated successfully!")
  //         if (error) alert("There was an error updating your password.")
  //       }
  //     })
  //   }, [])

  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.updateUser({
      password: watchPassword,
    });
    if (data) {
      toastSuccess('비밀번호 변경 성공!');
      router.push('/');
    } else {
      toastError('비밀번호 변경 실패!');
    }
    if (error) throw error;
  };
  return (
    <form
      onSubmit={changePassword}
      className='h-screen flex flex-col justify-center items-center gap-4'
    >
      <Link href='/' className='text-3xl font-black'>
        <Image
          src='/images/icons/basic-logo.svg'
          alt='main logo'
          width={100}
          height={50}
        />
      </Link>
      <div className='flex flex-col text-center gap-2 text-sm'>
        <span>새로운 비밀번호를 입력해 주세요</span>
      </div>
      <Input
        label='비밀번호'
        variant='bordered'
        placeholder='비밀번호는 영문, 숫자 포함 최소 8자 이상 입력해주세요'
        maxLength={20}
        endContent={
          <button
            className='focus:outline-none'
            type='button'
            onClick={toggleVisibility1}
          >
            {isVisible1 ? (
              <EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
            ) : (
              <EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
            )}
          </button>
        }
        type={isVisible1 ? 'text' : 'password'}
        className='w-72 sm:w-80'
        {...register('password', {
          required: '비밀번호를 입력해주세요',
          pattern: {
            value: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
            message: '비밀번호는 영문, 숫자 포함 최소 8자 이상 입력해주세요',
          },
        })}
      />
      {errors.password && (
        <p className='text-red-500 text-xs text-center'>
          {errors.password.message}
        </p>
      )}
      <Input
        label='비밀번호 확인'
        variant='bordered'
        placeholder='비밀번호는 영문, 숫자 포함 최소 8자 이상 입력해주세요'
        maxLength={20}
        endContent={
          <button
            className='focus:outline-none'
            type='button'
            onClick={toggleVisibility2}
          >
            {isVisible2 ? (
              <EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
            ) : (
              <EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
            )}
          </button>
        }
        type={isVisible2 ? 'text' : 'password'}
        className='w-72 sm:w-80'
        {...register('confirmPassword', {
          required: '비밀번호를 입력해주세요',
          validate: (value) => value === watchPassword,
        })}
      />
      {errors.confirmPassword && (
        <p className='text-red-500 text-xs text-center'>
          {errors.confirmPassword.message}
        </p>
      )}
      {errors.confirmPassword && errors.confirmPassword.type === 'validate' && (
        <p className='text-red-500 text-xs text-center'>
          비밀번호가 일치하지 않습니다
        </p>
      )}
      <Button
        color='primary'
        type='submit'
        isDisabled={watchPassword !== watchConfirmPassword}
      >
        비밀번호 변경
      </Button>
    </form>
  );
};

export default UpdatePasswordPage;
