import { API } from "./authApi";

export type ForumApiData = {
    id: number;
    title: string;
    slug: string;
    content: string;
    category: string;
    user_id: number | null;
    futsal_id: number | null;
    is_locked: boolean;
    is_pinned: boolean;
    views_count: number;
    createdAt: string;
    updatedAt: string;
};

export type ForumResponse = {
    success: boolean;
    message: string;
    data: ForumApiData;
};

export type ForumsResponse = {
    success: boolean;
    message: string;
    data: ForumApiData[];
};

//create forum by authorized user or the futssals
export const createForum = async (payload: { title: string; content: string; category?: string }): Promise<ForumResponse> => {
    const res = await API.post("/forum/create", payload);
    return res.data;
};

// all forum in forum page
export const getAllForums = async (): Promise<ForumsResponse> => {
    const res = await API.get("/forums");
    return res.data;
};

//logegd in user forum
export const getForumsByUserId = async (): Promise<ForumsResponse> => {
    // Using /forum/user0 as provided in the router setup,
    // though it might be a typo for /forum/user in the backend.
    const res = await API.get("/forum/user0");
    return res.data;
};

// logged in futsal forum
export const getForumsByFutsalId = async (): Promise<ForumsResponse> => {
    // Using /forum/futsal0 as provided in the router setup.
    const res = await API.get("/forum/futsal0");
    return res.data;
};

//get forum by category
export const getForumsByCategory = async (category: string): Promise<ForumsResponse> => {
    const res = await API.get("/forum", {
        params: { category },
    });
    return res.data;
};

//fetch single forum by id
export const getForumById = async (forumId: string): Promise<ForumResponse> => {
    const res = await API.get(`/forum/${forumId}`);
    return res.data;
};

// get forum using slug
export const getForumBySlug = async (slug: string): Promise<ForumResponse> => {
    const res = await API.get(`/forum/slug/${slug}`);
    return res.data;
};

// --- REPLIES ---

export type ForumReplyApiData = {
    id: number;
    content: string;
    is_solution: boolean;
    user_id: number | null;
    // Note: The schema requested 'footsal_id' instead of 'futsal_id' based on the backend prompt
    footsal_id: number | null; 
    forum_id: number;
    createdAt?: string;
    updatedAt?: string;
};

export type ForumRepliesResponse = {
    success: boolean;
    message: string;
    data: ForumReplyApiData[];
};

export type ForumReplyResponse = {
    success: boolean;
    message: string;
    data: ForumReplyApiData;
};

export const createForumReply = async (payload: { forumId: number | string; content: string }): Promise<ForumReplyResponse> => {
    const res = await API.post(`/forum/${payload.forumId}/reply/create`, { content: payload.content });
    return res.data;
};

export const getRepliesByForumId = async (forumId: number | string): Promise<ForumRepliesResponse> => {
    const res = await API.get(`/forum/${forumId}/reply`);
    return res.data;
};

export const getRepliesByUserIdOrFutsalId = async (): Promise<ForumRepliesResponse> => {
    const res = await API.get(`/forum-reply`);
    return res.data;
};

// --- LIKES ---

export type ForumLikeApiData = {
    id: number;
    user_id: number | null;
    futsal_id: number | null;
    forum_id: number | null;
    reply_id: number | null;
    createdAt?: string;
    updatedAt?: string;
};

export type ForumLikeResponse = {
    success: boolean;
    message: string;
    data: any; // Could be the specific Like object or just a count/success message depending on backend
};

export const createForumLike = async (forumId: number | string): Promise<ForumLikeResponse> => {
    const res = await API.post(`/forum/${forumId}/create/like`);
    return res.data;
};

export const createReplyLike = async (replyId: number | string): Promise<ForumLikeResponse> => {
    const res = await API.post(`/forum/reply/${replyId}/create/like`);
    return res.data;
};

export const countLikesByForumId = async (forumId: number | string): Promise<{ success: boolean; message: string; data: number }> => {
    const res = await API.get(`/forum/likes/${forumId}`);
    return res.data;
};

export const countLikesByReplyId = async (replyId: number | string): Promise<{ success: boolean; message: string; data: number }> => {
    const res = await API.get(`/forum/reply/likes/${replyId}`);
    return res.data;
};
