import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { StartDialogQuery } from '../queries';
import { DialogType } from '../types';

@Controller('dialogs')
export class DialogsController {
  public constructor(private readonly queryBus: QueryBus) {}

  @Get('start')
  public async playerStart(): Promise<DialogType[]> {
    return this.queryBus.execute(new StartDialogQuery());
  }
}
