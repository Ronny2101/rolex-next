import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

export interface Notice {
	_id: string;
	noticeCategory: NoticeCategory;
	noticeStatus: NoticeStatus;
	noticeTitle: string;
	noticeContent: string;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Notices {
	notices: Notice[];
	totalCount: number;
	page: number;
	limit: number;
}