export interface Group {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    age: number;
    group?: Group;
}

export interface UsersResponse {
    data: User[];
    total: number;
    page: number;
    limit: number;
}
