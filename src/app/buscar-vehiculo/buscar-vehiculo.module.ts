import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { BuscarVehiculoPageRoutingModule } from './buscar-vehiculo-routing.module';
import { BuscarVehiculoPage } from './buscar-vehiculo.page';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuscarVehiculoPageRoutingModule,
    GoogleMapsModule //
  ],
  declarations: [BuscarVehiculoPage] //
})
export class BuscarVehiculoPageModule {}
