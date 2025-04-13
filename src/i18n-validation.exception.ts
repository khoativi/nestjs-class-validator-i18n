import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

/**
 * A custom exception used to distinguish class-validator errors
 * from other BadRequestExceptions. Enables targeted filtering for i18n.
 */
export class I18nValidationException extends BadRequestException {
  constructor(public readonly validationErrors: ValidationError[]) {
    super(validationErrors);
  }
}
