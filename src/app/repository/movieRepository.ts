import { Injectable } from '@angular/core';
import { Conn } from '../services/conn';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieRepository {
  private tableName = 'movies';

  constructor(private conn: Conn) {}

  // CRUD básico - esto es lo que realmente necesitas
  async create(movie: Omit<Movie, 'id'>): Promise<Movie> {
    const statement = `
      INSERT INTO ${this.tableName} (title, description, imageUrl)
      VALUES (?, ?, ?)
    `;
    
    try {
      const result = await this.conn.executeNonQuery(statement, [
        movie.title,
        movie.description,
        movie.imageUrl
      ]);
      
      return {
        id: result.insertId,
        ...movie
      };
    } catch (error) {
      console.error('Error creating movie', error);
      throw error;
    }
  }

  async findAll(): Promise<Movie[]> {
    const statement = `SELECT * FROM ${this.tableName} ORDER BY id DESC`;
    try {
      return await this.conn.executeQuery(statement);
    } catch (error) {
      console.error('Error fetching movies', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Movie | null> {
    const statement = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    try {
      const results = await this.conn.executeQuery(statement, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Error fetching movie by id', error);
      throw error;
    }
  }

  async update(id: number, movie: Partial<Omit<Movie, 'id'>>): Promise<Movie | null> {
    const fields = Object.keys(movie).map(key => `${key} = ?`).join(', ');
    const values = Object.values(movie);
    
    const statement = `UPDATE ${this.tableName} SET ${fields} WHERE id = ?`;
    
    try {
      await this.conn.executeNonQuery(statement, [...values, id]);
      return this.findById(id);
    } catch (error) {
      console.error('Error updating movie', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    const statement = `DELETE FROM ${this.tableName} WHERE id = ?`;
    try {
      const result = await this.conn.executeNonQuery(statement, [id]);
      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Error deleting movie', error);
      throw error;
    }
  }

  async searchByTitle(title: string): Promise<Movie[]> {
    const statement = `SELECT * FROM ${this.tableName} WHERE title LIKE ? ORDER BY title`;
    try {
      return await this.conn.executeQuery(statement, [`%${title}%`]);
    } catch (error) {
      console.error('Error searching movies', error);
      throw error;
    }
  }
}
