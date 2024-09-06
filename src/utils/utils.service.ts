import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilityService {
  isEmpty(array: any[]): boolean {
    return !array || array.length === 0;
  }
}
