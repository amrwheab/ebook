import { environment } from './../environments/environment';
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
import { IconsProviderModule } from './icons-provider.module';
import { registerLocaleData } from '@angular/common';
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter(): string {
  return localStorage.getItem('token');
}

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    DashboardModule,
    ZoroModule,
    AuthModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: [environment.server],
        disallowedRoutes: [ environment.server + '/user/login',
                            environment.server + '/user/register',
                            environment.server + '/user/getuserfromtoken',
                            environment.server + '/departs/getdeparts',
                            environment.server + '/auther/getauthers'
                          ]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
