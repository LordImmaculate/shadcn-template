import type { Session } from "next-auth";

export const checkAuth = (session: Session | null) => {
  if (!session || !session.user) {
    return false;
  }
  return true;
};

export const checkAuthAdmin = (session: Session | null) => {
  if (!session || !session.user || session.user.role !== "ADMIN") {
    return false;
  }
  return true;
};
