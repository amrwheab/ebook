import { BookmodModule } from './../bookmod/bookmod.module';
import { FormsModule } from '@angular/forms';
import { ZoroModule } from './../zoro/zoro.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorsRoutingModule } from './authors-routing.module';
import { AuthorsComponent } from './authors.component';
import { AuthorvisitComponent } from '../authorvisit/authorvisit.component';



@NgModule({
  declarations: [AuthorsComponent, AuthorvisitComponent],
  imports: [
    CommonModule,
    AuthorsRoutingModule,
    ZoroModule,
    FormsModule,
    BookmodModule
  ]
})
export class AuthorsModule { }
