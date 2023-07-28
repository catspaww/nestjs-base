import { ErrorResponse } from '@constants/app-response';
import { ErrorCode } from '@constants/error';
import { AppException } from '@exceptions/app.exception';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService, private readonly logger: Logger) {}

  //#region exception handler
  private readonly exceptionHandler = {
    BadRequestException: (exception: HttpException, lang?: string) => {
      const errors = (exception.getResponse() as any).message;

      return {
        message: errors,
        code: ErrorCode.INVALID_INPUT,
      };
    },
    AppException: (exception: HttpException, lang?: string) => {
      const code = (exception as AppException).errorCode;

      const message = this.i18n.translate(`messages.${code}`, { lang });

      return {
        message,
        code,
      };
    },
    UnauthorizedException: (exception: HttpException, lang?: string) => {
      const code = ErrorCode.UNAUTHORIZE;

      const message = this.i18n.translate(`errors.${code}`, { lang });

      return {
        message,
        code,
      };
    },
    ForbiddenException: (exception: HttpException, lang?: string) => {
      const code = ErrorCode.FORBIDDEN;

      const message = this.i18n.translate(`errors.${code}`, { lang });

      return {
        message,
        code,
      };
    },
  };
  //#endregion

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const lang = request['i18nLang'];

    const instance = exception.constructor.name;

    this.logger.error(exception.message, exception.stack, ctx);

    if (!this.exceptionHandler[instance]) {
      const message = this.i18n.translate(`errors.${ErrorCode.SYSTEM_ERROR}`, { lang });

      const errResponse = ErrorResponse.throw(ErrorCode.SYSTEM_ERROR, message);

      return response.status(status).json(errResponse);
    }

    const { message, code } = this.exceptionHandler[instance](exception, lang);

    const errResponse = ErrorResponse.throw(code, message);

    return response.status(status).json(errResponse);
  }
}
