import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { MovieRepository } from '../repository/movieRepository';
import { Movie } from '../models/movie.model';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonFab,
  IonFabButton
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    IonFab,
    IonFabButton
  ],
})
export class HomePage implements OnInit, ViewWillEnter {
  private movieRepository = inject(MovieRepository);
  private router = inject(Router);
  
  movies: Movie[] = [];
  isLoading = true;
  error: string | null = null;

  async ngOnInit() {
    await this.loadMovies();
  }

  async ionViewWillEnter() {
    await this.loadMovies();
  }

  async loadMovies() {
    try {
      this.isLoading = true;
      this.error = null;
      this.movies = await this.movieRepository.findAll();
      console.log('Movies loaded:', this.movies);
    } catch (error) {
      console.error('Error loading movies:', error);
      this.error = 'No se pudieron cargar las películas';
    } finally {
      this.isLoading = false;
    }
  }

  async addTestMovies() {
    try {
      const testMovies = [
        {
          title: 'Avatar',
          description: 'Una épica aventura en el planeta Pandora',
          imageUrl: 'https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg'
        },
        {
          title: 'Titanic',
          description: 'Una historia de amor en el barco más famoso del mundo',
          imageUrl: 'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg'
        },
        {
          title: 'El Padrino',
          description: 'La saga familiar más poderosa del cine',
          imageUrl: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg'
        }
      ];

      for (const movie of testMovies) {
        await this.movieRepository.create(movie);
      }
      await this.loadMovies();
    } catch (error) {
      console.error('Error adding test movies:', error);
    }
  }

  viewMovieDetail(movie: Movie) {
    this.router.navigate(['/add-update-movie', movie.id]);
  }

  createNewMovie() {
    this.router.navigate(['/add-update-movie']);
  }
}