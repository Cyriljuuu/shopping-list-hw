import { lists as initialLists, CURRENT_USER_ID } from "../../data";

let lists = structuredClone(initialLists);

export function getAllLists() {
  return structuredClone(lists);
}

export function addList(title) {
  const newList = {
    id: String(Date.now()),
    title,
    status: "active",
    ownerId: CURRENT_USER_ID,
    items: [],
    members: [{ id: CURRENT_USER_ID, name: "Jan Novák", role: "owner" }],
  };
  lists = [...lists, newList];
  return structuredClone(newList);
}

export function removeList(id) {
  lists = lists.filter((l) => l.id !== id);
}
