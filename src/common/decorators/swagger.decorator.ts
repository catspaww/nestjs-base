import { SuccessResponse } from '@constants/app-response';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const SwaggerExample = <DataDto>(DataDto: Type<DataDto>) =>
  applyDecorators(
    ApiExtraModels(SuccessResponse, DataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponse) },
          { properties: { data: { $ref: getSchemaPath(DataDto) } } },
        ],
      },
    }),
  );

export const SwaggerArrayExample = <DataDto>(DataDto: Type<DataDto>) =>
  applyDecorators(
    ApiExtraModels(SuccessResponse, DataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponse) },
          { properties: { data: { type: 'array', items: { $ref: getSchemaPath(DataDto) } } } },
        ],
      },
    }),
  );
