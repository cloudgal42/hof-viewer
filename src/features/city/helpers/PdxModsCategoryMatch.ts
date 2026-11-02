
// assetCategoryMatches & isRoadAsset are taken from Hall of Fame (HoF) mod.
// HoF mod is licensed under GNU GPLv3, source: https://github.com/toverux/HallOfFame
export const assetCategoryMatches: Record<string, (tags: string[]) => boolean> = {
  buildings: (tags: string[]) => tags.includes("Building"),
  props: (tags: string[]) =>
    tags.includes("Prop") &&
    !tags.includes("Building") &&
    !tags.includes("Vehicle") &&
    !isRoadAsset(tags),
  vehicles: (tags: string[]) => tags.includes("Vehicle"),
  roads: isRoadAsset,
  vegetation: (tags: string[]) =>
    tags.some((tag) =>
      tag == "Tree" || tag == "Plant" || tag == "UIVegetation"
    ),
  surfaces: (tags: string[]) => tags.includes("UISurfaces"),
  creatures: (tags: string[]) =>
    tags.some((tag) =>
      tag == "Creature" || tag == "Wildlife" || tag == "Animal" || tag == "Pet"
    ),
  assetPacks: (tags: string[]) => tags.includes("AssetPack"),
};

export function isRoadAsset(tags: readonly string[]): boolean {
  return (
    tags.some(
      (tag) =>
        tag == "Net" || tag == "Roads" || tag == "Bridge" ||
        tag.startsWith("UIRoads"),
    ) && !tags.includes("UIRoadsParking")
  );
}