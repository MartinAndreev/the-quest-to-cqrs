import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { delay, filter, map, Observable, of, withLatestFrom } from 'rxjs';
import { ObjectivesUpdatedEvent } from '../events';
import { NotifyChangedObjectivesCommand } from '../commands';
import { ObjectivesService } from '../services';
import { NotifyCompletedObjectivesCommand } from '../commands/notify-completed-objectives.command';

@Injectable()
export class ObjectiveSaga {
  public constructor(private readonly objectivesService: ObjectivesService) {}

  @Saga()
  objectivesUpdated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ObjectivesUpdatedEvent),
      map(() => new NotifyChangedObjectivesCommand()),
    );
  };

  @Saga()
  objectivesCompleted = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ObjectivesUpdatedEvent),
      filter((_) => {
        const objectives = this.objectivesService.getObjectives();

        const result = objectives.filter((o) => !!o.found).length;

        return result === 3;
      }),
      delay(1000),
      map(() => new NotifyCompletedObjectivesCommand()),
    );
  };
}
