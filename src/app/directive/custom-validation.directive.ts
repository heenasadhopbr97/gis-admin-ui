import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
// import { stringify } from 'querystring';

export function fileExtensionValidator(
    controlName: string,
    allowedExtensions: Array<string>) {
    return (fromGroup: FormGroup) => {
        const filePath = fromGroup.controls[controlName];

        if (filePath.errors) {
            return;
        }
        if (filePath.value.indexOf('.') !== -1) {
            var ext = filePath.value.split('.').pop();
        } else {
            return;
        }
        if (allowedExtensions.indexOf(ext) === -1) {
            filePath.setErrors({ invalidExt: true });
        }
    };
};