import { Pipe, PipeTransform } from "@angular/core";
import { formatDate } from "@angular/common";

@Pipe({
    name: "addDays",
    standalone: false
})
export class AddDaysPipe implements PipeTransform {
  transform(value: Date | string, days: number, format: string = "dd-MM-yyyy"): string {
    let date = new Date(value);
    date.setDate(date.getDate() + days);

    return formatDate(date, format, "en-US");
  }
}
