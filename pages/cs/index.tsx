import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Stack, Tabs, Tab } from '@mui/material';
import { useTranslation } from 'next-i18next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Notice from '../../libs/components/cs/Notice';
import Faq from '../../libs/components/cs/Faq';
import Inquiry from '../../libs/components/cs/Inquiry';
import { NoticeCategory } from '../../libs/enums/notice.enum';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

type TabKey = 'notice' | 'faq' | 'inquiry';
const TAB_VALUES: TabKey[] = ['notice', 'faq', 'inquiry'];
const isTabKey = (v: unknown): v is TabKey => typeof v === 'string' && TAB_VALUES.includes(v as TabKey);

export const getStaticProps = async ({ locale }: any) => ({
  props: { ...(await serverSideTranslations(locale, ['common'])) },
});

const CS: NextPage = () => {
  const { t } = useTranslation('common');
  const device = useDeviceDetect();
  const router = useRouter();

  const tab: TabKey = isTabKey(router.query.tab) ? (router.query.tab as TabKey) : 'notice';

  const changeTabHandler = (value: TabKey) => {
    if (value === tab) return;
    router.push({ pathname: '/cs', query: { tab: value } }, undefined, { scroll: false, shallow: true });
  };
  const handleTabChange = (_e: React.SyntheticEvent, newValue: TabKey) => changeTabHandler(newValue);

  if (device === 'mobile') return <h1>{t('CS_PAGE_MOBILE')}</h1>;

  return (
    <Stack className="cs-page" sx={{ py: 4 }}>
      <Stack className="container" sx={{ gap: 3 }}>
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            background: 'linear-gradient(135deg, rgba(255,255,255,.7), rgba(255,255,255,.45))',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 8px 24px rgba(16,24,40,.06)',
          }}
        >
          <Stack direction="row" alignItems="flex-end" justifyContent="space-between">
            <Box>
              <Box component="span" sx={{ display: 'block', fontSize: 14, color: 'text.secondary' }}>
                {t('Help center')}
              </Box>
              <Box component="p" sx={{ m: 0, fontSize: 20, fontWeight: 700 }}>
                {t('I will answer your questions')}
              </Box>
            </Box>

            <Tabs
              value={tab}
              onChange={handleTabChange}
              sx={{
                minHeight: 44,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  minHeight: 44,
                  fontWeight: 600,
                  mr: 1,
                  borderRadius: 2,
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
                },
              }}
            >
              <Tab value="notice" label={t('Notice')} />
              <Tab value="faq" label={t('FAQ')} />
              <Tab value="inquiry" label={t('Inquiry')} />
            </Tabs>
          </Stack>
        </Box>

        <Box className="cs-content">
          {tab === 'notice' && <Notice category={NoticeCategory.NOTICE} />}
          {tab === 'faq' && <Faq category={NoticeCategory.FAQ} />}
          {tab === 'inquiry' && <Inquiry />}
        </Box>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(CS);
