import { useMemo } from "react";
import type { PropertyType, RoomType } from "../types/property.types";
import type { Filters } from "../types/filters.types";


// ── Property filtering + sorting ──────────────────────────────────────────────
export const useFilteredProperties = (
  properties: PropertyType[] | undefined,
  filters: Filters,
) =>
  useMemo(() => {
    if (!properties) return [];

    let result = [...properties];

    // City
    if (filters.city) {
      result = result.filter((p) =>
        p.location.city.toLowerCase() === filters.city.toLowerCase(),
      );
    }

    // Property types
    if (filters.propertyTypes.length > 0) {
      result = result.filter((p) =>
        filters.propertyTypes.includes(p.propertyType),
      );
    }

    // Amenities — property must have ALL selected amenities
    if (filters.amenities.length > 0) {
      result = result.filter((p) =>
        filters.amenities.every((a) => p.amenities.includes(a)),
      );
    }

    // Sort
    switch (filters.sort) {
      case "price_low":
        result.sort((a, b) => a.rating - b.rating); // no price on property, use rating asc
        break;
      case "price_high":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "top_rated":
        result.sort((a, b) => b.rating - a.rating || b.totalReviews - a.totalReviews);
        break;
      case "newest":
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      default: // recommended — verified first, then rating
        result.sort((a, b) => Number(b.verified) - Number(a.verified) || b.rating - a.rating);
    }

    return result;
  }, [properties, filters]);

// ── Room filtering + sorting ──────────────────────────────────────────────────
export const useFilteredRooms = (
  rooms: RoomType[] | undefined,
  filters: Filters,
) =>
  useMemo(() => {
    if (!rooms) return [];

    let result = [...rooms];

    // Room type
    if (filters.roomType !== "all") {
      result = result.filter(
        (r) => r.roomDetails.roomType === filters.roomType,
      );
    }

    // Max budget
    result = result.filter(
      (r) => r.pricing.monthlyRent <= filters.maxBudget,
    );

    // Amenities — room must have ALL selected amenities
    if (filters.amenities.length > 0) {
      result = result.filter((r) =>
        filters.amenities.every((a) => r.amenities.includes(a)),
      );
    }

    // Sort
    switch (filters.roomSort) {
      case "price_low":
        result.sort((a, b) => a.pricing.monthlyRent - b.pricing.monthlyRent);
        break;
      case "price_high":
        result.sort((a, b) => b.pricing.monthlyRent - a.pricing.monthlyRent);
        break;
      case "newest":
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      default: // recommended / top_rated — available first, then by price
        result.sort((a, b) => {
          const aFull = a.availability.currentOccupants >= a.roomDetails.capacity;
          const bFull = b.availability.currentOccupants >= b.roomDetails.capacity;
          if (aFull !== bFull) return Number(aFull) - Number(bFull);
          return a.pricing.monthlyRent - b.pricing.monthlyRent;
        });
    }

    return result;
  }, [rooms, filters]);