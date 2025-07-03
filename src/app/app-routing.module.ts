import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CiudadesFavoritasComponent } from './pages/ciudades-favoritas/ciudades-favoritas.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'ciudades-favoritas', component: CiudadesFavoritasComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }