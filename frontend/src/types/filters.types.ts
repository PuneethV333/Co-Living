export type SortOption =
  | "recommended"
  | "price_low"
  | "price_high"
  | "newest"
  | "top_rated";

export type RoomTypeFilter = "all" | "shared" | "private";

export interface Filters {
  city: string;
  roomType: RoomTypeFilter;
  propertyTypes: string[];
  maxBudget: number;
  amenities: string[];
  gender: string;
  sort: SortOption;
  roomSort: SortOption;
}
