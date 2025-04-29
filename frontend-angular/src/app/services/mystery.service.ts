import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mystery } from '../models/mystery.model';
import { Observable } from 'rxjs';
import { MysteryInput } from '../models/mysteryInput.model';

@Injectable({
  providedIn: 'root'
})
export class MysteryService {
  baseUrl: any = "/api/mystery";

  constructor(
    private http: HttpClient
  ) { }
  
  createMystery(mystery: Mystery): Observable<Mystery> {
    return this.http.post<Mystery>(`${this.baseUrl}/create`, mystery);
  }

  generateMystery(input: MysteryInput): Observable<Mystery> {
    return this.http.post<Mystery>(this.baseUrl + '/generate', input);
  }
}
