import { AuthorvisitComponent } from './../authorvisit/authorvisit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorsComponent } from './authors.component';

const routes: Routes = [
  {path: '', component: AuthorsComponent},
  {path: ':slug', component: AuthorvisitComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorsRoutingModule { }
