import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mystery } from '../models/mystery.model';
import { Observable } from 'rxjs';
import { MysteryInput } from '../models/mystery-input';

@Injectable({
  providedIn: 'root'
})
export class MysteryService {
  baseUrl: any = "/api/mystery";

  constructor(
    private http: HttpClient
  ) { }

  testService() {
    return this.http.get('/api/mystery/test');
  }
  
  createMystery(mystery: Mystery): Observable<Mystery> {

    return this.http.post<Mystery>(`${this.baseUrl}/create`, mystery);

  }

  generateMystery(input: MysteryInput): Observable<Mystery> {
    return this.http.post<Mystery>(this.baseUrl + '/generate', input);
  }
}
