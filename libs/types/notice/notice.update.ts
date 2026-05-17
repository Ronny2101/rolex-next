import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

export interface UpdateNoticeInput {
	_id: string;
	noticeCategory?: NoticeCategory;
	noticeTitle?: string;
	noticeContent?: string;
}
export interface ChangeNoticeStatusInput {
	_id: string;
	noticeStatus: NoticeStatus;
}