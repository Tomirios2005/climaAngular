import { Component, OnInit } from '@angular/core';
import { CitySearchResult } from '../../interfaces/city.interface';
import { WeatherDisplay } from '../../interfaces/weather.interface';
import { WeatherService } from '../../services/weather.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  cities: CitySearchResult[] = [];
  currentWeather: WeatherDisplay | null = null;
  loading = false;
  error: string | null = null;
  myLocationCity: CitySearchResult | null = null;
  success: string | null = null;

  constructor(
    private weatherService: WeatherService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.getMyLocationWeather();
  }

   getMyLocationWeather() {
  if (!navigator.geolocation) {
    this.error = 'La geolocalización no está soportada por tu navegador.';
    this.loading = false;
    return;
  }
  this.loading = true;
  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      this.weatherService.getWeatherByCoordinates(lat, lon).subscribe({
        next: (weather) => {
          this.currentWeather = weather;
          this.loading = false;
          this.error = null;
          this.myLocationCity = {
            name: weather.city || 'Mi ubicación',
            country: '', // No disponible en WeatherDisplay
            state: '',   // No disponible en WeatherDisplay
            lat,
            lon
          };
        },
        error: () => {
          this.error = 'No se pudo obtener el clima de tu ubicación.';
          this.loading = false;
        }
      });
    },
    () => {
      this.error = 'No se pudo obtener tu ubicación.';
      this.loading = false;
    }
  );
}

  addMyLocationToFavorites() {
    if (this.myLocationCity) {
      this.favoritesService.addFavorite(
        this.myLocationCity.name,
        this.myLocationCity.lat,
        this.myLocationCity.lon
      ).subscribe({
        next: () => {
          this.success = `Ciudad "${this.myLocationCity?.name}" añadida a favoritos.`;
          this.error = null;
          setTimeout(() => this.success = null, 2000);
        },
        error: () => {
          this.error = 'No se pudo añadir la ciudad a favoritos.';
          setTimeout(() => this.error = null, 2000);
        }
      });
    }
  }

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