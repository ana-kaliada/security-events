export type TablePaginationProps = {
  page: number;
  pageSize: string;
  pageSizeOptions: readonly string[];
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: string) => void;
};
