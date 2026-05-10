import { API } from './api';

export const getVisitors = async () => {
    const res = await API.get('/futsal-visitors');
    return res.data;
};
