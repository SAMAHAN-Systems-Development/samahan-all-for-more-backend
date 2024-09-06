import { Injectable } from '@nestjs/common';

import { format } from 'date-fns';

@Injectable()
export class DateFNSService {
  formatDateWithTimestamp(date: Date): string {
    return format(date, 'dd-MM-yyyy-HH-mm-ss');
  }

  sanitizeFileName(originalName: string): string {
    return originalName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
  }

  generateUniqueFileName(originalName: string): string {
    const formattedDate = this.formatDateWithTimestamp(new Date());
    const sanitizedFileName = this.sanitizeFileName(originalName);
    return `${formattedDate}-${sanitizedFileName}`;
  }
}
