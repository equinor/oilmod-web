import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUpload } from '../../vendor/primeface/components/fileupload/fileupload';
import {MessagesModule} from '../../vendor/primeface/components/messages/messages';
import {ProgressBarModule} from '../../vendor/primeface/components/progressbar/progressbar';
import {PrimeTemplate,SharedModule} from '../../vendor/primeface/components/common/shared';
import { StoButtonModule } from '../sto-button/sto-button.component';

@Component({
  selector: 'sto-fileUpload',
  templateUrl: './sto-fileupload.component.html',
  styleUrls: ['./sto-fileupload.component.scss']
})
export class StoFileUploadComponent extends FileUpload {

}


@NgModule({
  imports: [CommonModule, StoButtonModule, MessagesModule, ProgressBarModule, SharedModule],
  exports: [StoFileUploadComponent],
  declarations: [StoFileUploadComponent]
})
export class StoFileUploadModule {
}
