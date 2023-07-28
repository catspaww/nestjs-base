import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class PagingFilter {
  @ApiProperty({ default: 10, required: false })
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  limit = 10;

  @ApiProperty({ default: 1, required: false })
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  page = 1;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  search: string;
}
