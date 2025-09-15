import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonButton, 
  IonInput, 
  IonItem, 
  IonLabel,
  IonCard, 
  IonCardHeader, 
  IonCardTitle,
  IonCardContent, 
  IonTextarea,
  IonImg,
  IonBackButton,
  IonButtons,
  IonSpinner
} from '@ionic/angular/standalone';
import { MovieRepository } from '../repository/movieRepository';
import { Movie } from '../models/movie.model';

@Component({
  selector: 'app-add-update-movie',
  templateUrl: './add-update-movie.component.html',
  styleUrls: ['./add-update-movie.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    IonButton, 
    IonInput, 
    IonItem, 
    IonLabel,
    IonCard, 
    IonCardHeader, 
    IonCardTitle,
    IonCardContent, 
    IonTextarea,
    IonImg,
    IonBackButton,
    IonButtons,
    IonSpinner
  ]
})
export class AddUpdateMovieComponent implements OnInit {
  private movieRepository = inject(MovieRepository);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  movieForm = {
    title: '',
    description: '',
    imageUrl: ''
  };

  isLoading = false;
  isEditing = false;
  movieId: number | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.movieId = Number(id);
      this.isEditing = true;
      this.loadMovieData();
    } else {
      this.isEditing = false;
      this.movieForm = {
        title: '',
        description: '',
        imageUrl: ''
      };
    }
  }

  async loadMovieData() {
    if (!this.movieId) return;
    
    try {
      this.isLoading = true;
      const movie = await this.movieRepository.findById(this.movieId);
      
      if (movie) {
        this.movieForm = {
          title: movie.title,
          description: movie.description,
          imageUrl: movie.imageUrl
        };
      } else {
        alert('Película no encontrada');
        this.goBack();
      }
    } catch (error) {
      console.error('Error loading movie:', error);
      alert('Error al cargar película');
      this.goBack();
    } finally {
      this.isLoading = false;
    }
  }

  async saveMovie() {
    if (!this.movieForm.title.trim() || !this.movieForm.description.trim()) {
      alert('Por favor completa título y descripción');
      return;
    }

    this.isLoading = true;

    try {
      if (this.isEditing && this.movieId) {
        await this.movieRepository.update(this.movieId, {
          title: this.movieForm.title.trim(),
          description: this.movieForm.description.trim(),
          imageUrl: this.movieForm.imageUrl.trim()
        });
        alert('Película actualizada exitosamente');
      } else {
        await this.movieRepository.create({
          title: this.movieForm.title.trim(),
          description: this.movieForm.description.trim(),
          imageUrl: this.movieForm.imageUrl.trim()
        });
        alert('Película creada exitosamente');
      }
      
      this.goBack();
    } catch (error) {
      console.error('Error saving movie:', error);
      alert('Error al guardar película');
    } finally {
      this.isLoading = false;
    }
  }

  async deleteMovie() {
    if (!this.isEditing || !this.movieId) return;
    
    const confirm = window.confirm(`¿Estás seguro de eliminar "${this.movieForm.title}"?`);
    if (!confirm) return;

    try {
      this.isLoading = true;
      await this.movieRepository.delete(this.movieId);
      alert('Película eliminada exitosamente');
      this.goBack();
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Error al eliminar película');
    } finally {
      this.isLoading = false;
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}