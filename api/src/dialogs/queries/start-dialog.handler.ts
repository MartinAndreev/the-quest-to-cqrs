import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { StartDialogQuery } from './start-dialog.query';
import { startDialog } from '../constants';
import { DialogType } from '../types';

@QueryHandler(StartDialogQuery)
export class StartDialogHandler implements IQueryHandler<StartDialogQuery> {
  public async execute(): Promise<DialogType[]> {
    return startDialog;
  }
}
