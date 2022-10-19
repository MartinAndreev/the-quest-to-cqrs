import { AggregateRoot } from '@nestjs/cqrs';
import { ObjectiveUpdatedEvent } from '../events';

export class ObjectiveModel extends AggregateRoot {
  public constructor(private readonly id: string) {
    super();
  }

  public update(payload: { found?: boolean; completedOn?: Date }) {
    this.apply(new ObjectiveUpdatedEvent(this.id, payload));
  }
}
