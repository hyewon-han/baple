import React, { useState, ChangeEvent } from 'react';
import { Button, Spacer, Textarea, modal } from '@nextui-org/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/config/configStore';
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { supabase } from '@/libs/supabase';
import { toastError, toastSuccess, toastWarn } from '@/libs/toastifyAlert';
import { getPlaceInfo, updatePlaceImage } from '@/apis/places';
import Seo from '@/components/layout/Seo';
import { useReviews } from '@/hooks/useReviews';
import imageCompression from 'browser-image-compression';
import SpinnerModal from '@/components/common/SpinnerModal';

const ReviewWritePage = () => {
  const [reviewText, setReviewText] = useState('');
  const [selectedImages, setSelectedImages] = useState<
    { file: File; imageUrl: string }[]
  >([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { userId } = useSelector((state: RootState) => state.auth);

  const router = useRouter();

  const { placeId } = router.query;

  const { data: placeInfo } = useQuery({
    queryKey: ['placeInfo', placeId],
    queryFn: () => getPlaceInfo(placeId as string),
    enabled: placeId !== undefined,
  });

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const selectedImageArray = [...selectedImages];
    const selectedFileArray = [...selectedFiles];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          const options = {
            maxSizeMB: 1, //storage 에 들어가는 사진은 절대로 1mb를 넘지 않음(확인완료)
            maxWidthOrHeight: 1920,
            useWebWorker: true, // 멀티쓰레드 사용 여부. 사용못할시 자동으로 싱글쓰레드로 동작
          };

          const compressedFile = await imageCompression(file, options);
          const imageUrl = URL.createObjectURL(compressedFile);

          if (selectedImageArray.length < 3) {
            selectedImageArray.push({ file: compressedFile, imageUrl });
            selectedFileArray.push(compressedFile);
          } else {
            toastWarn('이미지는 최대 3장만 업로드 가능합니다.');
          }
        } catch (error) {
          console.error('Error compressing image:', error);
          toastError('이미지 압축 중 오류가 발생했습니다.');
        }
      }

      setSelectedImages(selectedImageArray);
      setSelectedFiles(selectedFileArray);
    }
  };

  const queryClient = useQueryClient();

  const { insertReview } = useReviews(undefined, placeId as string);

  const { mutate: mutateToUpdate } = useMutation({
    mutationFn: updatePlaceImage,
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        'placeInfo',
        placeId,
      ] as InvalidateQueryFilters);
    },
  });

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const onSubmitReview = async () => {
    setModalOpen(true); // 스피너 모달 열기
    const publicUrlList: string[] = [];
    if (selectedFiles) {
      for (const file of selectedFiles) {
        const { data: fileData, error: fileError } = await supabase.storage
          .from('review_images')
          .upload(`${Date.now()}`, file);
        if (fileError) {
          console.error('이미지 업로드 에러', fileError.message);
          return;
        }
        const { data: imageData } = supabase.storage
          .from('review_images')
          .getPublicUrl(fileData.path);

        publicUrlList.push(imageData.publicUrl);
      }
      // 장소대표이미지가 없는 경우 첫 리뷰어의 첫번째 사진으로 장소 대표이미지 등록
      if (placeInfo?.image_url === '') {
        mutateToUpdate({ id: placeId as string, imageUrl: publicUrlList[0] });
      }
    }

    const isReviewEmpty = /^\s*$/;
    if (!reviewText) {
      toastWarn('후기는 필수 요소입니다. 입력 후 등록해 주세요.');
      return;
    } else if (isReviewEmpty.test(reviewText)) {
      toastWarn('공백 이외 내용을 입력해 주세요.');
      return;
    }
    const args = {
      content: reviewText,
      placeId: placeId as string,
      userId,
      publicUrlList,
    };
    insertReview(args);
    setModalOpen(false); // 스피너 모달 닫기
    toastSuccess('리뷰가 등록되었습니다.');
    router.replace(`/place/${placeId}`);
  };

  const modalMessage = '업로드중.. 잠시만 기다려주세요 😜';

  return (
    <>
      {modalOpen && <SpinnerModal message={modalMessage} />}
      <div className='min-h-screen py-20'>
        <Seo />
        <div className='p-4 sm:p-10 max-w-screen-sm mx-auto shadow'>
          <div className='mb-10 text-2xl font-semibold'>
            <div className='border-b-3 border-yellow-400'>
              {placeInfo?.place_name}
            </div>
          </div>
          <div>
            <div className='flex items-center mb-5'>
              <h2 className='text-xl mr-1 mb-2 '>리뷰를 작성해 주세요</h2>
              <span className='text-red-500 text-2xl font-bold'>*</span>
            </div>
          </div>
          <div className='mb-10'>
            <Textarea
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
              placeholder='다녀오신 장소에서 즐거운 시간을 보내셨나요? 
          방문 경험을 사용자들과 공유해 주세요!
          리뷰를 보는 사용자를 위해 욕설, 비방, 명예훼손성 표현은 주의해 주세요.'
              className='w-full p-2 border rounded focus:outline-none focus:border-blue-500'
            />
          </div>
          <div className='border-t-3 border-yellow-400 py-9 flex'>
            <h2 className='text-xl'>
              사진 첨부
              <br />
              <div className='text-sm'>최대 3장까지 첨부 가능합니다</div>
            </h2>
          </div>
          <div className='mb-10 flex flex-col sm:flex-row gap-6'>
            <label className='relative cursor-pointer'>
              <input
                type='file'
                accept='image/*'
                multiple
                onChange={handleImageChange}
                className='hidden'
              />
              <div className='w-24 h-24 bg-gray-200 flex items-center justify-center rounded'>
                <span className='text-3xl'>+</span>
              </div>
            </label>
            <div className='flex flex-wrap gap-4'>
              {selectedImages.map((image, index) => (
                <div
                  key={index}
                  className='image-preview relative inline-block w-24 h-24 mb-4 sm:mb-0 flex-shrink-0 flex-grow-0'
                >
                  <Image
                    src={image.imageUrl}
                    alt={`Selected Image ${index}`}
                    fill
                    className='object-cover'
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className='delete-button absolute font-extrabold right-1 text-gray-200 hover:text-red-500 cursor-pointer'
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className='flex items-center justify-center'>
            <Spacer x={2} />
            <Button
              color='primary'
              variant='solid'
              className='px-8'
              onClick={onSubmitReview}
              isDisabled={!reviewText}
            >
              등록하기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewWritePage;
