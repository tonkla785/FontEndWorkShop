import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thTime',
})
export class ThTimePipe implements PipeTransform {
  transform(value: any) {
    if (!value) return '';

    const date = new Date(value);

    const Time: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Bangkok',
    };

    return new Intl.DateTimeFormat('th-TH', Time).format(date) + ' น.';
  }
}
