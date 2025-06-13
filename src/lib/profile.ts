import { UserProfile, Child } from "@prisma/client";

export function calculateProfileCompletion(
  profile: UserProfile | null | undefined,
  children: Child[] = []
) {
  let filledFields = 0;
  const totalFields = 7;

  const profileFields = [
    "address",
    "city",
    "state",
    "zipCode",
    "highestEducation",
    "areaOfInterest",
    "relationToChild",
  ] as const;

  if (profile) {
    profileFields.forEach((field) => {
      const value = profile[field];
      if (value !== null && value !== undefined && String(value).trim() !== "") {
        filledFields++;
      }
    });
  }

  //  Count only if BOTH name AND className are filled
  const hasValidChild = children.some((child) => {
    return (
      child.name?.trim() !== "" &&
      child.className?.trim() !== ""
    );
  });

  const profileScore = (filledFields / totalFields) * 70;
  const childrenScore = hasValidChild ? 30 : 0;

  const percentage = Math.round(profileScore + childrenScore);

  const missingFields = profileFields.filter((field) => {
    const value = profile?.[field];
    return !value || String(value).trim() === "";
  });

  return {
    percentage,
    missingFields,
  };
}

