import { Module } from '@nestjs/common';
import { ObjectivesController } from './http';
import { CqrsModule } from '@nestjs/cqrs';
import { ObjectivesNotificationsService, ObjectivesService } from './services';
import { ObjectivesHandler } from './queries';
import { ObjectiveUpdateHandler } from './events';
import { ObjectiveSaga } from './sagas/objective.saga';
import { NotifyChangedObjectivesHandler } from './commands/notify-changed-objectives.handler';
import { NotifyCompletedObjectivesHandler } from './commands/notify-completed-objectives.handler';
import { UpdateObjectiveHandler } from './commands/update-objective.handler';

@Module({
  controllers: [ObjectivesController],
  imports: [CqrsModule],
  providers: [
    ObjectivesService,
    ObjectivesHandler,
    ObjectivesNotificationsService,
    ObjectiveUpdateHandler,
    ObjectiveSaga,
    NotifyChangedObjectivesHandler,
    NotifyCompletedObjectivesHandler,
    UpdateObjectiveHandler,
  ],
})
export class ObjectivesModule {}
