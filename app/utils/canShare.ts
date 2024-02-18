import { isBrowser } from '@supabase/ssr';

export const canShare = isBrowser() && 'canShare' in navigator && navigator.canShare();
