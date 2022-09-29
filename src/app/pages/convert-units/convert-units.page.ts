import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-convert-units',
  templateUrl: './convert-units.page.html',
  styleUrls: ['./convert-units.page.scss'],
})
export class ConvertUnitsPage implements OnInit {

  valueOrigin = 0;
  valueFinal = 0;
  unitsSelected = 'Quintales';
  unitsToConver = 'Kilogramos';
  constructor() { }

  ngOnInit() {
  }
  onChange() {
    switch (this.unitsSelected) {
      case 'Quintales':
        switch (this.unitsToConver) {
          case 'Kilogramos':
            this.valueFinal = this.valueOrigin * 46.9093;
            break;
          case 'Gramos':
            this.valueFinal = this.valueOrigin * 4600.9093;
            break;
          case 'Toneladas':
            this.valueFinal = this.valueOrigin * 46.9093 / 1000;
            break;
          case 'Libras':
            this.valueFinal = this.valueOrigin * 100;
            break;
        }
        break;
      case 'Kilogramos':
        switch (this.unitsToConver) {
          case 'Quintales':
            this.valueFinal = this.valueOrigin / 46.9093;
            break;
          case 'Gramos':
            this.valueFinal = this.valueOrigin * 1000;
            break;
          case 'Toneladas':
            this.valueFinal = this.valueOrigin / 1000;
            break;
          case 'Libras':
            this.valueFinal = this.valueOrigin / 0.45359237;
            break;
        }
        break;
      case 'Gramos':
        switch (this.unitsToConver) {
          case 'Kilogramos':
            this.valueFinal = this.valueOrigin / 1000;
            break;
          case 'Quintales':
            this.valueFinal = this.valueOrigin / 45359.237;
            break;
          case 'Toneladas':
            this.valueFinal = this.valueOrigin / 1000000;
            break;
          case 'Libras':
            this.valueFinal = this.valueOrigin / 453.59237;
            break;
        }
        break;
      case 'Toneladas':
        switch (this.unitsToConver) {
          case 'Kilogramos':
            this.valueFinal = this.valueOrigin * 1000;
            break;
          case 'Gramos':
            this.valueFinal = this.valueOrigin * 1000000;
            break;
          case 'Quintales':
            this.valueFinal = this.valueOrigin * 1000 / 46.9093 ;
            break;
          case 'Libras':
            this.valueFinal = this.valueOrigin * 1000 / 0.45359237;
            break;
        }
        break;
      case 'Libras':
        switch (this.unitsToConver) {
          case 'Kilogramos':
            this.valueFinal = this.valueOrigin / 2.2046226218487757;
            break;
          case 'Gramos':
            this.valueFinal = this.valueOrigin * 453.59237;
            break;
          case 'Toneladas':
            this.valueFinal = this.valueOrigin / 2205;
            break;
          case 'Quintales':
            this.valueFinal = this.valueOrigin / 100;
            break;
        }
        break;
    }
  }

}
