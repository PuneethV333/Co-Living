/* eslint-disable react-hooks/exhaustive-deps */
import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";
import type { Filters, RoomTypeFilter, SortOption } from "../types/filters.types";


const DEFAULTS: Filters = {
    city: "Bengaluru",
    roomType: "all",
    propertyTypes: [],
    maxBudget: 80000,
    amenities: [],
    gender: "Any",
    sort: "recommended",
    roomSort: "price_low",
};

const parseList = (val: string | null): string[] =>
    val ? val.split(",").filter(Boolean) : [];

export const useFilters = () => {
    const [params, setParams] = useSearchParams();

    const filters: Filters = {
        city: params.get("city") ?? DEFAULTS.city,
        roomType: (params.get("roomType") ?? DEFAULTS.roomType) as RoomTypeFilter,
        propertyTypes: parseList(params.get("propertyTypes")),
        maxBudget: Number(params.get("maxBudget") ?? DEFAULTS.maxBudget),
        amenities: parseList(params.get("amenities")),
        gender: params.get("gender") ?? DEFAULTS.gender,
        sort: (params.get("sort") ?? DEFAULTS.sort) as SortOption,
        roomSort: (params.get("roomSort") ?? DEFAULTS.roomSort) as SortOption,
    };

    const setFilter = useCallback(
        <K extends keyof Filters>(key: K, value: Filters[K]) => {
            setParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    if (Array.isArray(value)) {
                        if (value.length === 0) next.delete(key);
                        else next.set(key, (value as string[]).join(","));
                    } else if (value === DEFAULTS[key]) {
                        next.delete(key);
                    } else {
                        next.set(key, String(value));
                    }
                    return next;
                },
                { replace: true },
            );
        },
        [setParams],
    );

    const resetFilters = useCallback(() => setParams({}, { replace: true }), [setParams]);

    const toggleList = useCallback(
        (key: "propertyTypes" | "amenities", val: string) => {
            const current = filters[key];
            const next = current.includes(val)
                ? current.filter((x) => x !== val)
                : [...current, val];
            setFilter(key, next);
        },
        [filters, setFilter],
    );

    return { filters, setFilter, resetFilters, toggleList };
};