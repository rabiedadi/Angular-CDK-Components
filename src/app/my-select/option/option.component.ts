import {AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SelectComponent} from '../select/select.component';
import {MySelectService} from '../my-select.service';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css']
})
export class OptionComponent implements AfterViewInit {
  @Input()
  value: number;
  @Input()
  content: number;
  @Input()
  hovered: boolean;
  @Input()
  selected: boolean;
  @ViewChild('content') contentElement: ElementRef;


  private parentSelect: SelectComponent;
  constructor(private mySelectService: MySelectService) {
    this.parentSelect = mySelectService.getSelect();
  }

  ngAfterViewInit(): void {
  }

  select() {
    console.log(this.value);
    this.parentSelect.optionSelected(this.parentSelect.optionsRefsArray.indexOf(this));
  }
  getContent(): string {
    return this.content ? this.content : this.contentElement.nativeElement.textContent;
  }
}
