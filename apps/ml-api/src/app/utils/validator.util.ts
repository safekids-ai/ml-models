import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsAtLeastOneFieldRequired(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAtLeastOneFieldRequired',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'object' || value === null) return false;
          return Object.values(value).some(val => val !== undefined && val !== null && val !== '');
        },
        defaultMessage(args: ValidationArguments) {
          return `At least one field must be provided in ${args.property}`;
        },
      },
    });
  };
}
