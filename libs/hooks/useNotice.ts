import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_NOTICES } from '../../apollo/user/query';
import { NoticeCategory, NoticeStatus } from '../enums/notice.enum';
import { Direction } from '../enums/common.enum';

type Params = {
  category?: NoticeCategory;
  status?: NoticeStatus;
  memberId?: string;
  text?: string;
  page?: number;
  limit?: number;
  sort?: string;               
  direction?: Direction;       
};

export function useNotices(params: Params) {
  const variables = useMemo(() => {
    const { category, status, memberId, text, page = 1, limit = 20, sort = 'createdAt', direction = Direction.DESC } = params;
    return {
      input: {
        page,
        limit,
        sort,
        direction,
        search: {
          ...(category ? { noticeCategory: category } : {}),
          ...(status ? { noticeStatus: status } : {}),
          ...(memberId ? { memberId } : {}),
          ...(text ? { text } : {}),
        },
      },
    };
  }, [params]);

  const { data, loading, error, refetch } = useQuery(GET_NOTICES, {
    variables,
    fetchPolicy: 'cache-and-network',
  });

  return {
    notices: data?.getNotices?.notices ?? [],
    totalCount: data?.getNotices?.totalCount ?? 0,
    page: data?.getNotices?.page ?? params.page ?? 1,
    limit: data?.getNotices?.limit ?? params.limit ?? 20,
    loading,
    error,
    refetch,
  };
}