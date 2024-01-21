import PlaceCard2 from '@/components/common/PlaceCard2';
import { supabase } from '@/libs/supabase';
import { Tables } from '@/types/supabase';
import { Button, Input } from '@nextui-org/react';
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
    <div>
      <div className='flex flex-col'>
        <div>
          <div className='flex flex-col gap-4 w-[300px] z-10 fixed top-[8rem] left-[20rem] '>
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
        {/* <p className='text-default-500 text-small'>
          Selected: {selected.join(', ')}
        </p> */}
      </div>
      <div className='flex justify-center mb-20 mt-10'>
        <Input
          placeholder='검색어를 입력하세요'
          value={searchValue}
          onValueChange={setSearchValue}
          className='w-[51rem] '
        />
        <Button
          color='primary'
          type='submit'
          className='h-12 ml-10'
          onClick={handleClickSearch}
        >
          검색
        </Button>
      </div>
      <div className='flex justify-center'>
        <div className='grid grid-cols-3 gap-[5rem]'>
          {searchedPlaces.map((place, idx) => (
            <PlaceCard2 key={idx} place={place} />
          ))}
        </div>
      </div>
      <div ref={ref}></div>
    </div>
  );
};

export default PlacesPage;
