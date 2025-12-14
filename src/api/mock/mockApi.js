import { getAllLists, addList, removeList } from "./mockDb";

export const getLists = async () => {
  return Promise.resolve(getAllLists());
};

export const createList = async ({ title }) => {
  if (!title || !title.trim()) throw new Error("Title is required");
  return Promise.resolve(addList(title.trim()));
};

export const deleteList = async (id) => {
  removeList(id);
  return Promise.resolve(null);
};

export const getListDetail = async (id) => {
  const lists = getAllLists();
  const found = lists.find((l) => l.id === id);
  if (!found) throw new Error("List not found");
  return Promise.resolve(found);
};
