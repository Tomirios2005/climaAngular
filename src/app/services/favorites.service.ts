import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, of } from 'rxjs';
import { throwError } from 'rxjs';


export interface FavoriteCity {
  id?: string;
  name: string;
  user: string;
  lat: number;
  lon: number;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'https://6866af9789803950dbb3941c.mockapi.io/api/ciudades/cities';

  constructor(private http: HttpClient) {}

  private getUserToken(): string {
  let match = document.cookie.match(new RegExp('(^| )userToken=([^;]+)'));
  let token = match ? match[2] : null;
  if (!token) {
    // Genera un token aleatorio simple
    token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    document.cookie = `userToken=${token}; path=/; max-age=31536000`; // 1 año
  }
  return token;
}

  getFavorites(): Observable<FavoriteCity[]> {
  const user = this.getUserToken();
  return this.http.get<FavoriteCity[]>(`${this.apiUrl}?user=${user}`).pipe(
    catchError((err) => {
      // Si el error es por "no encontrado", devolvemos un array vacío
      if (err.status === 404) {
        return of([]);
      }

      // Si es otro tipo de error, propagamos el mensaje
      return throwError(() => err);
    })
  );
}


  addFavorite(name: string, lat:number, lon:number): Observable<FavoriteCity> {
    const user = this.getUserToken();
    return this.http.post<FavoriteCity>(this.apiUrl, { name, user, lat, lon });
  }

  deleteFavorite(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}