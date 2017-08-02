import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUpload } from '../../vendor/primeface/components/fileupload/fileupload';
import { StoMessagesModule } from '../sto-messages/sto-messages.component';
import { StoButtonModule } from '../sto-button/sto-button.directive';
import { StoSharedModule } from '../sto-shared/sto-shared';
import { StoProgressBarModule } from '../sto-progressbar/sto-progressbar.component';

@Component({
  selector: 'sto-fileUpload',
  templateUrl: './sto-fileupload.component.html',
  styleUrls: ['./sto-fileupload.component.scss']
})
export class StoFileUploadComponent extends FileUpload {
  upload() {

    if (!this.multiple && this.files.length > 1) {
      this.onError.emit({
        files: [],
        xhr: {
          statusText: 'Max 1 file',
          responseText: 'Max 1 file'
        }
      });
      this.files = [];
      return;
    }

    this.msgs = [];
    let xhr = new XMLHttpRequest(),
      formData = new FormData();

    this.onBeforeUpload.emit({
      'xhr': xhr,
      'formData': formData
    });

    for(let i = 0; i < this.files.length; i++) {
      formData.append(this.name, this.files[i], this.files[i].name);
    }

    xhr.upload.addEventListener('progress', (e: ProgressEvent) => {
      if(e.lengthComputable) {
        this.progress = Math.round((e.loaded * 100) / e.total);
      }
    }, false);

    xhr.onreadystatechange = () => {
      if(xhr.readyState == 4) {
        this.progress = 0;

        if(xhr.status >= 200 && xhr.status < 300)
          this.onUpload.emit({xhr: xhr, files: this.files});
        else
          this.onError.emit({xhr: xhr, files: this.files});

        this.clear();
      }
    };

    xhr.open('POST', this.url, true);

    this.onBeforeSend.emit({
      'xhr': xhr,
      'formData': formData
    });

    xhr.send(formData);
  }
}


@NgModule({
  imports: [CommonModule, StoButtonModule, StoMessagesModule, StoProgressBarModule, StoSharedModule, StoSharedModule],
  exports: [StoFileUploadComponent],
  declarations: [StoFileUploadComponent]
})
export class StoFileUploadModule {
}
