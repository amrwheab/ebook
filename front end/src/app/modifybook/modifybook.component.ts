import { Observable, Observer } from 'rxjs';
import { DepartmentService } from './../services/department.service';
import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-modifybook',
  templateUrl: './modifybook.component.html',
  styleUrls: ['./modifybook.component.scss']
})
export class ModifybookComponent implements OnInit {

  departments = [];

  constructor(private departSer: DepartmentService) { }

  ngOnInit(): void {
    this.departSer.getDeparts().subscribe(departs => {
      this.departments = departs;
    });
  }

  transformFile = (file: NzUploadFile) => {
    return new Observable((observer: Observer<Blob>) => {
      const reader = new FileReader();
      // tslint:disable-next-line:no-any
      reader.readAsDataURL(file as any);
      reader.onload = () => {
        const canvas = document.createElement('canvas');
        const img = document.createElement('img');
        img.src = reader.result as string;
        img.onload = () => {
          // tslint:disable-next-line: no-non-null-assertion
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          ctx.fillStyle = 'red';
          ctx.textBaseline = 'middle';
          ctx.fillText('Ant Design', 20, 20);
          canvas.toBlob(blob => {
            // tslint:disable-next-line: no-non-null-assertion
            observer.next(blob!);
            observer.complete();
          });
        };
      };
    });
  }

}
