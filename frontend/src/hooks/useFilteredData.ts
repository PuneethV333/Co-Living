import { useMemo } from "react";
import type { PropertyType, RoomType } from "../types/property.types";
import type { Filters } from "../types/filters.types";



export const useFilteredProperties = (
    properties: PropertyType[] | undefined,
    filters: Filters,
) =>
    useMemo(() => {
        if (!properties) return [];

        let result = [...properties];


        if (filters.city) {
            result = result.filter((p) =>
                p.location.city.toLowerCase() === filters.city.toLowerCase(),
            );
        }


        if (filters.propertyTypes.length > 0) {
            result = result.filter((p) =>
                filters.propertyTypes.includes(p.propertyType),
            );
        }


        if (filters.amenities.length > 0) {
            result = result.filter((p) =>
                filters.amenities.every((a) => p.amenities.includes(a)),
            );
        }


        switch (filters.sort) {
            case "price_low":
                result.sort((a, b) => a.rating - b.rating);
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
            default:
                result.sort((a, b) => Number(b.verified) - Number(a.verified) || b.rating - a.rating);
        }

        return result;
    }, [properties, filters]);


export const useFilteredRooms = (
    rooms: RoomType[] | undefined,
    filters: Filters,
) =>
    useMemo(() => {
        if (!rooms) return [];

        let result = [...rooms];


        if (filters.roomType !== "all") {
            result = result.filter(
                (r) => r.roomDetails.roomType === filters.roomType,
            );
        }


        result = result.filter(
            (r) => r.pricing.monthlyRent <= filters.maxBudget,
        );


        if (filters.amenities.length > 0) {
            result = result.filter((r) =>
                filters.amenities.every((a) => r.amenities.includes(a)),
            );
        }


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
            default:
                result.sort((a, b) => {
                    const aFull = a.availability.currentOccupants >= a.roomDetails.capacity;
                    const bFull = b.availability.currentOccupants >= b.roomDetails.capacity;
                    if (aFull !== bFull) return Number(aFull) - Number(bFull);
                    return a.pricing.monthlyRent - b.pricing.monthlyRent;
                });
        }

        return result;
    }, [rooms, filters]);