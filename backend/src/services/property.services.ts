import { qdrantClient } from "../config/qdrant.config";
import { nameSpace } from "../constants/nameSpace";
import { Property } from "../models/property.models"
import { User } from "../models/user.models"
import { createPropertyType } from "../types/property/property.types";
import { clearCache, getVal, setValKey } from "../utils/redis.utils"
import { getEmbeddingServices } from "./ai.services";
import { v5 as uuidv5 } from "uuid";

export const getPropertyDataService = async (
    firebaseUid: string
) => {

    const user = await User.exists({
        firebaseUid,
    });

    if (!user) {
        throw new Error("unauthorized");
    }

    const cacheKey = "properties:active";

    const cached = await getVal(cacheKey);

    if (cached) {
        return {
            data: JSON.parse(cached),
            source: "redis",
        };
    }



    const data = await Property.find({
        isActive: true,
    })
        .populate("ownerId", "name phoneNumber verified")
        .lean();

    await setValKey(
        cacheKey,
        JSON.stringify(data)
    );

    return {
        data,
        source: "db",
    };
};

export const getPropertyDetailService = async (firebaseUid: string, propertyId: string) => {
    const user = await User.exists({ firebaseUid });

    if (!user) {
        throw new Error("Unauthorized")
    }


    const cacheKey = `property:${propertyId}:${firebaseUid}`
    const cached = await getVal(cacheKey);
    if (cached) {
        return { data: JSON.parse(cached), source: "redis" }
    }

    const data = await Property.findOne({ _id: propertyId }).populate("ownerId", "name phoneNumber verified").lean()

    await setValKey(cacheKey, JSON.stringify(data))
    return { data, source: "db" }
}

export const createPropertyService = async (firebaseUid: string, prop: createPropertyType) => {
    const user = await User.findOne({
        firebaseUid
    }).select("_id role")

    if (!user) {
        throw new Error("Unauthorized")
    }

    if (user.role === "Tenant") {
        throw new Error("Unauthorized,tenants cant create property for role")
    }

    const property = await Property.create({
        ownerId: user._id,
        name: prop.name,
        description: prop.description,
        location: {
            address: prop.address,
            city: prop.city,
            state: prop.state,
            zipCode: prop.zipCode,
            coordinates: {
                lat: prop.lat,
                lng: prop.lng,
            }
        },
        propertyType: prop.propertyType,
        cost: prop.cost,
        totalRooms: prop.totalRooms,
        totalBedRooms: prop.totalBedRooms,
        totalBathrooms: prop.totalBathrooms,
        builtUpArea: prop.builtUpArea,
        amenities: prop.amenities,
        rules: prop.rules,
        photos: prop.photos
    })

    await property.populate("ownerId", "name verified phoneNumber")

    const searchText = `
${property.name}
${property.description}
${property.propertyType}
${property.location.address}
${property.location.city}
${property.location.state}
${property.location.zipCode}

Rent ${property.cost}
Built up area ${property.builtUpArea}

${property.totalRooms} rooms
${property.totalBedRooms} bedrooms
${property.totalBathrooms} bathrooms

Amenities:
${property.amenities.join(" ")}

Rules:
${property.rules.join(" ")}
`;

    const embedding = await getEmbeddingServices(searchText);
    const pointId = uuidv5(property._id.toString(), nameSpace);

    await qdrantClient.upsert("properties", {
        points: [
            {
                id: pointId,
                vector: embedding,
                payload: {
                    propertyId: property._id.toString(),
                    city: property.location.city,
                    state: property.location.state,
                    lat: property.location.coordinates.lat,
                    lng: property.location.coordinates.lng,
                    propertyType: property.propertyType,
                    cost: property.cost,
                },
            }
        ]
    })

    await clearCache('properties:active')
    return property;
};

export const searchPropertyService = async (
    firebaseUid: string,
    searchQuery: string
) => {
    const user = await User.exists({ firebaseUid });

    if (!user) {
        throw new Error("Unauthorized");
    }

    const embedding = await getEmbeddingServices(searchQuery);

    const results = await qdrantClient.search("properties", {
        vector: embedding,
        limit: 20,
    });

    const propertyIds = results
        .map(r => r.payload?.propertyId)
        .filter((id): id is string => typeof id === "string");

    if (propertyIds.length === 0) {
        return [];
    }

    const properties = await Property.find({
        _id: { $in: propertyIds },
        isActive: true,
    })
        .populate("ownerId", "name profilePic")
        .lean();

    const propertyMap = new Map(
        properties.map(p => [p._id.toString(), p])
    );

    return propertyIds
        .map(id => propertyMap.get(id))
        .filter(
            (property): property is typeof properties[number] =>
                property !== undefined
        );
};

export const getMyPropertiesService = async (firebaseUid: string) => {
    const user = await User.exists({ firebaseUid, role: "Owner" })

    if (!user) {
        throw new Error("unauthorized")
    }

    const cacheKey = `my-properties:${firebaseUid}`

    const cached = await getVal(cacheKey)
    
    if(cached){
        return {data:JSON.parse(cached),source:"redis"}
    }

    const properties = await Property.find({
        ownerId: user._id
    }).populate("ownerId", "name phoneNumber verified")
        .lean();

    await setValKey(cacheKey,JSON.stringify(properties))

    return {data:properties,source:"db"}
}