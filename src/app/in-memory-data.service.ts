import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Character } from './character';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const characters = [
      { id: 1, name: 'Valer' },
      { id: 2, name: 'Dana' },
      { id: 3, name: 'Madalina' },
      { id: 4, name: 'Daniel' },
      { id: 5, name: 'Bogdan' },
      { id: 6, name: 'Florin' },
      { id: 7, name: 'Mihai' },
      { id: 8, name: 'Adrian' },
      { id: 9, name: 'Loredana' },
      { id: 10, name: 'Dumitru' }
    ];
    return {characters};
  }
   // Overrides the genId method to ensure that a character always has an id.
  // If the characters array is empty,
  // the method below returns the initial number (1).
  // if the characters array is not empty, the method below returns the highest
  // character id + 1.
  genId(characters: Character[]): number {
    return characters.length > 0 ? Math.max(...characters.map(character => character.id)) + 1 : 1;
  }
}
