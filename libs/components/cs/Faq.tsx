import React, { SyntheticEvent, useMemo, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Box, Stack, TextField, Typography, Pagination } from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useTranslation } from 'next-i18next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { NoticeCategory } from '../../enums/notice.enum';
import { useNotices } from '../../hooks/useNotice';

type Props = { category?: NoticeCategory };

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

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  borderTop: '1px solid rgba(0,0,0,0.06)',
  '&:before': { display: 'none' },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'transparent',
  transition: 'background .2s ease',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': { transform: 'rotate(180deg)' },
  '& .MuiAccordionSummary-content': { marginLeft: theme.spacing(1) },
  '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' },
}));

const PAGE_SIZE = 10;

const Faq: React.FC<Props> = ({ category = NoticeCategory.FAQ }) => {
  const { t } = useTranslation('common');
  const device = useDeviceDetect();
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [text, setText] = useState('');

  const { notices, totalCount, limit, loading } = useNotices({
    category,
    page,
    limit: PAGE_SIZE,
    text: text || undefined,
  });

  const pageLimit = limit || PAGE_SIZE;
  const pageCount = useMemo(() => Math.max(1, Math.ceil(totalCount / pageLimit)), [totalCount, pageLimit]);

  const handleChange = (panel: string) => (_e: SyntheticEvent, isOpen: boolean) => {
    setExpanded(isOpen ? panel : false);
  };

  if (device === 'mobile') return <div>{t('FAQ_MOBILE')}</div>;

  return (
    <Stack className="faq-content" sx={{ gap: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>{t('FAQ')}</Typography>

      {/* Search (glass) */}
      <Glass sx={{ p: 1.25 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={t('Search question/answer') as string}
          value={text}
          onChange={(e) => { setPage(1); setText(e.target.value); }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Glass>

      {/* List (glass) */}
      <Glass>
        {loading && <Box sx={{ p: 2 }}>{t('Loading…')}</Box>}

        {!loading && notices.length === 0 && (
          <Box sx={{ p: 2 }}>
            {text ? t('No results found.') : t('No FAQs yet.')}
          </Box>
        )}

        {!loading && notices.map((n: any) => {
          const id = String(n._id);
          return (
            <Accordion key={id} expanded={expanded === id} onChange={handleChange(id)}>
              <AccordionSummary id={`faq-${id}-header`} aria-controls={`faq-${id}-content`}>
                <Typography className="badge" variant="h5" sx={{ mr: 1, fontWeight: 800, color: 'primary.main' }}>
                  {t('Q')}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{n.noticeTitle}</Typography>
              </AccordionSummary>
              <AccordionDetails id={`faq-${id}-content`}>
                <Stack direction="row" spacing={1}>
                  <Typography className="badge" variant="h5" color="primary" sx={{ fontWeight: 800 }}>
                    {t('A')}
                  </Typography>
                  <Typography sx={{ whiteSpace: 'pre-line' }}>{n.noticeContent}</Typography>
                </Stack>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Glass>

      <Stack direction="row" justifyContent="center">
        <Pagination page={page} count={pageCount} onChange={(_, p) => setPage(p)} />
      </Stack>
    </Stack>
  );
};


export default Faq;
