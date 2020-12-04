import {Component, TemplateRef} from '@angular/core';
import {OverlayService} from './my-overlay/overlay.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  index = 'Algeria';
  constructor(private overlayService: OverlayService) {}
  open(tpl: TemplateRef<any>) {
    const ref = this.overlayService.open(tpl, {origin: 'global', width: '300px'}, null);

    ref.afterClosed$.subscribe(res => {
      console.log(res);
    });
  }

  // constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) {}
  // @ViewChild('tpl') tpl: TemplateRef<any>;
  // openModal(modal: string, tpl?: TemplateRef<any>) {
  //   const config = new OverlayConfig();
  //
  //   config.positionStrategy = this.overlay.position().global().centerVertically().centerHorizontally();
  //   config.hasBackdrop = true;
  //
  //   const overlayRef = this.overlay.create(config);
  //   overlayRef.backdropClick().subscribe(() => overlayRef.dispose());
  //   switch (modal) {
  //     case 'tpl': this.openTemplateModal(overlayRef, tpl); break;
  //     case 'cmp': this.openComponentModal(overlayRef); break;
  //   }
  // }
  //
  // openTemplateModal(overlayRef: OverlayRef, tpl: TemplateRef<any>) {
  //   // Using TEMPLATE
  //   // overlayRef.attach(new TemplatePortal( this.tpl, this.viewContainerRef)); // method 1
  //   overlayRef.attach(new TemplatePortal( tpl, this.viewContainerRef));      // method 2
  // }
  //
  // openComponentModal(overlayRef: OverlayRef) {
  //   // Using Component
  //   // NB: used component should be added to entry-components in app.module.ts
  //   overlayRef.attach(new ComponentPortal(TestComponent, this.viewContainerRef));
  // }
  index2: any;
  gender: string = 'male';

}
