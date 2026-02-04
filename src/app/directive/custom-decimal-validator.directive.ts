import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
    selector: "[customDecimal][formControlName],[customDecimal][formControl],[customDecimal][ngModel]",
    standalone: false
})
export class CustomDecimalDirective {
  @Input()
  customMin: number;
  private regexPattern: RegExp = /^\d+\.\d{2}$/;

  constructor(private el: ElementRef) {}

  @HostListener("keydown", ["$event"])
  onKeyDown(event: any) {
    const value = event.target.value;
    if (event.keyCode !== 8 && event.keyCode !== 46) {
      const isValid = this.regexPattern.test(value);
      if (isValid) {
        event.preventDefault();
      }
    }
  }
}
