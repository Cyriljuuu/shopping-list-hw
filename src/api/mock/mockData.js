import { lists as initialLists } from "../../data";

export const mockLists = initialLists.map((l) => ({
  id: l.id,
  name: l.title ?? l.name ?? "",
  ownerId: l.ownerId,
  archived: l.status ? l.status === "archived" : !!l.archived,
  items: Array.isArray(l.items) ? l.items : [],
  members: Array.isArray(l.members)
    ? l.members.map((m) => ({
        userId: m.userId ?? m.id,
        role: m.role ?? "member",
      }))
    : [],
}));
