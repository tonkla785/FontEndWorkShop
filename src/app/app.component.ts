import { Component } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'FontEndWorkShop';

  locales = ['th-be'];
  locale = 'th-be';

  constructor(private localeService: BsLocaleService) {
    this.localeService.use(this.locale);
  }

  applyLocale(pop: any) {
    this.localeService.use(this.locale);
    pop.hide();
    pop.show();
  }
}
