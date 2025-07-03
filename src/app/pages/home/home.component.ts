import { Component } from '@angular/core';
import { CitySearchResult } from '../../interfaces/city.interface';
import { WeatherDisplay } from '../../interfaces/weather.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone:false
})
export class HomeComponent {
  cities: CitySearchResult[] = [];
  currentWeather: WeatherDisplay | null = null;
  loading = false;
  error: string | null = null;

  onCitiesSearched(cities: CitySearchResult[]) {
    this.cities = cities;
    this.currentWeather = null;
    this.error = null;
  }

  onWeatherSelected(weather: WeatherDisplay) {
    this.currentWeather = weather;
    this.cities = [];
  }

  onLoadingChange(loading: boolean) {
    this.loading = loading;
  }

  onErrorChange(error: string | null) {
    this.error = error;
    if (error) {
      this.cities = [];
      this.currentWeather = null;
    }
  }
}