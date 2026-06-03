import { Notification } from "../models/notification.models";
import { User } from "../models/user.models";
import {
    createNotificationType,
    replyToMessageType,
} from "../types/user/notification.types";

const ACTIONABLE_TYPES = [
    "VISIT_REQUEST",
    "MESSAGE",
] as const;

export const createNotificationService = async (
    props: createNotificationType
) => {
    const [sender, receiver] = await Promise.all([
        User.exists({ _id: props.senderId }),
        User.exists({ _id: props.receiverId }),
    ]);

    if (!sender) {
        throw new Error("Unauthorized");
    }

    if (!receiver) {
        throw new Error("Receiver not found");
    }

    await Notification.create({
        senderId: props.senderId,
        receiverId: props.receiverId,
        type: props.type,
        requiresAction: ACTIONABLE_TYPES.includes(
            props.type as (typeof ACTIONABLE_TYPES)[number]
        ),
    });

    return true;
};

export const getNotificationService = async (
    firebaseUid: string
) => {
    const user = await User.findOne({
        firebaseUid,
    })
        .select("_id")
        .lean();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const notifications = await Notification.find({
        receiverId: user._id,
        sent: false,
    })
        .sort({ createdAt: -1 })
        .populate(
            "senderId",
            "name phoneNumber profilePic"
        );

    if (notifications.length > 0) {
        await Notification.updateMany(
            {
                _id: {
                    $in: notifications.map((n) => n._id),
                },
            },
            {
                $set: {
                    sent: true,
                },
            }
        );
    }

    return notifications;
};

export const getAllNotificationService = async (
    firebaseUid: string
) => {
    const user = await User.findOne({
        firebaseUid,
    })
        .select("_id")
        .lean();

    if (!user) {
        throw new Error("Unauthorized");
    }

    return Notification.find({
        receiverId: user._id,
    })
        .sort({ createdAt: -1 })
        .populate(
            "senderId",
            "name phoneNumber profilePic"
        );
};

export const getNotRepliedMessageService = async (
    firebaseUid: string
) => {
    const user = await User.findOne({
        firebaseUid,
    })
        .select("_id")
        .lean();

    if (!user) {
        throw new Error("Unauthorized");
    }

    return Notification.find({
        receiverId: user._id,
        requiresAction: true,
        replied: false,
    })
        .sort({ createdAt: -1 })
        .populate(
            "senderId",
            "name phoneNumber profilePic"
        );
};

export const replyToMessageService = async (
    props: replyToMessageType
) => {
    const user = await User.findOne({
        firebaseUid: props.firebaseUid,
    })
        .select("_id")
        .lean();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const originalNotification =
        await Notification.findOne({
            _id: props.messageId,
            receiverId: user._id,
            requiresAction: true,
            replied: false,
        });

    if (!originalNotification) {
        throw new Error(
            "Notification not found or already handled"
        );
    }

    const createdNotification =
        await Notification.create({
            senderId: user._id,
            receiverId: props.toId,
            type: props.type,
            requiresAction: false,
            replied: false,
            sent: false,
        });

    await Notification.findByIdAndUpdate(
        props.messageId,
        {
            replied: true,
        }
    );

    return createdNotification;
};