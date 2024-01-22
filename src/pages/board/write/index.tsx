import { FormValues, insertNewPost } from '@/apis/boards';
import MainWrapper from '@/components/layout/MainWrapper';
import { toastSuccess } from '@/libs/toastifyAlert';
import { RootState } from '@/redux/config/configStore';
import {
  Button,
  Divider,
  Input,
  Textarea,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { useRouter } from 'next/router';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const categoryList = [
  { label: '신규장소', value: '신규장소' },
  { label: '불편사항', value: '불편사항' },
];

const BoardWritePage = () => {
  const userInfo = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
  });

  const watchCategory = watch('category');
  const watchTitle = watch('title');
  const watchPlaceName = watch('placeName');
  const watchContent = watch('content');

  const createPost: SubmitHandler<FormValues> = (data) => {
    const formData = {
      ...data,
      userId: userInfo.userId,
    };

    insertNewPost(formData);
    router.push('/board');
    toastSuccess('등록되었습니다!');
  };

  return (
    <MainWrapper>
      <header className='flex mt-[50px] mb-[30px] justify-between'>
        <h2 className='text-3xl font-bold'>글쓰기</h2>
      </header>
      <Divider className='bg-primary h-0.5 mb-[30px]' />

      <section className='flex justify-center'>
        <form
          onSubmit={handleSubmit(createPost)}
          className='w-[70%] p-4 shadow-md '
        >
          <Input
            type='text'
            label='제목'
            variant='bordered'
            className='mb-[10px]'
            {...register('title', {
              required: '제목을 입력하세요',
            })}
          />
          <div className='flex gap-2'>
            <Select
              id='category'
              variant='bordered'
              className='mb-[10px] w-[40%]'
              placeholder='카테고리 선택'
              {...register('category', {
                required: '카테고리를 입력하세요',
              })}
            >
              {categoryList.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </Select>
            <Input
              type='text'
              variant='bordered'
              label='장소'
              className='mb-[10px]'
              {...register('placeName', {
                required: '장소를 입력하세요',
              })}
            />
          </div>
          <Textarea
            type='text'
            variant='bordered'
            minRows={10}
            label='내용'
            className='mb-[30px]'
            {...register('content', {
              required: '내용을 입력하세요',
            })}
          />

          <div className='text-right'>
            <Button className='mr-[10px]' onClick={() => router.back()}>
              취소
            </Button>
            <Button
              type='submit'
              className='bg-primary'
              isDisabled={
                !watchCategory ||
                !watchTitle ||
                !watchPlaceName ||
                !watchContent
              }
            >
              등록
            </Button>
          </div>
        </form>
      </section>
    </MainWrapper>
  );
};

export default BoardWritePage;
