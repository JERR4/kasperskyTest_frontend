import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchUsers } from '../../api/users.ts';
import { fetchGroups } from '../../api/groups.ts';
import type { Group, User } from '../../types/types.ts';
import { useDebouncedCallback } from 'use-debounce';
import UserTable from '../../components/UserTable/UserTable.tsx';
import Pagination from '../../components/Pagination/Pagination.tsx';
import styles from './UsersList.module.css';
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

import UserForm from '../../components/UserForm/UserForm.tsx';
import { Helmet } from 'react-helmet';

const UsersList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useWindowWidth() < 640;

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [limit] = useState(50);

  const [groups, setGroups] = useState<Group[]>([]);

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [nameSearch, setNameSearch] = useState(searchParams.get('name') || '');
  const [emailSearch, setEmailSearch] = useState(searchParams.get('email') || '');
  const [nameInput, setNameInput] = useState(searchParams.get('name') || '');
  const [emailInput, setEmailInput] = useState(searchParams.get('email') || '');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'age'>(
    (searchParams.get('sortBy') as 'name' | 'email' | 'age') || 'name',
  );
  const [order, setOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('order') as 'asc' | 'desc') || 'asc',
  );
  const [selectedGroupId, setSelectedGroupId] = useState<string | number>(
    searchParams.get('group') || -1,
  );

  useEffect(() => {
    const params: Record<string, string> = {};
    if (page > 1) params.page = String(page);
    if (nameSearch) params.name = nameSearch;
    if (emailSearch) params.email = emailSearch;
    if (sortBy !== 'name') params.sortBy = sortBy;
    if (order !== 'asc') params.order = order;
    if (selectedGroupId !== -1) {
      params.group = String(selectedGroupId);
    }
    setSearchParams(params, { replace: true });
  }, [page, nameSearch, emailSearch, sortBy, order, selectedGroupId]);

  useEffect(() => {
    setPage(Number(searchParams.get('page')) || 1);
    setNameSearch(searchParams.get('name') || '');
    setEmailSearch(searchParams.get('email') || '');
    setNameInput(searchParams.get('name') || '');
    setEmailInput(searchParams.get('email') || '');
    setSortBy((searchParams.get('sortBy') as 'name' | 'email' | 'age') || 'name');
    setOrder((searchParams.get('order') as 'asc' | 'desc') || 'asc');
    setSelectedGroupId(
      searchParams.get('group') === 'none'
        ? 'none'
        : searchParams.get('group')
          ? Number(searchParams.get('group'))
          : -1,
    );
  }, [searchParams]);

  function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return width;
  }

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const allGroups = await fetchGroups();
        setGroups(allGroups);
      } catch {
        toast.error('Не удалось получить группы');
      }
    };

    void loadGroups();
  }, []);

  const loadUsers = async () => {
    setLoading(true);

    try {
      const res = await fetchUsers(
        page,
        limit,
        nameSearch,
        emailSearch,
        sortBy,
        order.toUpperCase() as 'ASC' | 'DESC',
        selectedGroupId === -1 ? undefined : selectedGroupId,
      );
      setUsers(res.data);
      setTotal(res.total);
    } catch {
      toast.error('Не удалось получить список пользователей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, [page, nameSearch, emailSearch, sortBy, order, selectedGroupId, limit]);

  const debouncedSetNameSearch = useDebouncedCallback((value: string) => {
    setNameSearch(value);
  }, 500);

  const debouncedSetEmailSearch = useDebouncedCallback((value: string) => {
    setEmailSearch(value);
  }, 500);

  const handleSort = useCallback(
    (field: 'name' | 'email' | 'age') => {
      if (sortBy === field) {
        setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(field);
        setOrder('asc');
      }
    },
    [sortBy],
  );

  const handleUserCreated = useCallback(() => {
    void loadUsers();
  }, [page, limit, nameSearch, emailSearch, sortBy, order, selectedGroupId]);

  return (
    <Box className={styles.outerBox}>
      <Helmet>
        <title>Список сотрудников</title>
      </Helmet>
      <Box className={styles.userFormBox}>
        <UserForm groups={groups} onUserCreated={handleUserCreated} />
      </Box>
      <Box className={styles.usersContent}>
        <Typography variant="h5" mb={2}>
          Список сотрудников
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} boxSizing={'border-box'} spacing={2} mb={2}>
          <TextField
            label="Искать по имени"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              debouncedSetNameSearch(e.target.value);
            }}
          />
          <TextField
            label="Искать по Email"
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e.target.value);
              debouncedSetEmailSearch(e.target.value);
            }}
          />
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Группа</InputLabel>
            <Select
              value={selectedGroupId}
              label="Группа"
              onChange={(e) => setSelectedGroupId(e.target.value as number)}
            >
              <MenuItem value={-1}>Любая</MenuItem>
              <MenuItem value="none">Без группы</MenuItem>
              {groups.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {users.length > 0 ? (
          isMobile ? (
            <Stack spacing={2}>
              {users.map((u) => (
                <Box key={u.id} p={2} border="1px solid #ccc" borderRadius={2}>
                  <div>
                    <strong>Имя: </strong>
                    {u.name}
                  </div>
                  <div style={{ overflowWrap: 'anywhere', wordBreak: 'normal' }}>
                    <strong>Email: </strong>
                    {u.email}
                  </div>
                  <div>
                    <strong>Возраст: </strong>
                    {u.age}
                  </div>
                  <div>
                    <strong>Группа: </strong>
                    {u.group?.name || '-'}
                  </div>
                </Box>
              ))}
            </Stack>
          ) : (
            <UserTable
              users={users}
              sortBy={sortBy}
              order={order}
              onSort={handleSort}
              onRowClick={(user) => navigate(`/users/${user.id}`)}
            />
          )
        ) : (
          <Box
            flex={1}
            fontSize={18}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            gap={2}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <Box
                  component="img"
                  src="/not-found.jpg"
                  alt="Not Found"
                  sx={{ width: 150, height: 'auto', opacity: 0.8 }}
                />
                Пользователи не найдены
              </>
            )}
          </Box>
        )}

        <ToastContainer position="bottom-right" />
        <Pagination page={page} total={total} limit={limit} onChange={setPage} />
      </Box>
    </Box>
  );
};

export default UsersList;
