// libs/components/admin/cs/NoticeEditorDialog.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, MenuItem, FormControl, InputLabel, Select,
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { Notice } from '../../types/notice/notice';
import { NoticeCategory } from '../../enums/notice.enum';
import { GET_NOTICES } from '../../../apollo/user/query';
import { CreateNoticeInput } from '../../types/notice/notice.input';
import { UpdateNoticeInput } from '../../types/notice/notice.update';
import { useTranslation } from 'next-i18next';
import { CREATE_FAQ, UPDATE_FAQ } from '../../../apollo/admin/mutation';

type Mode = 'create' | 'edit';

interface Props {
  open: boolean;
  onClose: () => void;
  mode: Mode;
  memberId?: string;
  initial?: Partial<Notice>;
  /** Stringified NoticesInquiry used for refetchQueries after mutate */
  refetchKey?: string;
  /** If provided, category is pre-set and locked (useful for FAQ/INQUIRY pages) */
  fixedCategory?: NoticeCategory;
}

export default function NoticeEditorDialog(props: Props) {
  const { open, onClose, mode, memberId, initial, refetchKey, fixedCategory } = props;
  const { t } = useTranslation('common');

  const [category, setCategory] = useState<NoticeCategory>(fixedCategory ?? NoticeCategory.NOTICE);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [createNotice, { loading: creating }] = useMutation(CREATE_FAQ, {
    refetchQueries: refetchKey ? [{ query: GET_NOTICES, variables: { input: JSON.parse(refetchKey) } }] : [],
  });
  const [updateNotice, { loading: updating }] = useMutation(UPDATE_FAQ, {
    refetchQueries: refetchKey ? [{ query: GET_NOTICES, variables: { input: JSON.parse(refetchKey) } }] : [],
  });

  useEffect(() => {
    if (mode === 'edit' && initial) {
      setCategory(initial.noticeCategory ?? fixedCategory ?? NoticeCategory.NOTICE);
      setTitle(initial.noticeTitle ?? '');
      setContent(initial.noticeContent ?? '');
    } else {
      setCategory(fixedCategory ?? NoticeCategory.NOTICE);
      setTitle('');
      setContent('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, initial, open, fixedCategory]);

  const disabled = useMemo(() => {
    if (!title?.trim() || !content?.trim()) return true;
    if (mode === 'create' && !memberId) return true;
    return false;
  }, [title, content, mode, memberId]);

  const handleSubmit = async () => {
    if (mode === 'create') {
      const input: CreateNoticeInput = {
        noticeCategory: category,
        noticeTitle: title.trim(),
        noticeContent: content.trim(),
        memberId: memberId!,
      };
      await createNotice({ variables: { input } });
    } else {
      const input: UpdateNoticeInput = {
        _id: initial!._id!,
        noticeCategory: category,
        noticeTitle: title.trim(),
        noticeContent: content.trim(),
      };
      await updateNotice({ variables: { input } });
    }
    onClose();
  };

  // Localized category labels
  const categoryLabel = (c: NoticeCategory) => {
    switch (c) {
      case NoticeCategory.NOTICE:  return t('Notice');
      case NoticeCategory.FAQ:     return t('FAQ');
      case NoticeCategory.INQUIRY: return t('Inquiry');
      default:                     return String(c);
    }
  };

  // Ensure we only render string enum values
  const categoryOptions = (Object.values(NoticeCategory).filter(v => typeof v === 'string') as string[]) as NoticeCategory[];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'create' ? t('Create Notice') : t('Edit Notice')}</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {/* Category */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="notice-category-label">{t('Category')}</InputLabel>
            <Select
              labelId="notice-category-label"
              value={category}
              label={t('Category')}
              onChange={(e) => setCategory(e.target.value as NoticeCategory)}
              disabled={!!fixedCategory}
            >
              {categoryOptions.map((c) => (
                <MenuItem key={c} value={c}>
                  {categoryLabel(c)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Title */}
          <TextField
            label={t('Title')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            variant="outlined"
          />

          {/* Content */}
          <TextField
            label={t('Content')}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            minRows={5}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="text">
          {t('Cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={disabled || creating || updating}
          variant="contained"
        >
          {mode === 'create' ? t('Create') : t('Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
