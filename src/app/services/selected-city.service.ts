// src/app/services/selected-city.service.ts
import { Injectable } from '@angular/core';
import { FavoriteCity } from './favorites.service';

@Injectable({
  providedIn: 'root'
})
export class SelectedCityService {
  private selectedCity: FavoriteCity | null = null;

  setCity(city: FavoriteCity) {
    this.selectedCity = city;
  }

  getCity(): FavoriteCity | null {
    return this.selectedCity;
  }

  clearCity() {
    this.selectedCity = null;
  }
}
