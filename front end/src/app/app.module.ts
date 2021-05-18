import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthorsModule } from './authors/authors.module';
import { DepartmentsmodModule } from './departmentsmod/departmentsmod.module';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboardmod/dashboard.module';
import { ZoroModule } from './zoro/zoro.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import en from '@angular/common/locales/en';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { MycarouselComponent } from './mycarousel/mycarousel.component';
import { BookComponent } from './book/book.component';
import { CartComponent } from './cart/cart.component';
import { NgxStripeModule } from 'ngx-stripe';
import { StripeComponent } from './stripe/stripe.component';
import { BuysComponent } from './buys/buys.component';
import { SearchComponent } from './search/search.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MycarouselComponent,
    BookComponent,
    CartComponent,
    StripeComponent,
    BuysComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DashboardModule,
    ZoroModule,
    AuthModule,
    DepartmentsmodModule,
    AuthorsModule,
    NgxStripeModule.forRoot('pk_test_51IAtnlKMAtDRnFQfeMLEaqLtzwx7w6lMmQfYab9sTkDUrXttEalyvJVWq4OFSb1Okz4FerdT2QIJMOmCOKnC4ECX00nlQPfzTu'),
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
