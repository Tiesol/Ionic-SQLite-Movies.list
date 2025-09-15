import { inject, Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class Conn {
  public db!: SQLiteObject;
  private sqlite = inject(SQLite);
  private platform = inject(Platform);
  private isInitializing = false;
  private isDbReady = false;

  constructor() {
    this.initializingDB();
  }
  
  private async initializingDB() {
    if (this.isDbReady || this.isInitializing) return;

    this.isInitializing = true;
    await this.platform.ready();

    try {
      this.db = await this.sqlite.create({
        name: 'data.db',
        location: 'default'
      });
      await this.createTables();
      this.isDbReady = true;
    } catch (error) {
      console.error('Error initializing database', error);
    } finally {
      this.isInitializing = false;
    }
  }
  private async createTables() {
    try {
      const createTableMovies = `
        CREATE TABLE IF NOT EXISTS movies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          imageUrl TEXT NOT NULL
        )
      `;
      await this.db.executeSql(createTableMovies, []);
    } catch (error) {
      console.error('Error creating tables', error);
      throw error;
    }
  }

  async waitForDB(): Promise<void> {
    while (!this.isDbReady) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async executeQuery(statement: string, params: any[] = []): Promise<any> {
    await this.waitForDB();
    try {
      const result = await this.db.executeSql(statement, params);
      const data = [];
      for (let i = 0; i < result.rows.length; i++) {
        data.push(result.rows.item(i));
      }
      return data;
    } catch (error) {
      console.error('Error executing SQL', error);
      throw error;
    }
  }

  async executeNonQuery(statement: string, params: any[] = []): Promise<any> {
    await this.waitForDB();
    try {
      return await this.db.executeSql(statement, params);
    } catch (error) {
      console.error('Error executing SQL', error);
      throw error;
    }
  }
}
