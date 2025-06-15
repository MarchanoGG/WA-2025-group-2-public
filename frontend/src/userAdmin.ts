export type Role = "Mentor" | "Decaan" | "Admin"

export type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  initials: string
  roles: Role[]
}

export const dummyUsers: User[] = [
  {
    id: 1,
    firstName: "Chris",
    lastName: "Dina",
    email: "chris.dina@school.nl",
    initials: "C.D.",
    roles: ["Mentor"],
  },
  {
    id: 2,
    firstName: "Marciano",
    lastName: "Hardoar",
    email: "marciano@school.nl",
    initials: "M.H.",
    roles: ["Mentor", "Admin"],
  },
  {
    id: 3,
    firstName: "Henk",
    lastName: "Piet",
    email: "henk.piet@school.nl",
    initials: "H.P.",
    roles: ["Decaan"],
  },
  {
    id: 4,
    firstName: "Lisa",
    lastName: "Bakker",
    email: "lisa.bakker@school.nl",
    initials: "L.B.",
    roles: ["Mentor"],
  },
  {
    id: 5,
    firstName: "Tom",
    lastName: "Jansen",
    email: "tom.jansen@school.nl",
    initials: "T.J.",
    roles: ["Mentor"],
  },
  {
    id: 6,
    firstName: "Eva",
    lastName: "de Vries",
    email: "eva.devries@school.nl",
    initials: "E.d.V.",
    roles: ["Decaan"],
  },
  {
    id: 7,
    firstName: "Noah",
    lastName: "Smits",
    email: "noah.smits@school.nl",
    initials: "N.S.",
    roles: ["Mentor", "Admin"],
  },
  {
    id: 8,
    firstName: "Mila",
    lastName: "de Boer",
    email: "mila.deboer@school.nl",
    initials: "M.d.B.",
    roles: ["Mentor"],
  },
  {
    id: 9,
    firstName: "Daan",
    lastName: "Willems",
    email: "daan.willems@school.nl",
    initials: "D.W.",
    roles: ["Decaan"],
  },
  {
    id: 10,
    firstName: "Sofie",
    lastName: "Peeters",
    email: "sofie.peeters@school.nl",
    initials: "S.P.",
    roles: ["Mentor"],
  },
]
