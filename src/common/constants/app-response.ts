import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';
import { ErrorCode } from './error';

export enum SuccessCode {
  SUCCESS = 'Success',
}

export class Response {
  @ApiProperty()
  code: string;

  @ApiProperty()
  message: string;
}

export class SuccessResponse<T> extends Response {
  @ApiProperty()
  data: T;

  private constructor(data: T) {
    super();
    this.code = SuccessCode.SUCCESS.toUpperCase();
    this.message = SuccessCode.SUCCESS;
    this.data = data;
  }

  static transform<E, T>(data: T, model: Type<T>): SuccessResponse<T> {
    const result: T = new model(data);

    return new SuccessResponse(result);
  }
}

export class ErrorResponse extends Response {
  private constructor(code: string, message: string) {
    super();
    this.code = code;
    this.message = message;
  }

  static throw(code: string, message: string): ErrorResponse {
    return new ErrorResponse(code, message);
  }
}
