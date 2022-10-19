import { Controller, Get, Param, Patch, Sse } from '@nestjs/common';
import { Objective } from '../types';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ObjectivesQuery } from '../queries';
import { ObjectivesNotificationsService } from '../services';
import { interval, map, merge } from 'rxjs';
import { isNumber } from 'lodash';
import { UpdateObjectiveCommand } from '../commands';

@Controller('objectives')
export class ObjectivesController {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly objectivesNotificationService: ObjectivesNotificationsService,
  ) {}

  @Get()
  public async index(): Promise<Objective[]> {
    return await this.queryBus.execute(new ObjectivesQuery());
  }

  @Patch(':id')
  public async updateObjective(
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    await this.commandBus.execute(new UpdateObjectiveCommand(id));

    return { success: true };
  }

  @Sse('notify')
  public notifications() {
    return merge(
      interval(10000),
      this.objectivesNotificationService.getObservable(),
    ).pipe(
      map((event) => {
        if (isNumber(event)) {
          return {
            event: 'ping',
            payload: new Date(),
          };
        }

        return event as any;
      }),
      map(({ payload, event }) => ({
        data: {
          event,
          payload,
        },
      })),
    );
  }
}
