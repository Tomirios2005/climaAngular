import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CiudadesFavoritasComponent } from './pages/ciudades-favoritas/ciudades-favoritas.component';
import { WeatherSearchComponent } from './components/weather-search/weather-search.component';
import { WeatherDisplayComponent } from './components/weather-display/weather-display.component';
import { CityListComponent } from './components/city-list/city-list.component';
import { WeatherService } from './services/weather.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CiudadesFavoritasComponent,
    WeatherSearchComponent,
    WeatherDisplayComponent,
    CityListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [WeatherService],
  bootstrap: [AppComponent]
})
export class AppModule { }