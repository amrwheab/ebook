import { BookComponent } from './book/book.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardGuard } from './guards/dashboard.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'dashboard', loadChildren: './dashboardmod/dashboard.module#DashboardModule', canActivate: [DashboardGuard]},
  {path: 'auth', loadChildren: './auth/auth.module#AuthModule', canActivate: [AuthGuard]},
  {path: 'departments', loadChildren: './departmentsmod/departmentsmod.module#DepartmentsmodModule'},
  {path: 'authors', loadChildren: './authors/authors.module#AuthorsModule'},
  {path: 'books/:slug', component: BookComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
