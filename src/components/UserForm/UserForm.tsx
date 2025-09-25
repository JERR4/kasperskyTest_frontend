import React, { useState } from 'react';
import UserFormBase from '../UserFormBase/UserFormBase.tsx';
import type { Group } from '../../types/types.ts';
import { createUser } from '../../api/users.ts';
import type { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';

type Props = {
  groups: Group[];
  onUserCreated: () => void;
};

const UserForm: React.FC<Props> = ({ groups, onUserCreated }) => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    age: '' as number | '',
    groupId: 'none' as number | 'none',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof typeof values, value: string | number | 'none') => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!values.name || !values.email || !values.age) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setLoading(true);
    try {
      await createUser({
        name: values.name.trim(),
        email: values.email.trim(),
        age: Number(values.age),
        groupId: values.groupId === 'none' ? undefined : values.groupId,
      });
      setValues({ name: '', email: '', age: '', groupId: 'none' });
      setSuccess(true);
      onUserCreated();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === StatusCodes.CONFLICT) {
        setError('Пользователь с таким email уже существует');
      } else {
        setError('Не удалось создать пользователя');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserFormBase
      values={values}
      groups={groups}
      error={error}
      success={success}
      loading={loading}
      submitLabel="Создать"
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};

export default UserForm;
