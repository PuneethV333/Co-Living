import type { notificationType } from "../types/notification.types";

export const getNotificationMessage = (notification: notificationType) => {
    switch (notification.type) {
        case "VISIT_REQUEST":
            return "requested a property visit";

        case "MESSAGE":
            return "sent you a message";

        case "BOOKING_UPDATE":
            return "updated a booking";

        case "ACCEPT_VISIT_REQUEST":
            return "accepted your visit request";

        case "REJECT_VISIT_REQUEST":
            return "declined your visit request";

        default:
            return "";
    }
};
