import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select/select.component';
import {MyOverlayModule} from '../my-overlay/my-overlay.module';
import {FormsModule} from '@angular/forms';
import { OptionComponent } from './option/option.component';



@NgModule({
  declarations: [SelectComponent, OptionComponent],
  exports: [
    SelectComponent,
    OptionComponent,
  ],
  imports: [
    CommonModule,
    MyOverlayModule,
    FormsModule
  ]
})
export class MySelectModule { }
