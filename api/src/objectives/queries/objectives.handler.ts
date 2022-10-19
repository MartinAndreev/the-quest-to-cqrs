import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ObjectivesQuery } from './objectives.query';
import { ObjectivesService } from '../services';
import { Objective } from '../types';

@QueryHandler(ObjectivesQuery)
export class ObjectivesHandler implements IQueryHandler<ObjectivesQuery> {
  public constructor(private readonly objectivesService: ObjectivesService) {}

  public async execute(): Promise<Objective[]> {
    return this.objectivesService.getObjectives();
  }
}
