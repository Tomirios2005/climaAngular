import { Component, OnInit } from '@angular/core';
import { CitySearchResult } from '../../interfaces/city.interface';
import { WeatherDisplay } from '../../interfaces/weather.interface';
import { WeatherService } from '../../services/weather.service';
import { FavoritesService } from '../../services/favorites.service';
import { City } from '../../interfaces/city.interface';
import { FavoriteCity } from '../../services/favorites.service';


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
  selectedCity: CitySearchResult | null = null;
  favoriteCities: FavoriteCity[] = [];
  

  constructor(
    private weatherService: WeatherService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.getMyLocationWeather();
    this.loadFavorites();
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
            country: weather.country, // No disponible en WeatherDisplay
            state: '',   // No disponible en WeatherDisplay
            lat: lat,
            lon:lon
          };
          this.selectedCity = this.myLocationCity;

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
  loadFavorites() {
    this.favoritesService.getFavorites().subscribe({
      next: (favorites) => {
        this.favoriteCities = favorites;
      },
      error: () => {
        this.error = 'No se pudieron cargar los favoritos.';
      }
    });

  }
  areCoordinatesClose(lat1: number, lon1: number, lat2: number, lon2: number, tolerance = 0.01): boolean {
      return Math.abs(lat1 - lat2) <= tolerance && Math.abs(lon1 - lon2) <= tolerance;
  }
  isCityFavorite(city: CitySearchResult): boolean {
  return this.favoriteCities.some(fav =>
    fav.name === city.name &&  // opcional: comparar también por nombre
    this.areCoordinatesClose(fav.lat, fav.lon, city.lat, city.lon)
  );}


  onCitiesSearched(cities: CitySearchResult[]) {
    this.cities = cities;
    this.currentWeather = null;
    this.error = null;
  }

  onWeatherSelected(weather: WeatherDisplay) {
    this.currentWeather = weather;
    this.selectedCity = {
    name: weather.city,
    country: '', // si no tenés estos datos
    state: '',
    lat: weather.lat,
    lon: weather.lon
    }


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
  removeFavorite(city: City| CitySearchResult) {
  const ciudad = this.favoriteCities.find(fav =>
    fav.name === city.name &&this.areCoordinatesClose(fav.lat, fav.lon, city.lat, city.lon)
  );
  if (!ciudad || !ciudad.id) {
    this.error = 'No se encontró la ciudad en favoritos para eliminar.';
    return;
  }
  this.favoritesService.deleteFavorite(ciudad.id).subscribe({
    next: () => {
      this.success = `Ciudad "${city.name}" eliminada de favoritos.`;
      this.error = null;
      this.loadFavorites(); // actualizar lista
      setTimeout(() => this.success = null, 2000);
    },
    error: () => {
      this.error = 'No se pudo eliminar la ciudad de favoritos.';
      setTimeout(() => this.error = null, 2000);
    }
  });
}

  addToFavorites(city: City) {
    console.log('Añadiendo a favoritos:', city);
  this.favoritesService.addFavorite(city.name, city.lat, city.lon).subscribe({
    next: () => {
      this.success = `Ciudad "${city.name}" añadida a favoritos.`;
      this.error = null;
      setTimeout(() => this.success = null, 2000);
      this.loadFavorites(); // actualizar lista de favoritos
    },
    error: () => {
      this.error = `No se pudo añadir "${city.name}" a favoritos.`;
      setTimeout(() => this.error = null, 2000);
    }
  });

    
}
}