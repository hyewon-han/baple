import { ReviewsFromRPC } from '@/types/types';
import { Pagination, Spacer } from '@nextui-org/react';
import React from 'react';
import ReviewCard from '../common/ReviewCard';
import ReviewCardMobile from '../common/ReviewCardMobile';
import { useViewport } from '@/hooks/useViewport';

interface Props {
  reviews?: ReviewsFromRPC[] | undefined;
}

const PaiginatedReviews = ({ reviews = [] }: Props) => {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;
  const pages = Math.ceil((reviews?.length ?? 0) / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return reviews?.slice(start, end);
  }, [page, reviews]);

  const { isMobile } = useViewport();

  return (
    <div className='w-full flex flex-col gap-y-2 items-center'>
      {!isMobile &&
        items?.map((review, idx) => <ReviewCard key={idx} review={review} />)}
      {isMobile &&
        items?.map((review, idx) => (
          <ReviewCardMobile key={idx} review={review} />
        ))}
      <Spacer y={5} />
      <Pagination
        isCompact
        showControls
        showShadow
        color='primary'
        page={page}
        total={pages}
        onChange={(page) => setPage(page)}
      />
      <Spacer y={5} />
    </div>
  );
};

export default PaiginatedReviews;
