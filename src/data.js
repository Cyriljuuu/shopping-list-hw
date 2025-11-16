export const lists = [
    {
        id: "1",
        title: "Nakup na vikend",
        status: "active",
        ownerId: "user1",
        members: [
            { id: "user1", name: "Jan Novak", role: "owner" },
            { id: "user2", name: "Petra Svobodova", role: "member" }
        ],
        items: [
            { id: "i1", name: "Mleko", resolved: true },
            { id: "i2", name: "Chleb", resolved: false },
            { id: "i3", name: "Vejce", resolved: false }
        ]
    },
    {
        id: "2",
        title: "Nakup IKEA",
        status: "archived",
        ownerId: "user1",
        members: [
            { id: "user1", name: "Jan Novak", role: "owner" },
            { id: "user3", name: "Pavel Dvorak", role: "member" }
        ],
        items: [
            { id: "i1", name: "Stul", resolved: false }
        ]
    }
];
