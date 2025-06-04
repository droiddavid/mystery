import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Mystery } from '../models/mystery/mystery.model';

@Injectable({
  providedIn: 'root'
})
export class MysteryStoreService {
  private mysterySubject = new BehaviorSubject<Mystery | null>(null);

  setMystery(mystery: Mystery): void {
    this.mysterySubject.next(mystery);
  }

  getMystery(): Observable<Mystery | null> {
    return this.mysterySubject.asObservable();
  }

  getSnapshot(): Mystery | null {
    return this.mysterySubject.value;
  }

  clear(): void {
    this.mysterySubject.next(null);
  }
}
