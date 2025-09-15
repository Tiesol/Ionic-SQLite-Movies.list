import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'add-update-movie',
    loadComponent: () => import('./add-update-movie/add-update-movie.component').then((m) => m.AddUpdateMovieComponent),
  },
  {
    path: 'add-update-movie/:id',
    loadComponent: () => import('./add-update-movie/add-update-movie.component').then((m) => m.AddUpdateMovieComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
