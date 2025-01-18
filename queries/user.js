import User from "@/models/User";

export async function createUser(user) {
  try {
    await User.create(user);
    return { success: true };
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("A user with this email already exists.");
    }
    throw error;
  }
}
