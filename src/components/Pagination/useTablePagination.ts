import { useCallback, useEffect, useState, useRef } from 'react';

type Response = {
  paging: {
    pageSize: number;
    pageIndex: number;
  };
  tableRef: any;
  ediTableRef: any;
  onChangePage: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number,
  ) => void;
  onChangeRowsPerPage: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  resetPagingOnChange: () => void;
  updatePagingWithoutChanges: () => void;
};

export const useTablePagination = (
  pageSize: number,
  pageIndex: number,
): Response => {
  // The documentation says to use "any"
  const tableRef = useRef<any>();
  const ediTableRef = useRef<any>();
  const [paging, setPaging] = useState({
    pageSize,
    pageIndex,
  });

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.dataManager.changePageSize(paging.pageSize);
    }
    if (ediTableRef.current) {
      ediTableRef.current.dataManager.changePageSize(paging.pageSize);
    }
  }, [paging.pageSize]);

  const onChangePage = useCallback((e: any, newPage: number): void => {
    const cursoreValue = localStorage.getItem('cursor');
    if (tableRef.current) {
      tableRef.current.tableContainerDiv.current.scrollTop = 0;
    }
    if (ediTableRef.current) {
      ediTableRef.current.tableContainerDiv.current.scrollTop = 0;
    }
    if (cursoreValue) {
      setPaging((prevState) => ({
        ...prevState,
        pageIndex: newPage,
        lastCursor: cursoreValue,
      }));
    } else {
      setPaging((prevState) => ({ ...prevState, pageIndex: newPage }));
    }
  }, []);

  const onChangeRowsPerPage = useCallback(
    ({ target: { value } }: any): void => {
      setPaging((prevState) => ({
        ...prevState,
        pageIndex: 0,
        pageSize: parseInt(value),
      }));
    },
    [],
  );

  const resetPagingOnChange = useCallback((): void => {
    if (tableRef.current) {
      tableRef.current.tableContainerDiv.current.scrollTop = 0;
    }
    if (ediTableRef.current) {
      ediTableRef.current.tableContainerDiv.current.scrollTop = 0;
    }
    setPaging((prevState) => ({ ...prevState, pageIndex: 0 }));
  }, []);

  const updatePagingWithoutChanges = useCallback((): void => {
    setPaging((prevState) => ({ ...prevState }));
  }, []);

  return {
    paging,
    tableRef,
    ediTableRef,
    onChangePage,
    onChangeRowsPerPage,
    resetPagingOnChange,
    updatePagingWithoutChanges,
  };
};
