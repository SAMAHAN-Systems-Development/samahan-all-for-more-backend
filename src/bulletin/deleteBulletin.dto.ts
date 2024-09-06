import {
  IsInt,
  IsNotEmpty,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsBulletinIdValidConstraint } from './bulletin.custom.decorator';

function IsBulletinIdValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsBulletinIdValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBulletinIdValidConstraint,
    });
  };
}

export class DeleteBulletinDTO {
  @Type(() => Number)
  @IsInt({ message: 'Bulletin ID must be an integer' })
  @IsBulletinIdValid()
  @IsNotEmpty({ message: 'Bulletin ID is required' })
  id: number;
}
