import React, { memo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from '@mui/material';
import type { User } from '../../types/types.ts';

interface UserTableProps {
  users: User[];
  sortBy?: 'name' | 'email' | 'age';
  order?: 'asc' | 'desc';
  onSort?: (field: 'name' | 'email' | 'age') => void;
  onRowClick?: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  sortBy,
  order = 'asc',
  onSort,
  onRowClick,
}) => {
  const handleSort = useCallback(
    (field: 'name' | 'email' | 'age') => {
      onSort?.(field);
    },
    [onSort],
  );

  const handleRowClick = useCallback((user: User) => () => onRowClick?.(user), [onRowClick]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'name'}
                direction={sortBy === 'name' ? order : 'asc'}
                onClick={() => handleSort('name')}
              >
                Имя
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'email'}
                direction={sortBy === 'email' ? order : 'asc'}
                onClick={() => handleSort('email')}
              >
                Email
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'age'}
                direction={sortBy === 'age' ? order : 'asc'}
                onClick={() => handleSort('age')}
              >
                Возраст
              </TableSortLabel>
            </TableCell>
            <TableCell>Группа</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              hover
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              onClick={handleRowClick(user)}
            >
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.age}</TableCell>
              <TableCell>{user.group?.name || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default memo(UserTable);
