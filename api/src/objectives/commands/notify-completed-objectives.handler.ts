import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectivesNotificationsService } from '../services';
import { NotifyCompletedObjectivesCommand } from './notify-completed-objectives.command';

@CommandHandler(NotifyCompletedObjectivesCommand)
export class NotifyCompletedObjectivesHandler
  implements ICommandHandler<NotifyCompletedObjectivesCommand>
{
  public constructor(
    private readonly notificationService: ObjectivesNotificationsService,
  ) {}

  public async execute(
    command: NotifyCompletedObjectivesCommand,
  ): Promise<any> {
    this.notificationService.emit('objectives.completed', {});
  }
}
