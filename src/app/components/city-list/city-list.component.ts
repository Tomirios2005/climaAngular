import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { CitySearchResult } from '../../interfaces/city.interface';
import { WeatherDisplay } from '../../interfaces/weather.interface';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.css'],
  standalone:false
})
export class CityListComponent {
  @Input() cities: CitySearchResult[] = [];
  @Output() weatherSelected = new EventEmitter<WeatherDisplay>();
  @Output() loadingChange = new EventEmitter<boolean>();
  @Output() errorChange = new EventEmitter<string | null>();

  constructor(private weatherService: WeatherService) {}

  selectCity(city: CitySearchResult) {
    this.loadingChange.emit(true);
    this.errorChange.emit(null);

    this.weatherService.getWeatherByCoordinates(city.lat, city.lon).subscribe({
      next: (weather) => {
        this.loadingChange.emit(false);
        this.weatherSelected.emit(weather);
      },
      error: (error) => {
        this.loadingChange.emit(false);
        this.errorChange.emit(error.message);
      }
    });
  }

  getCityDisplayName(city: CitySearchResult): string {
    let displayName = city.name;
    if (city.state) {
      displayName += `, ${city.state}`;
    }
    displayName += `, ${city.country}`;
    return displayName;
  }
}