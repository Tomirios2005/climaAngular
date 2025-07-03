import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';
import { CitySearchResult } from '../../interfaces/city.interface';
import { WeatherDisplay } from '../../interfaces/weather.interface';

@Component({
  selector: 'app-weather-search',
  templateUrl: './weather-search.component.html',
  styleUrls: ['./weather-search.component.css'],
  standalone: false
})
export class WeatherSearchComponent {
  @Output() citiesFound = new EventEmitter<CitySearchResult[]>();
  @Output() weatherFound = new EventEmitter<WeatherDisplay>();
  @Output() loadingChange = new EventEmitter<boolean>();
  @Output() errorChange = new EventEmitter<string | null>();

  searchForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private weatherService: WeatherService
  ) {
    this.searchForm = this.formBuilder.group({
      cityName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
  }

  onSubmit() {
    if (this.searchForm.valid) {
      const cityName = this.searchForm.get('cityName')?.value.trim();
      this.searchCities(cityName);
    }
  }

  searchCities(cityName: string) {
    this.loadingChange.emit(true);
    this.errorChange.emit(null);

    this.weatherService.searchCities(cityName).subscribe({
      next: (cities) => {
        this.loadingChange.emit(false);
        if (cities.length === 0) {
          this.errorChange.emit('No se encontraron ciudades con ese nombre');
        } else if (cities.length === 1) {
          // If only one city is found, get weather directly
          this.getWeatherForCity(cities[0]);
        } else {
          // Multiple cities found, let user choose
          this.citiesFound.emit(cities);
        }
      },
      error: (error) => {
        this.loadingChange.emit(false);
        this.errorChange.emit(error.message);
      }
    });
  }

  private getWeatherForCity(city: CitySearchResult) {
    this.loadingChange.emit(true);
    
    this.weatherService.getWeatherByCoordinates(city.lat, city.lon).subscribe({
      next: (weather) => {
        this.loadingChange.emit(false);
        this.weatherFound.emit(weather);
      },
      error: (error) => {
        this.loadingChange.emit(false);
        this.errorChange.emit(error.message);
      }
    });
  }

  get cityName() {
    return this.searchForm.get('cityName');
  }

  clearSearch() {
    this.searchForm.reset();
    this.citiesFound.emit([]);
    this.errorChange.emit(null);
  }
}