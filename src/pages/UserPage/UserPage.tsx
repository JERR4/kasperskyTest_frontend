import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUser, updateUser, deleteUser } from '../../api/users.ts';
import { fetchGroups } from '../../api/groups.ts';
import UserBreadcrumbs from '../../components/UserBreadcrumbs/UserBreadcrumbs.tsx';
import UserFormBase from '../../components/UserFormBase/UserFormBase.tsx';
import type { Group } from '../../types/types.ts';
import { Helmet } from 'react-helmet';
import type { AxiosError } from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import styles from './UserPage.module.css';
import { StatusCodes } from 'http-status-codes';

const UserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [values, setValues] = useState({
    name: '',
    email: '',
    age: '' as number | '',
    groupId: 'none' as number | 'none',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedUser, fetchedGroups] = await Promise.all([
          fetchUser(Number(id)),
          fetchGroups(),
        ]);
        setGroups(fetchedGroups);
        setValues({
          name: fetchedUser.name,
          email: fetchedUser.email,
          age: fetchedUser.age,
          groupId: fetchedUser.group?.id ?? 'none',
        });
      } catch {
        setError('Не удалось загрузить пользователя');
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [id]);

  const handleChange = useCallback(
    (field: keyof typeof values, value: string | number | 'none') => {
      setValues((prev) => ({ ...prev, [field]: value }));
    },
    [setValues],
  );

  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSaving(true);
      try {
        await updateUser(Number(id), {
          name: values.name.trim(),
          email: values.email.trim(),
          age: Number(values.age),
          groupId: values.groupId === 'none' ? undefined : values.groupId,
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        const error = err as AxiosError;
        if (error.response?.status === StatusCodes.CONFLICT) {
          setError('Пользователь с таким email уже существует');
        } else {
          setError('Не удалось сохранить пользователя');
        }
      } finally {
        setSaving(false);
      }
    },
    [id, values],
  );

  const handleDelete = useCallback(async () => {
    try {
      await deleteUser(Number(id));
      navigate('/');
    } catch {
      setError('Не удалось удалить пользователя');
    } finally {
      setDeleteDialogOpen(false);
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Helmet>
        <title>{values.name}</title>
      </Helmet>
      <UserBreadcrumbs userName={values.name} />
      <Box maxWidth={600} mx="auto">
        <Typography className={styles.userHeader} variant="h4" mb={3}>
          Редактирование пользователя
        </Typography>

        <UserFormBase
          values={values}
          groups={groups}
          error={error}
          success={success}
          loading={saving}
          submitLabel="Сохранить"
          onChange={handleChange}
          onSubmit={handleSave}
        />

        <Box mt={2} display="flex" gap={2}>
          <Button variant="outlined" color="error" onClick={() => setDeleteDialogOpen(true)}>
            Удалить
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Назад
          </Button>
        </Box>
      </Box>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Удаление пользователя</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить этого пользователя? Это действие нельзя отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button color="error" onClick={handleDelete}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserPage;
