export interface IState {
  start(): void;
  run(): void;
  stop(): void;
  getName(): string;
}
