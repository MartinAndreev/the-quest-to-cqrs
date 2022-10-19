import { IEvent } from '@nestjs/cqrs';

export class ObjectiveUpdatedEvent implements IEvent {
  public constructor(
    public readonly id: string,
    public payload: {
      found?: boolean;
      completedOn?: Date;
    },
  ) {}
}
