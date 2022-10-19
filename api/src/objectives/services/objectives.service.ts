import { Injectable } from '@nestjs/common';
import { objectives } from '../constants';
import { Objective } from '../types';

@Injectable()
export class ObjectivesService {
  private objectives!: Objective[];

  public constructor() {
    this.objectives = objectives.map((o) => ({
      found: false,
      ...o,
    }));
  }

  public getObjectives(): Objective[] {
    return this.objectives;
  }

  public updateObjective(
    id: string,
    payload: { found?: boolean; completedOn?: Date },
  ): void {
    this.objectives = this.objectives.map((o) => {
      if (o.id === id) {
        return {
          ...o,
          ...payload,
        };
      }
      return o;
    });
  }
}
