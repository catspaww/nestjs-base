import { ApiProperty } from '@nestjs/swagger';

export class Pagination {
  @ApiProperty()
  total: number;
  @ApiProperty()
  page: number;
  @ApiProperty()
  limit: number;
}
