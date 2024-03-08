import {currentUser, redirectToSignIn} from "@clerk/nextjs";
import {db} from "./db";

function generateRandomName(): string {
  const startCharacter = [
    "Jet",
    "Blaze",
    "Zephyr",
    "Nova",
    "Ember",
    "Frost",
    "Luna",
    "Phoenix",
    "Storm",
    "Shadow",
    "Raven",
    "Sapphire",
    "Vortex",
    "Crimson",
    "Echo",
    "Titan",
    "Mystic",
    "Astral",
    "Spectre",
    "Rogue",
  ];
  const possibleCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const length = 7;
  const startName = Math.floor(Math.random() * startCharacter.length);
  let randomName = `${startCharacter[startName]}-`;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * possibleCharacters.length);
    randomName += possibleCharacters[randomIndex];
  }
  return randomName;
}

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (profile) {
    return profile;
  }

  const fullName =
    user.lastName !== "null"
      ? `${user.firstName} ${user?.lastName}`
      : `${user.firstName}`;

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: fullName,
      imageUrl: user.imageUrl,
      anon_name: generateRandomName(),
      email: user.emailAddresses[0].emailAddress,
    },
  });
  return newProfile;
};
