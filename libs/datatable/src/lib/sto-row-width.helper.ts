import { Injectable, signal } from '@angular/core';

@Injectable()
export class StoRowWidthHelper {
  currentRowWidth = signal<number>(0);
}
