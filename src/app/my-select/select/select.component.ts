import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef, EventEmitter,
  forwardRef,
  HostListener, Output,
  QueryList,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {OverlayService} from '../../my-overlay/overlay.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MyOverlayRef} from '../../my-overlay/my-overlay-ref';
import {MySelectService} from '../my-select.service';
import {OptionComponent} from '../option/option.component';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    },
    MySelectService
  ]
})
export class SelectComponent implements ControlValueAccessor, AfterContentInit {
  @Output() blurEvent = new EventEmitter();
  @Output() focusEvent = new EventEmitter();
  @Output() changeEvent = new EventEmitter();
  @Output() openEvent = new EventEmitter();
  @Output() closeEvent = new EventEmitter();
  @Output() searchEvent = new EventEmitter<{ term: string, items: any[] }>();
  @Output() clearEvent = new EventEmitter();
  @Output() addEvent = new EventEmitter();
  @Output() removeEvent = new EventEmitter();
  @Output() scroll = new EventEmitter<{ start: number; end: number }>();
  @Output() scrollToEnd = new EventEmitter();
  disabled: boolean;
  optionsRefsArray: OptionComponent[];
  selectedOptionValue: string;
  selectedOptionIndex: number;
  hoveredOptionIndex: number;
  panelOpened = false;
  optionHeight: number;
  @ViewChild('panelTemplate') panelTemplate: TemplateRef<any>;
  @ViewChild('origin') origin: ElementRef;
  @ContentChildren(OptionComponent) private optionsRefs: QueryList<OptionComponent>;
  ref: MyOverlayRef;
  @HostListener('document:keydown', ['$event']) private handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      if (this.panelOpened) {
        this.ref.close({close: 'Tab key pressed'});
      }
    }
  }
  // output events

  constructor(
    private overlayService: OverlayService,
    private mySelectService: MySelectService
  ) {
    this.mySelectService.register(this);
  }

  openPanel() {
    if (this.optionsRefs.length) {
      this.ref = this.overlayService.open(this.panelTemplate, {
        origin: this.origin.nativeElement,
        backdropClass: 'cdk-overlay-transparent-backdrop'
      }, null);
      this.panelOpened = true;
      this.ref.afterClosed$.subscribe(_ => { this.panelOpened = false; });
      this.ref.afterInit$.pipe(take(1)).subscribe(_ => {
        if (this.optionsRefs.length < 5) {
          (document.getElementsByClassName('drop-down')[0] as HTMLElement).style.height = 35 * this.optionsRefsArray.length + 'px';
        }
        if (this.optionsRefs.length) {
          this.optionHeight = (document.getElementsByClassName('drop-down-option')[0] as HTMLElement).offsetHeight;
          this.scrollPanel();
        }
      });
    }
  }

  optionHovered(index) {
    this.optionsRefsArray[this.hoveredOptionIndex].hovered = false;
    this.optionsRefsArray[index].hovered = true;
    this.hoveredOptionIndex = index;
  }

  optionSelected(index) {
    if (this.panelOpened) {
      this.ref.close({close: 'item Selected'});
    }
    if (this.selectedOptionIndex !== undefined) {
      this.optionsRefsArray[this.selectedOptionIndex].selected = false;
    }
    this.selectedOptionIndex = index;
    this.hoveredOptionIndex = index;
    this.optionsRefsArray[index].selected = true;
    this.selectedOptionValue = this.optionsRefsArray[index].getContent();
    this.onInputChange(this.optionsRefsArray[this.selectedOptionIndex].value);
  }

  keyDown(key: string) {
    if (this.optionsRefs.length) {
      if (key === ' ' || key === 'Enter') {
        if (!this.panelOpened) {
          this.openPanel();
        } else {
          this.optionSelected(this.hoveredOptionIndex);
        }
      } else if (key === 'ArrowDown') {
        if (this.hoveredOptionIndex === this.optionsRefs.length - 1) {
          this.optionHovered(0);
        } else {
          this.optionHovered(this.hoveredOptionIndex + 1);
        }
        if (this.panelOpened) {
          this.scrollPanel();
        } else {
          this.optionSelected(this.hoveredOptionIndex);
        }
      } else if (key === 'ArrowUp') {
        if (this.hoveredOptionIndex === 0) {
          this.optionHovered(this.optionsRefs.length - 1);
        } else {
          this.optionHovered(this.hoveredOptionIndex - 1);
        }
        if (this.panelOpened) {
          this.scrollPanel();
        } else {
          this.optionSelected(this.hoveredOptionIndex);
        }
      }
    }
  }

  scrollPanel() {
    const dropDownPanel = document.getElementsByClassName('drop-down')[0] as HTMLElement;
    const panelScrollTop = dropDownPanel.scrollTop;
    const panelHeight = dropDownPanel.offsetHeight;

    if (this.hoveredOptionIndex * this.optionHeight < panelScrollTop) {
      dropDownPanel.scrollTop = this.hoveredOptionIndex * this.optionHeight;
    } else if (this.hoveredOptionIndex * this.optionHeight > panelScrollTop + panelHeight - this.optionHeight) {
      dropDownPanel.scrollTop = this.hoveredOptionIndex * this.optionHeight - panelHeight + this.optionHeight;
    }
  }

  ngAfterContentInit(): void {
    this.optionsRefsArray = this.optionsRefs.toArray();
    this.hoveredOptionIndex = 0;
    if (this.optionsRefs.length) {
      this.optionsRefs.first.hovered = true;
    }
  }

  // implements ControlValueAccessor methods
  onChanged: any = _ => {};
  onTouched: any = () => {};

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }
  onInputChange(value) { this.onChanged(value); }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  onInputTouche() {
    this.onTouched();
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(val): void {
    if (val) {
      this.optionsRefs.forEach((option, index) => {
        if (option.value === val) {
          option.selected = true;
          this.selectedOptionIndex = index;
          this.selectedOptionValue = option.getContent();
          return;
        }
      });
    }
  }


}
