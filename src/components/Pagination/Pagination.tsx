import React, { memo, useEffect, useState } from 'react';
import { Pagination as MuiPagination, Stack } from '@mui/material';

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, total, limit, onChange }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let size: 'small' | 'medium' = 'medium';
  let siblingCount = 1;
  let boundaryCount = 2;

  if (windowWidth < 400) {
    size = 'small';
    siblingCount = 0;
    boundaryCount = 0;
  } else if (windowWidth >= 400 && windowWidth < 700) {
    size = 'medium';
    siblingCount = 0;
    boundaryCount = 1;
  } else {
    size = 'medium';
    siblingCount = 1;
    boundaryCount = 2;
  }

  const pageCount = Math.ceil(total / limit);
  if (pageCount <= 1) return null;

  return (
    <Stack spacing={2} alignItems="center" marginY={2}>
      <MuiPagination
        count={pageCount}
        page={page}
        onChange={(_, value) => onChange(value)}
        color="primary"
        showFirstButton
        showLastButton
        size={size}
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
      />
    </Stack>
  );
};

export default memo(Pagination);
