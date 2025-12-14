import { request } from "./client";

export const getLists = async () => request("/lists");

export const createList = async (payload) =>
  request("/lists", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const deleteList = async (id) =>
  request(`/lists/${id}`, {
    method: "DELETE",
  });

export const getListDetail = async (id) => request(`/lists/${id}`);
