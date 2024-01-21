import PlaceCard2 from '@/components/common/PlaceCard2';
import { supabase } from '@/libs/supabase';
import { Tables } from '@/types/supabase';
import { Button, Input, CheckboxGroup, Checkbox } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  QueryFilters,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import Seo from '@/components/layout/Seo';

const PlacesPage = () => {
  // 체크박스를 클릭할때 해당 체크박스 value가 배열형태로 순서대로 들어감
  const [selected, setSelected] = useState<string[]>([]);
  // 체크박스 상태 변화를 감지할 수 있는 추가적인 상태
  const [checkboxChanged, setCheckboxChanged] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchedPlaces, setSearchedPlaces] = useState<Tables<'places'>[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  // const [isFinished, setIsFinished] = useState(false);
  const queryClient = useQueryClient();
  const pageSize = 20; // 페이지당 장소 수

  // console.log('searchValue', searchValue);
  // console.log('aaaa', selected);
  useEffect(() => {
    handleSearch();
  }, [selected]);

  // 체크박스 상태에 변화가 있을 때마다 데이터를 다시 불러오도록 useEffect 추가
  useEffect(() => {
    if (checkboxChanged) {
      // 체크박스가 변경되었으면 데이터를 다시 불러오기
      loadMoreData();
      setCheckboxChanged(false); // 체크박스 상태 변경 표시 초기화
    }
  }, [checkboxChanged, selected]);

  // 검색 버튼을 눌렀을 때만 데이터를 초기화하고 첫 페이지부터 데이터를 불러오기
  const handleSearch = () => {
    setSearchedPlaces([]); // 새로운 검색어가 입력될 때 기존에 검색된 장소를 비움
    setCurrentPage(1);
    setCheckboxChanged(true); // 체크박스 상태가 변경되었음을 표시
  };

  // 검색 버튼 클릭 시 데이터 불러오기
  const handleClickSearch = () => {
    handleSearch();
    loadMoreData();
  };

  const loadMoreData = async () => {
    setLoading(true);

    try {
      let query = supabase
        .from('places')
        .select('*')
        .ilike('place_name', `%${searchValue}%`);

      // 선택된 체크박스에 따라 필터 추가
      if (selected.length > 0) {
        selected.forEach((checkbox) => {
          query = query.in(checkbox, [true]);
        });
      }

      const { data, error } = await query.range(
        (currentPage - 1) * pageSize,
        currentPage * pageSize - 1,
      );

      if (!error) {
        if (data.length === 0) {
          // setIsFinished(true);
          return;
        }

        // console.log('페이징 및 필터링된 데이터:', data);
        setSearchedPlaces([...searchedPlaces, ...data]);
        setCurrentPage((prev) => prev + 1);
      }
    } finally {
      setLoading(false);
    }
  };
  // console.log('CurrentPage', currentPage);

  // console.log('searchedPlaces', searchedPlaces);
  const { ref } = useInView({
    threshold: 1,
    onChange: (inView) => {
      if (!inView) return;
      loadMoreData();
    },
  });

  return (
    <div>
      <Seo title='장소 검색' />
      <div className='flex flex-col gap-3'>
        <CheckboxGroup
          label='편의시설'
          color='warning'
          value={selected}
          onValueChange={setSelected}
        >
          {/* <Button value='is_paid' color='primary' onClick={(e) => {}}>
            #입장료
          </Button>
          <Button></Button>
          <Button></Button>
          <Button></Button>
          <Button></Button>
          <Button></Button>
          <Button></Button> */}

          <Checkbox value='is_paid'>입장료</Checkbox>
          <Checkbox value='is_easy_door'>장애인용 출입문</Checkbox>
          <Checkbox value='is_wheelchair_rental'>휠체어 대여</Checkbox>
          <Checkbox value='is_guide_dog'>안내견 동반</Checkbox>
          <Checkbox value='is_braille_guide'>점자 가이드</Checkbox>
          <Checkbox value='is_audio_guide'>오디오 가이드</Checkbox>
          <Checkbox value='is_disabled_toilet'>장애인용 화장실</Checkbox>
          <Checkbox value='is_disabled_parking'>장애인용 주차장</Checkbox>
        </CheckboxGroup>
        <p className='text-default-500 text-small'>
          Selected: {selected.join(', ')}
        </p>
      </div>
      <div className='flex justify-center'>
        <Input
          placeholder='검색어를 입력하세요'
          value={searchValue}
          onValueChange={setSearchValue}
          className='w-96'
        />
        <Button
          color='primary'
          type='submit'
          className='h-12'
          onClick={handleClickSearch}
        >
          검색
        </Button>
      </div>
      <div className='grid grid-cols-4'>
        {/* {places?.pages?.map((page) =>
          page.map((place: Tables<'places'>, idx: number) => (
            <PlaceCard2 key={idx} place={place} />
          )),
        )} */}
        {searchedPlaces.map((place, idx) => (
          <PlaceCard2 key={idx} place={place} />
        ))}
      </div>
      {/* {searchedPlaces.length === 0 || isFinished ? null : (
        <div className='w-full flex justify-center m-2'>
          <Button onClick={loadMoreData} isDisabled={loading} color='primary'>
            더보기
          </Button>
        </div>
      )} */}
      <div
        style={{
          textAlign: 'center',
          backgroundColor: 'green',
          color: 'white',
          width: '100%',
          height: 50,
        }}
        ref={ref}
      >
        Trigger to Fetch Here
      </div>
    </div>
  );
};

export default PlacesPage;
