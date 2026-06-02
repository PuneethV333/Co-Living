import { Notification } from "../models/notification.models";
import { User } from "../models/user.models";
import { createNotificationType } from "../types/user/notification.types";

export const createNotificationService = async (
    props: createNotificationType,
) => {
    const [sender, receiver] = await Promise.all([
        User.exists({ _id: props.senderId }),
        User.exists({ _id: props.receiverId }),
    ]);

    if (!sender) {
        throw new Error("unauthorized");
    }
    if (!receiver) {
        throw new Error("receiver not found");
    }

    await Notification.create({
        senderId: props.senderId,
        receiverId: props.receiverId,
        type: props.type,
    });
    return true;
};

export const getNotificationService = async (firebaseUid: string) => {
    const user = await User.findOne({ firebaseUid }).select("_id").lean();

    if (!user) {
        throw new Error("unauthorized");
    }

    const notifications = await Notification.find({
        receiverId: user._id,
        sent: false,
    }).sort({ createdAt: -1 }).populate("senderId", "name phoneNumber profilePic");

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
            },
        );
    }


    return notifications;
};

export const getAllNotificationService = async (firebaseUid: string) => {
    const user = await User.findOne({ firebaseUid }).select("_id").lean();

    if (!user) {
        throw new Error("unauthorized");
    }

    const notifications = await Notification.find({
        receiverId: user._id,
        sent: false,
    }).sort({ createdAt: -1 }).populate("senderId", "name phoneNumber profilePic");

    return notifications;
};
