import { ErrorCode } from '@common/constants/error';
import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  errorCode: ErrorCode;

  private constructor(errorCode: ErrorCode) {
    super(null, HttpStatus.OK);
    this.errorCode = errorCode;
  }

  static throw(errorCode: ErrorCode) {
    return new AppException(errorCode);
  }
}
