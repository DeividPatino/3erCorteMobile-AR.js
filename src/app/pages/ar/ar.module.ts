import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArPageRoutingModule } from './ar-routing.module';

import { ArPage } from './ar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArPageRoutingModule
  ],
  declarations: [ArPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ArPageModule {}
