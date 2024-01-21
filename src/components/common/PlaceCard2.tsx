import React from 'react';
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { Tables } from '@/types/supabase';
import { useQuery } from '@tanstack/react-query';
import { getBookmarksByPlaceId } from '@/apis/bookmarks';
import { getReviewsByPlaceId } from '@/apis/reviews';

type Props = {
  place: Tables<'places'>;
};

const PlaceCard2 = ({ place }: Props) => {
  const router = useRouter();
  const imgURL = place.image_url;

  const { data: bookmarksData, isLoading: isBookmarksLoading } = useQuery({
    queryKey: ['bookmarks', place.id],
    queryFn: () => getBookmarksByPlaceId(place.id),
  });

  const { data: reviewsData, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['reviewsPC', place.id],
    queryFn: () => getReviewsByPlaceId(place.id),
  });
  return (
    <div className='m-1'>
      <Card
        shadow='sm'
        // key={index}
        isPressable
        onPress={() => router.push(`/place/${place.id}`)}
        className='p-2 w-[250px] h-[250px]'
      >
        <CardBody className='overflow-visible p-0'>
          <Image
            shadow='sm'
            radius='lg'
            width='100%'
            height={230}
            alt={place.place_name}
            className='w-full object-cover h-[140px]'
            src={imgURL || undefined}
          />
        </CardBody>
        <CardFooter className='text-small justify-between'>
          <div className='flex flex-col items-start'>
            <strong className='mb-3'>{place.place_name}</strong>
            <div className='flex justify-between w-[210px]'>
              <div>
                <span>📑{reviewsData?.length}</span>
                <span>🔖{bookmarksData?.length}</span>
              </div>
              <span className='text-s'>{place.city}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlaceCard2;
