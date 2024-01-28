const PagiNation = ({
  page,
  setPage,
  numPages,
}: {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  numPages: number;
}) => {
  const itemsPerPage = 5; // 한 번에 보여질 페이지 버튼 수
  const totalPages = Math.ceil(numPages / itemsPerPage);
  const currentPageGroup = Math.ceil(page / itemsPerPage);

  // 현재 페이지 그룹의 시작 페이지 및 끝 페이지 계산
  const startRange = (currentPageGroup - 1) * itemsPerPage + 1;
  const endRange = Math.min(currentPageGroup * itemsPerPage, numPages);

  return (
    <div className=' drop-shadow-2xl gap-4 flex  w-[320px] h-[1.5rem] m-1 mt-3 text-[30px] items-center justify-center'>
      {currentPageGroup > 1 && (
        <button
          onClick={() => setPage(startRange - 1)}
          className='화살표 스타일 text-[#1e1e1e]'
        >
          {'<'}
        </button>
      )}

      {[...Array(endRange - startRange + 1)].map((_, index) => {
        const pageNumber = startRange + index;
        return (
          <button
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            className={
              pageNumber === page
                ? 'text-primary font-bold '
                : ' text-[#1e1e1e] text-[22px]'
            }
          >
            {pageNumber}
          </button>
        );
      })}

      {currentPageGroup < totalPages && (
        <button
          onClick={() => setPage(endRange + 1)}
          className='화살표 스타일 text-[#1e1e1e]'
        >
          {'>'}
        </button>
      )}
    </div>
  );
};

export default PagiNation;
