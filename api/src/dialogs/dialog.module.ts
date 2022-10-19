import { Module } from '@nestjs/common';
import { DialogsController } from './http';
import { CqrsModule } from '@nestjs/cqrs';
import { StartDialogHandler } from './queries';

@Module({
  controllers: [DialogsController],
  imports: [CqrsModule],
  providers: [StartDialogHandler],
})
export class DialogModule {}
