import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmService } from './sto-confirm-dialog.service';
import { ConfirmComponent } from './sto-confirm-dialog.component';


@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        ConfirmComponent
    ],
    providers: [
        ConfirmService
    ]
})
export class ConfirmModule {
}
