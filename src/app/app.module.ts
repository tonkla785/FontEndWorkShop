import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { HomepageComponent } from './homepage/homepage.component';
import { ThDatePipe } from './pipe/th-date.pipe';
import { ThTimePipe } from './pipe/th-time.pipe';
import { ThDateShPipe } from './pipe/th-date-sh.pipe';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thLocale } from 'ngx-bootstrap/locale';

const thBeLocale = {
  ...thLocale,

  postformat: (str: string) => {
    return str.replace(/\b(\d{4})\b/g, (year) => {
      const y = parseInt(year, 10);
      return isNaN(y) ? year : (y + 543).toString();
    });
  },
};

defineLocale('th-be', thBeLocale);

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ThDatePipe,
    ThTimePipe,
    ThDateShPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    NzTableModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
