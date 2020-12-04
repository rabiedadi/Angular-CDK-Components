import {ConnectionPositionPair, Overlay, OverlayConfig} from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, Injector, TemplateRef, Type } from '@angular/core';
import { MyOverlayRef } from './my-overlay-ref';
import { OverlayComponent } from './overlay/overlay.component';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open<R = any, T = any>(content: string | TemplateRef<any> | Type<any>, preConfigs: any, data: T): MyOverlayRef<R> {
    const configs = this.getConfigs(preConfigs);
    const overlayRef = this.overlay.create(configs);

    const myOverlayRef = new MyOverlayRef<R, T>(overlayRef, content, data);

    overlayRef.attach( new ComponentPortal(
      OverlayComponent, null,
      this.createInjector(myOverlayRef, this.injector)
    ));

    return myOverlayRef;
  }

  createInjector(ref: MyOverlayRef, inj: Injector) {
    return new PortalInjector(inj, new WeakMap([[MyOverlayRef, ref]]));
  }

  private getConfigs(preConfigs: any): OverlayConfig {
    const configs = new OverlayConfig({
      hasBackdrop: true
    });
    if (preConfigs.backdropClass) {
      configs.backdropClass = preConfigs.backdropClass;
    }
    if (preConfigs.origin === 'global'){
      configs.positionStrategy =  this.overlay.position().global().centerVertically().centerHorizontally();
    } else if (preConfigs.origin instanceof HTMLElement) {
      configs.width = preConfigs.origin.offsetWidth;
      configs.scrollStrategy = this.overlay.scrollStrategies.reposition();
      configs.positionStrategy = this.getOverlayPosition(preConfigs.origin);
    }
    return configs;
  }

  private getOverlayPosition(origin: HTMLElement) {
    const positions = [
      new ConnectionPositionPair(
        { originX: 'start', originY: 'bottom' },
        { overlayX: 'start', overlayY: 'top' }
      )
    ];

    return this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(positions)
      .withFlexibleDimensions(false)
      .withPush(false);
  }
}
