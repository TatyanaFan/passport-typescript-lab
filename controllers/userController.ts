import { userModel, type User } from "../models/userModel";

const getUserByEmailIdAndPassword = (
  email: string,
  password: string
): { user: User | null; errorMessage?: string } => {
  try {
    const user = userModel.findOne(email);
    return isUserValid(user, password)
      ? { user }
      : { user: null, errorMessage: "Your login details are not valid. Please try again" };
  } catch (err) {
    return {
      user: null,
      errorMessage: err instanceof Error ? err.message : "Login failed",
    };
  }
};

const getUserById = (id: number | string): User | null => {
  try {
    return userModel.findById(id);
  } catch {
    return null;
  }
};

const upsertGithubUser = (githubId: string, name: string, email?: string): User => {
  const existing = getUserById(githubId);
  if (existing) return existing;

 const newUser: User = {
  id: githubId,
  name,
  email: email ?? "",
  password: "",
  role: "user", 
};

  userModel.insert(newUser);
  return newUser;
};

function isUserValid(user: User, password: string): boolean {
  return user.password === password;
}

export {
  getUserByEmailIdAndPassword,
  getUserById,
  upsertGithubUser,
};