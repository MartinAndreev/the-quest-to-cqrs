import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateObjectiveCommand } from './update-objective.command';
import { ObjectiveModel } from '../models/objective.model';

@CommandHandler(UpdateObjectiveCommand)
export class UpdateObjectiveHandler
  implements ICommandHandler<UpdateObjectiveCommand>
{
  public constructor(private readonly publisher: EventPublisher) {}

  public async execute(command: UpdateObjectiveCommand): Promise<void> {
    const completedOn = new Date();

    const objective = this.publisher.mergeObjectContext(
      new ObjectiveModel(command.id),
    );

    objective.update({ found: true, completedOn });
    objective.commit();
  }
}
