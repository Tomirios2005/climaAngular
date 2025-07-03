import { Component } from '@angular/core';

@Component({
  selector: 'app-ciudades-favoritas',
  templateUrl: './ciudades-favoritas.component.html',
  styleUrls: ['./ciudades-favoritas.component.scss'],
  standalone:false
})
export class CiudadesFavoritasComponent {
  studentData = {
    name: 'Tomas Rios',
    email: 'tomirios2005@gmail.com',
    sede: 'Tandil'
  };



}