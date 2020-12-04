import {AfterViewInit, Component, OnInit, TemplateRef, Type} from '@angular/core';
import {OverlayRef} from '@angular/cdk/overlay';
import {Subject} from 'rxjs';

export interface OverlayCloseEvent<R> {
  type: string;
  data: R;
}

export class MyOverlayRef<R = any, T = any> { // R = Response Data Type, T = Data passed to Modal Type

  afterClosed$ = new Subject<OverlayCloseEvent<R>>();
  afterInit$ = new Subject<any>();

  constructor(public overlay: OverlayRef, public content: string | TemplateRef<any> | Type<any>, public data: T ) {
    overlay.backdropClick().subscribe(() => this._close('backdropClick', null));
  }

  close(data?: R) {
    console.log(data);
    this._close('close', data);
  }

  private _close(type: 'backdropClick' | 'close', data: R) {
    this.overlay.dispose();
    this.afterClosed$.next({ type, data });
    this.afterClosed$.complete();
  }


}
