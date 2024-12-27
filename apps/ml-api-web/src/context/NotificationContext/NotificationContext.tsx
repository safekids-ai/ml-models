import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { equals, filter, propEq, findIndex, assoc, update, forEach } from 'ramda';

import { getRequest, postRequest } from '../../utils/api';
import { GET_NOTIFICATIONS, UPDATE_NOTIFICATIONS_STATUS } from '../../utils/endpoints';
import { UpdateNotificationStatusResponse } from '../../types/api-responses';

enum NotificationStatus {
    READ = 'R',
    UNREAD = 'U',
}
export enum NotificationTypes {
    DeviceCreated = 'DeviceCreated',
}

export type Notification = {
    _id: string;
    content: { Subject: string; Body: string };
    type: NotificationTypes;
    status: NotificationStatus;
};

type UpdateNotificationsStatusRequest = {
    notificationIds: string[];
    status: NotificationStatus;
};

type NotificationContextType = {
    notifications: Notification[];
    unreadNotifications: Notification[];
    markAsRead: (ids: string[]) => void;
    markAsUnread: (ids: string[]) => void;
};
const NotificationContext = React.createContext<NotificationContextType>({
    notifications: [],
    unreadNotifications: [],
    markAsRead: () => undefined,
    markAsUnread: () => undefined,
});

const NotificationProvider: React.FC<any> = (props) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    useEffect(function getNotifications() {
        const fetchNotifications = () => {
            getRequest<{}, Notification[]>(GET_NOTIFICATIONS, {}, { headers: { 'Cache-Control': 'no-cache' } })
                .then(({ data = [] }) => {
                    setNotifications((notifications) => (!equals(notifications, data) ? data : notifications));
                })
                .catch(console.error);
        };
        fetchNotifications();
        const id = setInterval(fetchNotifications, 5000);
        return () => clearInterval(id);
    }, []);
    const updateNotificationStatus = useCallback(
        (ids: string[], status: NotificationStatus) => {
            postRequest<UpdateNotificationsStatusRequest, UpdateNotificationStatusResponse>(UPDATE_NOTIFICATIONS_STATUS, {
                notificationIds: ids,
                status,
            }).then(({ data }) => {
                if (data.notificationsUpdated)
                    setNotifications((notifications) => {
                        let updatedNotifications = [...notifications];
                        forEach((id) => {
                            const index = findIndex(propEq('_id', id), updatedNotifications);
                            const notification = assoc('status', NotificationStatus.READ, updatedNotifications[index]);
                            updatedNotifications = update(index, notification, updatedNotifications);
                        }, ids);
                        return updatedNotifications;
                    });
            });
        },
        [setNotifications],
    );
    const markAsRead = useCallback(
        (ids: string[]) => {
            updateNotificationStatus(ids, NotificationStatus.READ);
        },
        [updateNotificationStatus],
    );

    const markAsUnread = useCallback(
        (ids: string[]) => {
            updateNotificationStatus(ids, NotificationStatus.UNREAD);
        },
        [updateNotificationStatus],
    );

    const value = useMemo(
        () => ({
            notifications,
            unreadNotifications: filter(propEq('status', NotificationStatus.UNREAD), notifications),
            markAsRead,
            markAsUnread,
        }),
        [notifications, markAsRead, markAsUnread],
    );
    return <NotificationContext.Provider value={value} {...props} />;
};
const useNotifications = () => React.useContext(NotificationContext);

export { NotificationProvider, useNotifications };
