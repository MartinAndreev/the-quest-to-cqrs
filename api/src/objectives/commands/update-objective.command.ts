import { ICommand } from '@nestjs/cqrs';

export class UpdateObjectiveCommand implements ICommand {
  public constructor(public readonly id: string) {}
}
