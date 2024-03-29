import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  redirectTo: string | undefined;

  signupForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    confirmPassword: new FormControl(''),
    address: new FormControl('', [
      Validators.required
    ])
  });

  constructor(private authSer: AuthService,
              private message: NzMessageService,
              private router: Router,
              private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.redirectTo = this.actRoute.snapshot.queryParams.redirectTo;
  }

  goToLogin(): void {
    if (this.redirectTo) {
      this.router.navigate(['/login'], {queryParams: {redirectTo: this.redirectTo}});
    } else {
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      // tslint:disable-next-line: forin
      for (const i in this.signupForm.controls) {
        this.signupForm.controls[i].markAsDirty();
        this.signupForm.controls[i].updateValueAndValidity();
      }
    } else {
      const newUser = {
        name: this.signupForm.value.name,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        address: this.signupForm.value.address,
      };
      const id = this.message.loading('Action in progress').messageId;
      this.authSer.signupUser(newUser).subscribe(data => {
        this.signupForm.reset();
        this.message.remove(id);
        localStorage.setItem('token', data.token);
        const navigate = this.redirectTo ? `/books/${this.redirectTo}` : '/';
        this.router.navigate([navigate]).then(() => {
          location.reload();
        });
      }, err => {
        this.message.remove(id);
        this.message.error(err.error);
      });
    }
  }


}
