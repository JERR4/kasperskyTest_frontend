import axios from 'axios';
import type {Group} from '../types/types.ts';

const API_URL = 'http://localhost:3000';

export const fetchGroups = async (): Promise<Group[]> => {
    const res = await axios.get<Group[]>(`${API_URL}/groups`);
    return res.data;
};
