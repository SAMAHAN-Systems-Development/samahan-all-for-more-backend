import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsStartTimeBeforeEndTime', async: false })
class StartTimeBeforeEndTimeConstraint implements ValidatorConstraintInterface {
  validate(startTimeValue: string, validationArgs: ValidationArguments) {
    const [relatedEndTimeProperty] = validationArgs.constraints;
    const endTimeValue = (validationArgs.object as any)[relatedEndTimeProperty];

    const startTime = new Date(startTimeValue);
    const endTime = new Date(endTimeValue);

    return startTime < endTime;
  }

  defaultMessage(validationArgs: ValidationArguments) {
    const [relatedEndTimeProperty] = validationArgs.constraints;
    return `Start time must be earlier than ${relatedEndTimeProperty}`;
  }
}

export function IsStartTimeBeforeEndTime(
  relatedEndTimeProperty: string,
  validationOptions?: ValidationOptions,
) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options: validationOptions,
      constraints: [relatedEndTimeProperty],
      validator: StartTimeBeforeEndTimeConstraint,
    });
  };
}

export { StartTimeBeforeEndTimeConstraint };
