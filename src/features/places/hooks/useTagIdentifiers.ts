import { useMemo } from "react";
import { useTags } from "./useTags";

export const useTagIdentifiers = () => {
  const { filterOptions } = useTags();

  const tagIdToIdentifier = useMemo(() => {
    return filterOptions.reduce((acc, tag) => {
      acc[tag.id] = tag.identifier;
      return acc;
    }, {} as Record<string, string>);
  }, [filterOptions]);

  const getTagIdentifier = (tagId: string) => tagIdToIdentifier[tagId] || tagId;

  return { tagIdToIdentifier, getTagIdentifier };
};
