import {AfterViewInit, Component, HostListener, OnInit, TemplateRef, Type} from '@angular/core';
import {MyOverlayRef} from '../my-overlay-ref';
import {ESCAPE} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent implements OnInit, AfterViewInit {
  contentType: 'template' | 'string' | 'component';
  content: string | TemplateRef<any> | Type<any>;
  context;

  constructor(private ref: MyOverlayRef) {
    // console.log(ref.data);
  }
  @HostListener('document:keydown', ['$event']) private handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.ref.close('escape key pressed');
    }
  }

  close() {
    console.log('overlay close()');
    this.ref.close(null);
  }

  ngOnInit() {
    this.content = this.ref.content;

    if (typeof this.content === 'string') {
      this.contentType = 'string';
    } else if (this.content instanceof TemplateRef) {
      this.contentType = 'template';
      this.context = {
          close: this.ref.close.bind(this.ref)
      };
    } else {
      this.contentType = 'component';
    }

  }

  ngAfterViewInit(): void {
    this.ref.afterInit$.next();
    this.ref.afterInit$.complete();
  }
}
