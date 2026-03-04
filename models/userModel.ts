export interface User {
  id: number | string;   
  name: string;
  email: string;
  password: string;
  provider?: "local" | "github"; 
  role: "user" | "admin";
}

const database: User[] = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
    provider: "local",
    role: "admin",
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
    provider: "local",
    role: "user",
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
    provider: "local",
    role: "user",
  },
];

const userModel = {
  findOne: (email: string): User => {
    const user = database.find((user) => user.email === email);
    if (user) return user;
    throw new Error(`Couldn't find user with email: ${email}`);
  },

  findById: (id: number | string): User => {   // ✅ 改這裡
    const user = database.find((user) => String(user.id) === String(id));
    if (user) return user;
    throw new Error(`Couldn't find user with id: ${id}`);
  },

  insert: (user: User): User => {
    database.push(user);
    return user;
  },
};

export { database, userModel };