import axios from 'axios';
import type {User, UsersResponse} from '../types/types.ts';

const API_URL = 'http://localhost:3000';

export const fetchUsers = async (
    page = 1,
    limit = 50,
    nameSearch?: string,
    emailSearch?: string,
    sort?: 'name' | 'email' | 'age',
    order?: 'ASC' | 'DESC',
    groupId?: number
): Promise<UsersResponse> => {
    const params: Record<string, string | number> = { page, limit };

    if (nameSearch) params.nameSearch = nameSearch;
    if (emailSearch) params.emailSearch = emailSearch;
    if (sort) params.sort = sort;
    if (order) params.order = order;
    if (groupId) params.groupId = groupId;

    const res = await axios.get<UsersResponse>(`${API_URL}/users`, { params });
    return res.data;
};


export const fetchUser = async (id: number): Promise<User> => {
    const res = await axios.get<User>(`${API_URL}/users/${id}`);
    return res.data;
};


export const createUser = async (user: {
    name: string;
    email: string;
    age: number;
    groupId?: number;
}): Promise<User> => {
    const res = await axios.post<User>(`${API_URL}/users`, user);
    return res.data;
};

export const updateUser = async (id: number, user: {
    name?: string;
    email?: string;
    age?: number;
    groupId?: number;
}): Promise<User> => {
    const res = await axios.put<User>(`${API_URL}/users/${id}`, user);
    return res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/users/${id}`);
};
