import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { Observable } from 'rxjs';

/**
 * Guard para proteger rutas que requieren autenticación.
 * Redirige a /auth si el usuario no está autenticado.
 */
@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  /**
   * Servicio personalizado para interactuar con Firebase Auth.
   */
  private firebaseSvc = inject(FirebaseService);

  /**
   * Servicio de utilidades para navegación, toasts, etc.
   */
  private utilsSvc = inject(UtilsService);

  /**
   * Método que determina si una ruta puede activarse.
   *
   * @param route - Snapshot de la ruta actual.
   * @param state - Estado del router al momento de activación.
   * @returns Una promesa que resuelve a `true` si el usuario está autenticado, o `false` si no lo está.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    const user = localStorage.getItem('user');

    return new Promise((resolve) => {
      this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
        if (!auth) {
            resolve(true);
        } else {
          this.utilsSvc.routerLink('/main/home');
          resolve(false);
        }
      });
    });
  }
}
// Este guard se asegura de que el usuario no esté autenticado antes de permitir el acceso a ciertas rutas.
// Si el usuario está autenticado, lo redirige a la página principal.
