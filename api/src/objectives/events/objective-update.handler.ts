import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ObjectiveUpdatedEvent } from './objective-update.event';
import { ObjectivesService } from '../services';
import { ObjectivesUpdatedEvent } from './objectives-updated.event';

@EventsHandler(ObjectiveUpdatedEvent)
export class ObjectiveUpdateHandler
  implements IEventHandler<ObjectiveUpdatedEvent>
{
  public constructor(
    private readonly objectsService: ObjectivesService,
    private readonly eventBus: EventBus,
  ) {}

  public handle({ id, payload }: ObjectiveUpdatedEvent): any {
    this.objectsService.updateObjective(id, payload);

    this.eventBus.publish(new ObjectivesUpdatedEvent());
  }
}
