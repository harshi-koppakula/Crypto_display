import { Pagination as BSPagination } from 'react-bootstrap';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <BSPagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => onPageChange(number)}
      >
        {number}
      </BSPagination.Item>
    );
  }

  return (
    <div className="d-flex justify-content-center my-4">
      <BSPagination>
        <BSPagination.Prev
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        />
        {items}
        <BSPagination.Next
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        />
      </BSPagination>
    </div>
  );
};