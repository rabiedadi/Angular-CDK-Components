import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OverlayComponent} from './overlay/overlay.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';



@NgModule({
  declarations: [OverlayComponent],
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule
  ]
})
export class MyOverlayModule { }
