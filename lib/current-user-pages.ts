import {getAuth} from "@clerk/nextjs/server";
import {NextApiRequest} from "next";
import {db} from "./db";

export const currentUserPages = async (req: NextApiRequest) => {
  const {userId} = getAuth(req);

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
