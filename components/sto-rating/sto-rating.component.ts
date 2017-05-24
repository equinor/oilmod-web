import { Component, forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Rating } from '../../vendor/primeface/components/rating/rating';

export const RATING_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StoRatingComponent),
    multi: true
};

@Component({
    selector: 'sto-rating',
    templateUrl: 'sto-rating.component.html',
    styleUrls: ['sto-rating.component.scss'],
    providers: [RATING_VALUE_ACCESSOR]
})
export class StoRatingComponent extends Rating {

}

@NgModule({
    imports: [CommonModule],
    exports: [StoRatingComponent],
    declarations: [StoRatingComponent]
})
export class StoRatingModule {
}