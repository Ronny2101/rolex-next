import { NotificationStatus } from '../../enums/notification.enum';

export interface UpdateNotificationInput {
	_id: string;
	notificationStatus?: NotificationStatus;
	notificationTitle?: string;
	notificationDesc?: string;
}