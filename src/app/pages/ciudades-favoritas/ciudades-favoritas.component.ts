import { Router } from '@angular/router';
import { SelectedCityService } from '../../services/selected-city.service';
import {
  FavoriteCity,
  FavoritesService,
} from '../../services/favorites.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-ciudades-favoritas',
  templateUrl: './ciudades-favoritas.component.html',
  styleUrls: ['./ciudades-favoritas.component.scss'],
  standalone: false,
})
export class CiudadesFavoritasComponent implements OnInit {
  @Output() favoriteSelected = new EventEmitter<FavoriteCity>();

  favoriteCities: FavoriteCity[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private favoritesService: FavoritesService,
    private selectedCityService: SelectedCityService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }
  verClima(city: FavoriteCity) {
  this.selectedCityService.setCity(city);
  this.router.navigate(['/home']);
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
      },
    });
  }
  deleteFavorite(city: FavoriteCity | null) {
    if (!city || !city.id) {
      this.error = 'Ciudad no válida.';
      return;
    }
    this.loading = true;
    this.favoritesService.deleteFavorite(city.id).subscribe({
      next: () => {
        this.favoriteCities = this.favoriteCities.filter(
          (fav) => fav.id !== city.id
        );
        this.success = 'Ciudad eliminada de favoritos.';
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo eliminar la ciudad de favoritos.';
        this.loading = false;
      },
    });
  }
}
