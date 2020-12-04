import { ConnectionPositionPair, Overlay, OverlayConfig,} from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, Injector, TemplateRef, Type } from '@angular/core';
import { MyOverlayRef } from './my-overlay-ref';
import { OverlayComponent } from './overlay/overlay.component';

interface Config {
  panelClass?: string | string[];
  /** Whether the overlay has a backdrop. */
  // hasBackdrop?: boolean;
  /** Custom class to add to the backdrop */
  backdropClass?: string | string[];
  /** The width of the overlay panel. If a number is provided, pixel units are assumed. */
  width?: number | string;
  /** The height of the overlay panel. If a number is provided, pixel units are assumed. */
  height?: number | string;
  /** The min-width of the overlay panel. If a number is provided, pixel units are assumed. */
  minWidth?: number | string;
  /** The min-height of the overlay panel. If a number is provided, pixel units are assumed. */
  minHeight?: number | string;
  /** The max-width of the overlay panel. If a number is provided, pixel units are assumed. */
  maxWidth?: number | string;
  /** The max-height of the overlay panel. If a number is provided, pixel units are assumed. */
  maxHeight?: number | string;
  /** --- */
  origin: 'global' | HTMLElement;
}

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open<R = any, T = any>(
    content: string | TemplateRef<any> | Type<any>,
    preConfigs: Config,
    data: T
  ): MyOverlayRef<R> {
    const configs = this.getConfigs(preConfigs);
    const overlayRef = this.overlay.create(configs);
    const myOverlayRef = new MyOverlayRef<R, T>(overlayRef, content, data);
    overlayRef.attach(
      new ComponentPortal(
        OverlayComponent,
        null,
        this.createInjector(myOverlayRef, this.injector)
      )
    );
    return myOverlayRef;
  }

  createInjector(ref: MyOverlayRef, inj: Injector) {
    return new PortalInjector(inj, new WeakMap([[MyOverlayRef, ref]]));
  }

  private getConfigs(preConfigs: Config): OverlayConfig {
    const configs = new OverlayConfig({ hasBackdrop: true });
    preConfigs.width && (configs.width = preConfigs.width);
    preConfigs.height && (configs.height = preConfigs.height);
    preConfigs.minWidth && (configs.minWidth = preConfigs.minWidth);
    preConfigs.maxWidth && (configs.maxWidth = preConfigs.maxWidth);
    preConfigs.minHeight && (configs.minHeight = preConfigs.minHeight);
    preConfigs.maxHeight && (configs.maxHeight = preConfigs.maxHeight);
    preConfigs.panelClass && (configs.panelClass = preConfigs.panelClass);
    preConfigs.backdropClass && (configs.backdropClass = preConfigs.backdropClass);
    if (preConfigs.origin === 'global') {
      configs.positionStrategy = this.overlay
        .position()
        .global()
        .centerVertically()
        .centerHorizontally();
    } else if (preConfigs.origin instanceof HTMLElement) {
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
      ),
    ];

    return this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(positions)
      .withFlexibleDimensions(false)
      .withPush(false);
  }
}
