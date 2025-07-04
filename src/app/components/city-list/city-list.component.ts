import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { FavoritesService, FavoriteCity } from '../../services/favorites.service';
import { CitySearchResult } from '../../interfaces/city.interface';
import { WeatherDisplay } from '../../interfaces/weather.interface';


@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss'],
  standalone: false
})
export class CityListComponent implements OnInit {
  @Input() cities: CitySearchResult[] = [];
  @Output() weatherSelected = new EventEmitter<WeatherDisplay>();
  @Output() loadingChange = new EventEmitter<boolean>();
  @Output() errorChange = new EventEmitter<string | null>();

  success: string | null = null;
  error: string | null = null;
  favoriteCities: FavoriteCity[] = [];

  constructor(
    private weatherService: WeatherService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favoritesService.getFavorites().subscribe({
      next: (favorites) => {
        this.favoriteCities = favorites;
      },
      error: () => {
        this.favoriteCities = [];
      }
    });
  }

  isFavorite(city: CitySearchResult): FavoriteCity | undefined {
    return this.favoriteCities.find(
      fav => fav.name === city.name && fav.lat === city.lat && fav.lon === city.lon
    );
  }

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

  addToFavorites(city: CitySearchResult) {
  this.favoritesService.addFavorite(city.name, city.lat, city.lon).subscribe({
    next: () => {
      this.success = `Ciudad "${city.name}" añadida a favoritos.`;
      this.loadFavorites();
      setTimeout(() => this.success = null, 2000);
    },
    error: () => {
      this.error = 'No se pudo añadir la ciudad a favoritos.';
      setTimeout(() => this.error = null, 2000);
    }
  });
}
  removeFromFavorites(favorite: FavoriteCity) {
    if (!favorite.id) return;
    this.favoritesService.deleteFavorite(favorite.id).subscribe({
      next: () => {
        this.success = `Ciudad "${favorite.name}" eliminada de favoritos.`;
        this.loadFavorites();
        setTimeout(() => this.success = null, 2000);
      },
      error: () => {
        this.error = 'No se pudo eliminar la ciudad de favoritos.';
        setTimeout(() => this.error = null, 2000);
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

  trackCity(index: number, city: any) {
    return city.name + city.lat + city.lon;
  }
}