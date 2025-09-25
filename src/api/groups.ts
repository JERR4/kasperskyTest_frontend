import type { Group } from '../types/types.ts';
import { api } from './axios.ts';

export const fetchGroups = async (): Promise<Group[]> => {
  const res = await api.get<Group[]>('/groups');
  return res.data;
};
