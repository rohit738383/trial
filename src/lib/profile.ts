import { UserProfile, Child } from "@prisma/client";

export function calculateProfileCompletion(
  profile: UserProfile | null | undefined,
  children: Child[] = []
) {
  let filledFields = 0;

  const profileFields = [
    "address",
    "city",
    "state",
    "zipCode",
    "highestEducation",
    "relationToChild",
    "counterpartnerName",      
    "counterpartnerPhoneNumber", 
    "counterpartnerEducation",   
  ] as const;

  // Parent fields
  const parentFieldValues = profileFields.map((field) => profile?.[field] ?? "");
  filledFields += parentFieldValues.filter((v) => String(v).trim() !== "").length;

  // Children fields
  let childFields: { name: string; value: string; childIndex: number }[] = [];
  children.forEach((child, idx) => {
    childFields.push({ name: `child_${idx}_name`, value: child.name, childIndex: idx });
    childFields.push({ name: `child_${idx}_age`, value: String(child.age ?? ""), childIndex: idx });
    childFields.push({ name: `child_${idx}_gender`, value: child.gender, childIndex: idx });
    childFields.push({ name: `child_${idx}_className`, value: child.className, childIndex: idx });
  });
  filledFields += childFields.filter((f) => String(f.value ?? "").trim() !== "").length;

  let totalFields = profileFields.length + childFields.length;
  let missingFields = [
    ...profileFields.filter((field) => !profile?.[field] || String(profile?.[field]).trim() === ""),
    ...childFields.filter((field) => !String(field.value ?? "").trim()).map((field) => field.name),
  ];

  // If no children, require at least one child (4 fields)
  if (children.length === 0) {
    totalFields += 4;
    missingFields.push("at_least_one_child");
  }

  const percentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

  return {
    percentage,
    missingFields,
  };
}

