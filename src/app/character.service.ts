import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Character } from './character';
/*
import { CHARACTERS } from './mock-characters';
*/
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})

export class CharacterService {
  // URL to web api
  private charactersUrl = 'api/characters';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /*Get characters from the server*/
  getCharacters (): Observable<Character[]> {
    return this.http.get<Character[]>(this.charactersUrl)
      .pipe(
        tap(_ => this.log('fetched characters')),
        catchError(this.handleError<Character[]>('getCharacters', []))
      );
  }

  /** GET character by id. Return `undefined` when id not found */
 getCharacterNo404<Data>(id: number): Observable<Character> {
   const url = `${this.charactersUrl}/?id=${id}`;
   return this.http.get<Character[]>(url)
     .pipe(
       map(characters => characters[0]), // returns a {0|1} element array
       tap(c => {
         const outcome = c ? `fetched` : `did not find`;
         this.log(`${outcome} character id=${id}`);
       }),
       catchError(this.handleError<Character>(`getCharacter id=${id}`))
     );
 }

  /** GET character by id. Will 404 if id not found */
  getCharacter(id: number): Observable<Character> {
    const url = `${this.charactersUrl}/${id}`;
    return this.http.get<Character>(url).pipe(
      tap(_ => this.log(`fetched character id=${id}`)),
      catchError(this.handleError<Character>(`getCharacter id=${id}`))
    );
  }



 /* GET character whose name contains search term */
 searchCharacters(term: string): Observable<Character[]> {
   if (!term.trim()) {
    // if not search term, return empty character array.
    return of([]);
   }
   return this.http.get<Character[]>(`${this.charactersUrl}/?name=${term}`).pipe(
     tap(_ => this.log(`found characters matching "${term}"`)),
     catchError(this.handleError<Character[]>('searchCharacters', []))
   );
 }



  /** POST: add a new character to the server */
  addCharacter (character: Character): Observable<Character> {
    return this.http.post<Character>(this.charactersUrl, character, this.httpOptions).pipe(
      tap((newCharacter: Character) => this.log(`added character w/ id=${newCharacter.id}`)),
      catchError(this.handleError<Character>('addCharacter'))
    );
  }

  /** DELETE: delete the character from the server */
  deleteCharacter (character: Character | number): Observable<Character> {
    const id = typeof character === 'number' ? character : character.id;
    const url = `${this.charactersUrl}/${id}`;

    return this.http.delete<Character>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted character id=${id}`)),
      catchError(this.handleError<Character>('deleteCharacter'))
    );
  }

  /** PUT: update the character on the server */
  updateCharacter (character: Character): Observable<any> {
    return this.http.put(this.charactersUrl, character, this.httpOptions).pipe(
      tap(_ => this.log(`updated character id=${character.id}`)),
      catchError(this.handleError<any>('updateCharacter'))
    );
  }


  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

     // TODO: send the error to remote logging infrastructure
     console.error(error); // log to console instead

     // TODO: better job of transforming error for user consumption
     this.log(`${operation} failed: ${error.message}`);

     // Let the app keep running by returning an empty result.
     return of(result as T);
    };
  }

  /** Log a CharacterService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`CharacterService: ${message}`);
  }
}
