import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {MyOverlayModule} from './my-overlay/my-overlay.module';
import {MySelectModule} from './my-select/my-select.module';
import {FormsModule} from '@angular/forms';
import {CheckboxComponent} from './my-check-box/checkbox.component';

@NgModule({
    declarations: [
        AppComponent,
        CheckboxComponent
    ],
    imports: [
        BrowserModule,
        MyOverlayModule,
        MySelectModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
  ]
})
export class AppModule { }
