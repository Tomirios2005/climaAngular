import { Component, OnInit } from '@angular/core';
import { FavoritesService, FavoriteCity } from '../../services/favorites.service';

@Component({
  selector: 'app-ciudades-favoritas',
  templateUrl: './ciudades-favoritas.component.html',
  styleUrls: ['./ciudades-favoritas.component.scss'],
  standalone: false
})
export class CiudadesFavoritasComponent implements OnInit {
  favoriteCities: FavoriteCity[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.loading = true;
    this.favoritesService.getFavorites().subscribe({
      next: (cities) => {
        this.favoriteCities = cities;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las ciudades favoritas.';
        this.loading = false;
      }
    });
  }

  addFavorite(cityName: string, lat: number, lon: number) {
    this.favoritesService.addFavorite(cityName, lat, lon).subscribe({
      next: (city) => {
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
}