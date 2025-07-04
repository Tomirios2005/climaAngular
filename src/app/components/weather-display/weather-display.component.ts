import { WeatherDisplay } from '../../interfaces/weather.interface';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { City } from '../../interfaces/city.interface';


@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.scss'],
  standalone:false
})
export class WeatherDisplayComponent {
  @Input() weather: WeatherDisplay | null = null;
  @Input() isFavorite: boolean = false;
  @Input() city: City | null = null;
  @Output() addFavoriteCity = new EventEmitter<City>();
  @Output() addFavorite = new EventEmitter<void>();
  @Output() removeFavorite = new EventEmitter<void>();


  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  getWindDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

  capitalizeDescription(description: string): string {
    return description.charAt(0).toUpperCase() + description.slice(1);
  }
  onAddToFavoritesClicked() {
  if (this.city) {
    this.addFavoriteCity.emit(this.city);
  }
}
}