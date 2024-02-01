import { getPost } from '@/apis/boards';
import { useBoards } from '@/hooks/useBoards';
import { toastError, toastWarn } from '@/libs/toastifyAlert';
import { RootState } from '@/redux/config/configStore';
import { Button, Input, Textarea, Spacer, Divider } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import QuillNoSSRWrapper from '../common/QuillEditor';
import ReactQuill from 'react-quill';
import { supabase } from '@/libs/supabase';
import imageCompression from 'browser-image-compression';
import SpinnerModal from '../common/SpinnerModal';

const categoryList = ['신규장소', '불편사항'];

interface Props {
  isEdit: boolean;
}

const Editor = ({ isEdit }: Props) => {
  const { userId } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const { insertPost, updatePost } = useBoards();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const boardId: string = router.query.boardId as string;
  const [inputs, setInputs] = useState({
    title: '',
    category: '신규장소',
    content: '',
    place_name: '',
  });

  const { data: post } = useQuery({
    queryKey: ['posts', boardId],
    queryFn: () => getPost(boardId),
    enabled: !!boardId,
  });

  const inputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  //QUILL 관련 코드
  const quillInstance = useRef<ReactQuill>(null);

  const quillValueChangeHandler = (contents: string) => {
    setInputs({
      ...inputs,
      content: contents,
    });
  };
  //QUILL 이미지 핸들러
  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.addEventListener('change', async () => {
      setModalOpen(true); //모달 open
      //이미지를 담아 전송할 file을 만든다
      const rawfile = input.files?.[0] as File;
      try {
        const options = {
          maxSizeMB: 1, //storage 에 들어가는 사진은 절대로 1mb를 넘지 않음(확인완료)
          maxWidthOrHeight: 1920,
          useWebWorker: true, // 멀티쓰레드 사용 여부. 사용못할시 자동으로 싱글쓰레드로 동작
        };
        const file = await imageCompression(rawfile, options);

        const { data: fileData, error: fileError } = await supabase.storage
          .from('board_images')
          .upload(`${Date.now()}`, file);
        if (fileError) {
          console.error('이미지 업로드 에러', fileError.message);
          return;
        }
        //업로드 된 이미지 url을 가져오기
        const { data: uploadedIMG } = supabase.storage
          .from('board_images')
          .getPublicUrl(fileData.path);
        //에디터의 현재 커서 위치에 이미지 삽입
        const editor = quillInstance!.current!.getEditor();
        const range = editor.getSelection();
        // 가져온 위치에 이미지를 삽입
        editor.insertEmbed(range!.index, 'image', uploadedIMG.publicUrl);
        setModalOpen(false); //모달 close
      } catch (error) {
        console.error(error);
        toastError('이미지 업로드에 실패했습니다. 다른 이미지로 시도해주세요');
        setModalOpen(false); //모달 close
      }
    });
  };
  //QUILL config
  const editModeModules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ['image'],
          [{ header: [1, 2, 3, 4, 5, false] }],
          ['bold', 'underline', 'italic', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    };
  }, []);

  // 유효성 검사
  const validateCheck = () => {
    if (
      inputs.title.trim() === '' ||
      inputs.content.trim() === '' ||
      inputs.place_name.trim() === '' ||
      inputs.category === 'undefined'
    ) {
      toastWarn('모든 정보를 입력해주세요');
      return false;
    }
    if (inputs.content.trim().length < 5) {
      toastWarn('내용은 5자 이상 입력해주세요');
      return;
    }
    return true; // 조건을 만족할 때만 true 반환
  };

  const formData = {
    title: inputs.title,
    category: inputs.category,
    content: inputs.content,
    placeName: inputs.place_name,
    userId,
  };

  const createPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateCheck()) {
      return; // validateCheck가 false를 반환하면 함수 종료
    }

    Swal.fire({
      icon: 'success',
      title: '이대로 등록하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '등록',
      cancelButtonText: '취소',
      confirmButtonColor: '#7b4cff',
    }).then((result) => {
      if (result.isConfirmed) {
        insertPost(formData);
      }
    });
  };

  const editPost = () => {
    if (!validateCheck()) {
      return; // validateCheck가 false를 반환하면 함수 종료
    }
    Swal.fire({
      icon: 'success',
      title: '이대로 수정하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '수정',
      cancelButtonText: '취소',
      confirmButtonColor: '#7b4cff',
    }).then((result) => {
      if (result.isConfirmed) {
        updatePost({ boardId, editValue: formData });
      }
    });
  };

  useEffect(() => {
    if (isEdit && post) {
      setInputs({
        title: post.title || '',
        category: post.category || '신규장소',
        content: post.content || '',
        place_name: post.place_name || '',
      });
    }
  }, [isEdit, post]);
  const modalMessage = '사진 올리는중.. 잠시만 기다려주세요';

  return (
    <section className='flex justify-center'>
      <form onSubmit={createPost} className='w-[100%]'>
        <Input
          type='text'
          label='제목'
          variant='bordered'
          aria-label='제목'
          className='mb-[10px]'
          name='title'
          value={inputs.title}
          onChange={inputChange}
          maxLength={20}
        />
        <div className='flex gap-2'>
          <select
            id='category'
            className='mb-[10px] w-[40%] border-2 p-2 rounded-md border-[##ffe7eb] text-sm text-[#71717a]'
            aria-label='카테고리 선택'
            name='category'
            value={inputs.category}
            onChange={inputChange}
          >
            {categoryList.map((category) => (
              <option
                key={category}
                value={category}
                defaultValue={isEdit ? post?.category : undefined}
                className='p-2 h-2'
              >
                {category}
              </option>
            ))}
          </select>
          <Input
            type='text'
            variant='bordered'
            label='장소'
            aria-label='장소'
            name='place_name'
            value={inputs.place_name}
            className='mb-[10px]'
            onChange={inputChange}
            maxLength={16}
          />
        </div>
        {/* <Textarea
          type='text'
          variant='bordered'
          minRows={10}
          label='내용 (장소에 대한 간략한 설명도 적어주세요 :)'
          aria-label='내용'
          name='content'
          value={inputs.content}
          onChange={inputChange}
        /> */}
        <div>
          {modalOpen && <SpinnerModal message={modalMessage} />}

          <QuillNoSSRWrapper
            forwardedRef={quillInstance}
            value={inputs.content}
            onChange={quillValueChangeHandler}
            modules={editModeModules}
          />
        </div>

        <Spacer y={6} />
        <Divider className='h-0.5 mb-[30px]' />

        <div className='text-right mb-6 sm:mb-0'>
          <Button
            className='mr-[10px] rounded-full px-8'
            onClick={() => router.back()}
          >
            취소
          </Button>
          {isEdit ? (
            <Button
              type='button'
              className='bg-primary text-white rounded-full px-8'
              onClick={editPost}
            >
              수정
            </Button>
          ) : (
            <Button
              type='submit'
              className='bg-primary text-white rounded-full px-8'
            >
              등록
            </Button>
          )}
        </div>
      </form>
    </section>
  );
};

export default Editor;
