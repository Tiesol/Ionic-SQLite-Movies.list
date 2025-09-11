import { Component, OnInit } from '@angular/core';
import { MovieRepository } from '../repository/movieRepository';
import { Movie } from '../models/movie.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton, IonInput, IonItem, IonLabel,
  IonList, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonImg, IonSearchbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButton, IonInput, IonItem, IonLabel,
    IonList, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonImg, IonSearchbar
  ]
})
export class MoviesPage implements OnInit {
  movies: Movie[] = [];
  searchTerm: string = '';
  
  // Datos para crear nueva película
  newMovie = {
    title: '',
    description: '',
    imageUrl: ''
  };

  constructor(private movieRepository: MovieRepository) {}

  async ngOnInit() {
    await this.loadMovies();
  }

  // Cargar todas las películas
  async loadMovies() {
    try {
      this.movies = await this.movieRepository.findAll();
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  }

  // Crear película
  async createMovie() {
    if (!this.newMovie.title.trim() || !this.newMovie.description.trim()) {
      alert('Por favor completa título y descripción');
      return;
    }

    try {
      await this.movieRepository.create(this.newMovie);
      
      // Limpiar formulario
      this.newMovie = { title: '', description: '', imageUrl: '' };
      
      // Recargar lista
      await this.loadMovies();
      
      alert('Película creada exitosamente');
    } catch (error) {
      console.error('Error creating movie:', error);
      alert('Error al crear película');
    }
  }

  // Eliminar película
  async deleteMovie(id: number) {
    const confirm = window.confirm('¿Estás seguro de eliminar esta película?');
    if (!confirm) return;

    try {
      await this.movieRepository.delete(id);
      await this.loadMovies();
      alert('Película eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Error al eliminar película');
    }
  }

  // Buscar películas
  async searchMovies(event: any) {
    const searchTerm = event.target.value;
    
    if (!searchTerm.trim()) {
      await this.loadMovies();
      return;
    }

    try {
      this.movies = await this.movieRepository.searchByTitle(searchTerm);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  }
}