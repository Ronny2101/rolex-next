import { Direction } from '../../enums/common.enum';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

export interface CreateNoticeInput {
	noticeCategory: NoticeCategory;
	noticeTitle: string;
	noticeContent: string;
	memberId: string;
}

export interface NoticeSearchInput {
	noticeCategory?: NoticeCategory;
	noticeStatus?: NoticeStatus;
	memberId?: string;
	text?: string;
}

export interface NoticesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: NoticeSearchInput;
}