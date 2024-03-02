import {auth} from "@clerk/nextjs";
import {db} from "./db";

export const currentUser = async () => {
  const {userId} = auth();

  if (!userId) {
    return null;
  }

  const profile = db.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
