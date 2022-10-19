import { ApiDialogType, DialogType } from '../types';
import { Character } from '../objects';

export class DialogBuilderService {
  public build(data: ApiDialogType[]): DialogType {
    const dialogs: DialogType[] = data.map((d) => ({
      ...d,
      next: null,
    }));

    let currentDialog: DialogType = dialogs.shift() as DialogType;
    const startDialog = currentDialog;

    for (const dialog of dialogs) {
      currentDialog.next = dialog;

      currentDialog = dialog;
    }

    return startDialog;
  }
}
