import React, { SyntheticEvent, useMemo, useState } from 'react';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Box, Stack, TextField, Pagination, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useTranslation } from 'next-i18next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { NoticeCategory } from '../../enums/notice.enum';
import { useNotices } from '../../hooks/useNotice';

const PAGE_SIZE = 10;
const COLS = 'minmax(64px,80px) 1fr minmax(120px,180px)';

const Glass: React.FC<React.ComponentProps<typeof Box>> = ({ sx, ...rest }) => (
  <Box
    {...rest}
    sx={{
      borderRadius: 3,
      backdropFilter: 'blur(10px)',
      background: 'linear-gradient(135deg, rgba(255,255,255,.7), rgba(255,255,255,.45))',
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 8px 24px rgba(16,24,40,.06)',
      ...(sx || {}),
    }}
  />
);

const Accordion = styled((props: any) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  borderTop: '1px solid rgba(0,0,0,0.06)',
  '&:before': { display: 'none' },
}));

const AccordionSummary = styled((props: any) => (
  <MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.2rem' }} />} {...props} />
))(() => ({
  backgroundColor: 'transparent',
  transition: 'background .2s ease',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': { transform: 'rotate(180deg)' },
  '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' },
}));

const DATE_FMT: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' };

const Inquiry: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const device = useDeviceDetect();
  const [page, setPage] = useState(1);
  const [text, setText] = useState('');
  const [expanded, setExpanded] = useState<string | false>(false);

  const { notices, totalCount, limit, loading } = useNotices({
    category: NoticeCategory.INQUIRY,
    page,
    limit: PAGE_SIZE,
    text: text || undefined,
  });

  const pageLimit = limit || PAGE_SIZE;
  const pageCount = useMemo(() => Math.max(1, Math.ceil(totalCount / pageLimit)), [totalCount, pageLimit]);
  const handleChange = (panel: string) => (_e: SyntheticEvent, isOpen: boolean) => setExpanded(isOpen ? panel : false);

  if (device === 'mobile') return <div>{t('INQUIRY_MOBILE')}</div>;

  return (
    <Stack className="inquiry-content" sx={{ gap: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>{t('1:1 Inquiry')}</Typography>

      {/* Search (glass) */}
      <Glass sx={{ p: 1.25 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={t('Search title/content') as string}
          value={text}
          onChange={(e) => { setPage(1); setText(e.target.value); }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Glass>

      {/* List (glass) */}
      <Glass>
        {/* Header */}
        <Box
          sx={{
            display: 'grid', gridTemplateColumns: COLS, gap: 2,
            px: 2, py: 1.5, fontWeight: 700, color: 'text.secondary',
          }}
        >
          <span>{t('Number')}</span>
          <span>{t('Title')}</span>
          <span style={{ textAlign: 'right' }}>{t('Date')}</span>
        </Box>

        {loading && <Box sx={{ p: 2 }}>{t('Loading…')}</Box>}

        {!loading && notices.length === 0 && (
          <Box sx={{ p: 2 }}>
            {text ? t('No results found.') : t('No inquiries yet.')}
          </Box>
        )}

        {!loading && notices.map((n: any, idx: number) => {
          const num = (page - 1) * pageLimit + idx + 1;
          const id = String(n._id);
          return (
            <Accordion key={id} expanded={expanded === id} onChange={handleChange(id)}>
              <AccordionSummary>
                <Box sx={{ display: 'grid', gridTemplateColumns: COLS, gap: 2, alignItems: 'center', width: '100%' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{num}</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{n.noticeTitle}</Typography>
                  <Typography variant="body2" sx={{ textAlign: 'right', color: 'text.secondary' }}>
                    {new Date(n.createdAt).toLocaleDateString(i18n.language, DATE_FMT)}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ whiteSpace: 'pre-line' }}>{n.noticeContent}</Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Glass>

      <Stack alignItems="center" sx={{ mt: 1 }}>
        <Pagination page={page} count={pageCount} onChange={(_, p) => setPage(p)} />
      </Stack>
    </Stack>
  );
};

export default Inquiry;
