import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thDate',
})
export class ThDatePipe implements PipeTransform {
  
  transform(value: any) {
    if (!this.checkNull(value)) {
      let date = new Date(value);
      const days = [
        'อาทิตย์',
        'จันทร์',
        'อังคาร',
        'พุธ',
        'พฤหัสบดี',
        'ศุกร์',
        'เสาร์',
      ];
      const thMonthNames = [
        'มกราคม',
        'กุมภาพันธ์',
        'มีนาคม',
        'เมษายน',
        'พฤษภาคม',
        'มิถุนายน',
        'กรกฎาคม',
        'สิงหาคม',
        'กันยายน',
        'ตุลาคม',
        'พฤศจิกายน',
        'ธันวาคม',
      ];
      let dayName = days[date.getDay()];
      let day = date.getDate();
      let month = thMonthNames[date.getMonth()];
      let year = date.getFullYear() + 543;
      return `วัน${dayName}ที่ ${day} ${month} พ.ศ. ${year}`;
    } else {
      return value == null || value == '' || value == '-' || value == ' '
        ? '-'
        : value;
    }
  }

  checkNull(str: any): boolean {
    if (str === null) return true;
    if (str === undefined) return true;
    if (str === ' ') return true;
    if (str === '-') return true;
    if (str === '') return true;
    return false;
  }
}
