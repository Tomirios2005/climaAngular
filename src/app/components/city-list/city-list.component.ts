import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { CitySearchResult } from '../../interfaces/city.interface';
import { WeatherDisplay } from '../../interfaces/weather.interface';
import { City } from '../../interfaces/city.interface';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss'],
  standalone: false
})
export class CityListComponent {
  @Input() cities: CitySearchResult[] = [];
  @Input() selectedCity: CitySearchResult | null = null;
  @Output() weatherSelected = new EventEmitter<WeatherDisplay>();
  @Output() loadingChange = new EventEmitter<boolean>();
  @Output() errorChange = new EventEmitter<string | null>();


  success: string | null = null;
  error: string | null = null;

  constructor(
    private weatherService: WeatherService,
  ) {}
  selectCity(city: CitySearchResult) {
    this.loadingChange.emit(true);
    this.errorChange.emit(null);

    this.weatherService.getWeatherByCoordinates(city.lat, city.lon).subscribe({
      next: (weather) => {
        console.log('Weather data received:', weather);
        this.loadingChange.emit(false);
        this.weatherSelected.emit(weather);
      },
      error: (error) => {
        this.loadingChange.emit(false);
        this.errorChange.emit(error.message);
      }
    });
  }

  trackCity(index: number, city: any) {
    return city.name + city.lat + city.lon;
  }
}