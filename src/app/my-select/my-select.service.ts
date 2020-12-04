import { Injectable } from '@angular/core';
import {SelectComponent} from './select/select.component';

@Injectable({
  providedIn: 'root'
})
export class MySelectService {

  private select: SelectComponent;
  constructor() { }

  public register(select: SelectComponent) {
    this.select = select;
  }

  public getSelect(): SelectComponent {
    return this.select;
  }
}
