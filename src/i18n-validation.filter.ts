import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { I18n } from './i18n';
import { I18nValidationException } from './i18n-validation.exception';

/**
 * Exception filter that catches only I18nValidationException
 * and returns localized validation error messages.
 */
@Catch(I18nValidationException)
export class I18nValidationFilter implements ExceptionFilter {
  private readonly i18n: I18n;
  private readonly fallback: string;

  constructor(
    private readonly adapterHost: HttpAdapterHost,
    opts: { fallbackLanguage?: string } = {}
  ) {
    this.fallback = opts.fallbackLanguage ?? 'en';
    this.i18n = new I18n(this.fallback);
  }

  catch(exception: I18nValidationException, host: ArgumentsHost): void {
    const { httpAdapter } = this.adapterHost;
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<{ headers: Record<string, string> }>();
    const res = ctx.getResponse();

    const lang =
      req.headers?.['accept-language']?.toLowerCase() || this.fallback;

    const messages = exception.validationErrors.flatMap((err) =>
      Object.entries(err.constraints || {}).map(([key]) =>
        this.i18n.translate(
          lang,
          key,
          err.property,
          err.contexts?.[key]?.constraints || []
        )
      )
    );

    httpAdapter.reply(
      res,
      {
        statusCode: exception.getStatus(),
        message: messages[0] ?? 'Validation failed',
        error: 'Bad Request'
      },
      exception.getStatus()
    );
  }
}
