import { FormsModule } from '@angular/forms';
import { ZoroModule } from './../zoro/zoro.module';
import { RouterModule } from '@angular/router';
import { BookcardComponent } from './../bookcard/bookcard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [BookcardComponent],
  imports: [
    CommonModule,
    RouterModule,
    ZoroModule,
    FormsModule
  ],
  exports: [
    BookcardComponent
  ]
})
export class BookmodModule { }
