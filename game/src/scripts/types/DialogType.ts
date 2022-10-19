import { Character } from '../objects';

export type DialogType = {
  text: string;
  delay: number;
  actor: string;
  next?: DialogType | null;
};

export type ApiDialogType = Omit<DialogType, 'actor' | 'next'> & {
  actor: string;
};
