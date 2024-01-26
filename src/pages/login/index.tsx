import { Button, Input } from '@nextui-org/react';
import { EyeFilledIcon } from '@/components/login/EyeFilledIcon';
import { EyeSlashFilledIcon } from '@/components/login/EyeSlashFilledIcon';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Seo from '@/components/layout/Seo';
import { supabase } from '@/libs/supabase';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { toastError, toastSuccess } from '@/libs/toastifyAlert';

interface FormValues {
  email: string;
  password: string;
}

const LogInPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onChange' });

  const watchEmail = watch('email');
  const watchPassword = watch('password');

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const logInHandler: SubmitHandler<FormValues> = async (formData) => {
    const { email, password } = formData;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('error', error);
      toastError('로그인에 실패하였습니다.');
    } else {
      console.log('data', data);
      toastSuccess('로그인 되었습니다!');
      router.push('/');
    }
  };

  const logInWithKakao = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
    });
    if (error) throw error.message;
  };
  return (
    <>
      <Seo title='Login' />

      <div className='h-screen flex flex-col justify-center items-center gap-4'>
        <Link href='/' className='text-3xl font-black'>
          <Image
            src='/images/icons/basic-logo.svg'
            alt='main logo'
            width={100}
            height={50}
          />
        </Link>
        <form
          onSubmit={handleSubmit(logInHandler)}
          className='flex flex-col gap-2'
        >
          <Input
            isClearable
            type='email'
            label='Email'
            variant='bordered'
            placeholder='이메일 아이디를 입력해주세요'
            className='w-80'
            {...register('email', {
              required: '이메일을 입력하세요',
              pattern: {
                value: /^\S+@\S+$/i,
                message: '올바른 메일 형식이 아닙니다',
              },
            })}
          />
          {errors.email && (
            <p className='text-red-500 text-xs text-center'>
              {errors.email.message}
            </p>
          )}
          <Input
            label='Password'
            variant='bordered'
            placeholder='비밀번호를 입력해주세요'
            endContent={
              <button
                className='focus:outline-none'
                type='button'
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                ) : (
                  <EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                )}
              </button>
            }
            type={isVisible ? 'text' : 'password'}
            className='w-80'
            {...register('password', {
              required: '비밀번호를 입력해주세요',
              pattern: {
                value: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
                message: '비밀번호는 영문, 숫자 포함 8자 이상 입니다.',
              },
            })}
          />
          {errors.password && (
            <p className='text-red-500 text-xs text-center'>
              {errors.password.message}
            </p>
          )}
          <div className='flex flex-col gap-2'>
            <Button
              color='primary'
              type='submit'
              isDisabled={!watchEmail || !watchPassword}
              className=''
            >
              Login
            </Button>
            <Link href={'/signup'}>
              <p className='w-full text-right text-gray-600 text-sm'>
                회원가입 하러 가기 &rarr;
              </p>
            </Link>
            <button onClick={logInWithKakao}>
              <Image
                src='/images/kakao_login.png'
                alt='kakao login'
                width={320}
                height={300}
              />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LogInPage;
