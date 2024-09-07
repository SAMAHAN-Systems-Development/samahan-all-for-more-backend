import { format } from 'date-fns';

export function formatDateWithTimestamp(date: Date): string {
  return format(date, 'dd-MM-yyyy-HH-mm-ss');
}

export function sanitizeFileName(originalName: string): string {
  return originalName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
}

export function generateUniqueFileName(originalName: string): string {
  const formattedDate = formatDateWithTimestamp(new Date());
  const sanitizedFileName = sanitizeFileName(originalName);
  return `${formattedDate}-${sanitizedFileName}`;
}
