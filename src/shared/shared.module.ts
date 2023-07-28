import { Module, Global } from '@nestjs/common';

const providers = [];

@Global()
@Module({
  providers,
  exports: providers,
})
export class SharedModule {}
