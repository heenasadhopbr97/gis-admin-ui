import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class WhiteeSpaceValidator {
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if (control.value != null) {
      if (control.value.endsWith(" ") || control.value.startsWith(" ")) {
        return { cannotContainSpace: true };
      }
    }

    return null;
  }
}
