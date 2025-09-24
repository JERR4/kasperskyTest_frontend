import React from 'react';
import { Pagination as MuiPagination, Stack } from '@mui/material';

interface PaginationProps {
    page: number;
    total: number;
    limit: number;
    onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, total, limit, onChange }) => {
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
            />
        </Stack>
    );
};

export default Pagination;
