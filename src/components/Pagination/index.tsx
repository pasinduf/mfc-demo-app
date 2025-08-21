import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { usePagination, DOTS } from './usePagination';

interface Props {
  page: number;
  rowsPerPage: number;
  count: number;
  onChangePage: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number,
  ) => void;
}

const Pagination = ({ page, rowsPerPage, count, onChangePage }: Props) => {
  const siblingCount = 1;
  const pages =
    count % rowsPerPage > 0
      ? Math.ceil(count / rowsPerPage)
      : count / rowsPerPage;

  const next = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
  ) => {
    if (page === pages) return;
    onChangePage(event, page + 1);
  };

  const prev = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
  ) => {
    if (page === 0) return;
    onChangePage(event, page - 1);
  };

  const paginationRange: any = usePagination({
    currentPage: page,
    totalCount: count,
    siblingCount,
    pageSize: rowsPerPage,
  });

  return (
    <div className="flex items-center gap-4">
      <button
        className="flex items-center gap-2 rounded-full bg-transparent px-4 py-1 cursor-pointer hover:bg-bodydark2 text-center font-medium text-black"
        onClick={(event) => prev(event)}
        disabled={page === 0}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
        Prev
      </button>

      <div className="flex items-center gap-2">
        {[...Array(pages)].map((item, index) => {
          return (
            <button
              key={`page-${index + 1}`}
              onClick={(event) => onChangePage(event, index)}
              className={`${
                page == index
                  ? 'bg-black text-white'
                  : 'bg-transparent hover:bg-white  text-black'
              } cursor-pointer px-2`}
            >
              {index + 1}
            </button>
          );
        })}
        {/* {paginationRange.map((pageNumber: any, index: number) => {
          if (pageNumber === DOTS) {
            return <li className="pagination-item dots">&#8230;</li>;
          }

          return (
            <button
              key={`page-${index + 1}`}
              onClick={() => onChangePage(index + 1)}
              className={`${
                page == index + 1
                  ? 'bg-black text-white'
                  : 'bg-transparent hover:bg-white  text-black'
              } cursor-pointer px-2`}
            >
              {index + 1}
            </button>
          );
        })} */}
      </div>
      <button
        onClick={(event) => next(event)}
        disabled={page + 1 === pages}
        className="flex items-center gap-2 rounded-full bg-transparent px-4 py-1 cursor-pointer hover:bg-bodydark2 text-center font-medium text-black"
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
