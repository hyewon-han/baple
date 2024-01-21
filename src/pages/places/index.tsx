import PlaceCard2 from '@/components/common/PlaceCard2';
import MainWrapper from '@/components/layout/MainWrapper';
import { supabase } from '@/libs/supabase';
import { Tables } from '@/types/supabase';
import { Button, Input, Spacer } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const PlacesPage = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [checkboxChanged, setCheckboxChanged] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchedPlaces, setSearchedPlaces] = useState<Tables<'places'>[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const pageSize = 20;

  useEffect(() => {
    handleSearch();
  }, [selected]);

  useEffect(() => {
    if (checkboxChanged) {
      loadMoreData();
      setCheckboxChanged(false);
    }
  }, [checkboxChanged, selected]);

  const handleSearch = () => {
    setSearchedPlaces([]);
    setCurrentPage(1);
    setCheckboxChanged(true);
  };

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
          return;
        }
        setSearchedPlaces([...searchedPlaces, ...data]);
        setCurrentPage((prev) => prev + 1);
      }
    } finally {
      setLoading(false);
    }
  };
  const { ref } = useInView({
    threshold: 1,
    onChange: (inView) => {
      if (!inView) return;
      loadMoreData();
    },
  });

  const handleCheckboxClick = (value: string) => {
    setSelected((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((item) => item !== value)
        : [...prevSelected, value],
    );
    setCheckboxChanged(true);
  };

  const checkboxButton = (value: string, label: string) => (
    <Button
      key={value}
      onClick={() => handleCheckboxClick(value)}
      color='primary'
      radius='full'
      size='lg'
      variant={selected.includes(value) ? 'solid' : 'ghost'}
    >
      {label}
    </Button>
  );

  return (
    <MainWrapper>
      <div className='flex gap-6'>
        {/* 태그 */}
        <div className='flex w-[20%]'>
          <div className='flex flex-col gap-4 w-full mt-[50px]'>
            {checkboxButton('is_paid', '# 입장료')}
            {checkboxButton('is_easy_door', '# 장애인용 출입문')}
            {checkboxButton('is_wheelchair_rental', '# 휠체어 대여')}
            {checkboxButton('is_guide_dog', '# 안내견 동반')}
            {checkboxButton('is_braille_guide', '# 점자 가이드')}
            {checkboxButton('is_audio_guide', '# 오디오 가이드')}
            {checkboxButton('is_disabled_toilet', '# 장애인용 화장실')}
            {checkboxButton('is_disabled_parking', '# 장애인용 주차장')}
          </div>
        </div>
        {/* 검색창 */}
        <div className='w-[70%]'>
          <div className='flex justify-center mb-4 mt-10 w-full'>
            <Input
              placeholder='검색어를 입력하세요'
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <Button
              color='primary'
              type='submit'
              className='h-[56px] ml-2'
              onClick={handleClickSearch}
            >
              검색
            </Button>
          </div>
          {/* 카드 */}
          <div className='flex justify-center'>
            <div className='grid lg:grid-cols-3 sm:grid-cols-2 gap-[3rem] w-full'>
              {searchedPlaces.map((place, idx) => (
                <PlaceCard2 key={idx} place={place} />
              ))}
            </div>
          </div>

          <div ref={ref}></div>
        </div>
      </div>
    </MainWrapper>
  );
};

export default PlacesPage;
