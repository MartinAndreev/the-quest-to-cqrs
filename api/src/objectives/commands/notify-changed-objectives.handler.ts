import { CommandHandler, ICommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { NotifyChangedObjectivesCommand } from './notify-changed-objectives.command';
import { ObjectivesNotificationsService } from '../services';

@CommandHandler(NotifyChangedObjectivesCommand)
export class NotifyChangedObjectivesHandler
  implements ICommandHandler<NotifyChangedObjectivesCommand>
{
  public constructor(
    private readonly notificationService: ObjectivesNotificationsService,
  ) {}

  public async execute(command: NotifyChangedObjectivesCommand): Promise<any> {
    this.notificationService.emit('objectives.updated', {});
  }
}
