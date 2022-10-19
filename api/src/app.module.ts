import { Module } from '@nestjs/common';
import { DialogModule } from './dialogs/dialog.module';
import { ObjectivesModule } from './objectives/objectives.module';

@Module({
  imports: [DialogModule, ObjectivesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
