import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  redirectTo: string | undefined;

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  constructor(private authSer: AuthService,
              private message: NzMessageService,
              private router: Router,
              private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.redirectTo = this.actRoute.snapshot.queryParams.redirectTo;
  }

  goToSignUp(): void {
    if (this.redirectTo) {
      this.router.navigate(['/signup'], {queryParams: {redirectTo: this.redirectTo}});
    } else {
      this.router.navigate(['/signup']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      // tslint:disable-next-line: forin
      for (const i in this.loginForm.controls) {
        this.loginForm.controls[i].markAsDirty();
        this.loginForm.controls[i].updateValueAndValidity();
      }
    } else {
      const id = this.message.loading('Action in progress...').messageId;
      this.authSer.loginUser(this.loginForm.value).subscribe(data => {
        this.message.remove(id);
        localStorage.setItem('token', data.token);
        const navigate = this.redirectTo ? `/books/${this.redirectTo}` : '/';
        this.router.navigate([navigate]).then(() => {
          location.reload();
        });
      }, err => {
        console.error(err);
        this.message.remove(id);
        this.message.error(err.error);
      });
    }
  }

}
