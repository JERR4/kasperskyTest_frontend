import type { User, UsersResponse } from '../types/types.ts';
import { api } from './axios.ts';

export const fetchUsers = async (
  page = 1,
  limit = 50,
  nameSearch?: string,
  emailSearch?: string,
  sort?: 'name' | 'email' | 'age',
  order?: 'ASC' | 'DESC',
  groupId?: number | string,
): Promise<UsersResponse> => {
  const params: Record<string, string | number> = { page, limit };

  if (nameSearch) params.nameSearch = nameSearch;
  if (emailSearch) params.emailSearch = emailSearch;
  if (sort) params.sort = sort;
  if (order) params.order = order;
  if (groupId) params.groupId = groupId;

  const res = await api.get<UsersResponse>('/users', { params });
  return res.data;
};

export const fetchUser = async (id: number): Promise<User> => {
  const res = await api.get<User>(`/users/${id}`);
  return res.data;
};

export const createUser = async (user: {
  name: string;
  email: string;
  age: number;
  groupId?: number;
}): Promise<User> => {
  const res = await api.post<User>('/users', user);
  return res.data;
};

export const updateUser = async (
  id: number,
  user: { name?: string; email?: string; age?: number; groupId?: number },
): Promise<User> => {
  const res = await api.put<User>(`/users/${id}`, user);
  return res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};
