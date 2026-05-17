import { NotificationType, NotificationGroup, NotificationStatus } from '../../enums/notification.enum';
import { Direction } from '../../enums/common.enum';

export interface CreateNotificationInput {
	notificationType: NotificationType;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationDesc?: string;
	authorId: string;
	receiverId: string;
	commentId?: string;
	propertyId?: string;
	articleId?: string;
}

interface NISearch {
	memberId?: string;
	typeList?: NotificationType[];
	statusList?: NotificationStatus[];
	groupList?: NotificationGroup[];
	text?: string;
}

export interface NotificationInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: NISearch;
}