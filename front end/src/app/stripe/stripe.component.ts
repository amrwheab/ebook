import { BuyService } from './../services/buy.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StripeService } from 'ngx-stripe';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss']
})
export class StripeComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('buyPrice') buyPrice: number | undefined;
  // tslint:disable-next-line: no-input-rename
  @Input('buyBookIds') buyBookIds: string[] | undefined;
  // tslint:disable-next-line: no-output-rename
  @Output('closeBuy') closeBuy: EventEmitter<any> = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-native
  @Output() success: EventEmitter<any> = new EventEmitter<any>();

  element: any;
  card: any;

  stripeForm: FormGroup | undefined;
  constructor(private fb: FormBuilder,
              private stripeService: StripeService,
              private buySer: BuyService,
              private message: NzMessageService,
              private router: Router) { }

  ngOnInit(): void {
    this.stripeForm = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.startingStrip();
  }

  startingStrip(): void {
    // tslint:disable-next-line: deprecation
    this.stripeService.elements({locale: 'en'}).subscribe(elements => {
      this.element = elements;
      // Only mount the element the first time
      if (!this.card) {
        this.card = this.element.create('card', {
          style: {
            base: {
              iconColor: '#666EE8',
              color: '#31325F',
              lineHeight: '40px',
              fontWeight: 300,
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSize: '18px',
              '::placeholder': {
                color: '#CFD7E0'
              }
            }
          }
        });
        this.card.mount('#card-element');
      }
    });
  }

  buy(): void {
    const name = this.stripeForm?.get('name')?.value;
    const messageId = this.message.loading('action in progress').messageId;
    // tslint:disable-next-line: deprecation
    this.stripeService.createToken(this.card, { name }).subscribe(result => {
      if (result.token) {
        const userToken = localStorage.getItem('token');
        if (userToken) {
          const jwt = new JwtHelperService();
          // tslint:disable-next-line: no-non-null-assertion
          const userId = jwt.decodeToken(userToken!).id;
          if (userId) {
            // tslint:disable-next-line: no-non-null-assertion
            const bookIds = this.buyBookIds!;
            // tslint:disable-next-line: deprecation
            this.buySer.buyBook(result.token.id, userId, bookIds).subscribe(() => {
              this.message.remove(messageId);
              this.message.success('added successfully');
              this.closeBuy?.emit();
              this.success?.emit();
            }, err => {
              console.log(err);
              this.message.remove(messageId);
              this.message.error(err.error);
              this.closeBuy?.emit();
            });
          } else {
            this.router.navigate(['/login']);
          }
        } else {
          this.router.navigate(['/login']);
        }
      } else if (result.error) {
        this.message.remove(messageId);
        // tslint:disable-next-line: no-non-null-assertion
        this.message.error(result.error.message!);
        this.closeBuy?.emit();
      }
    });
  }

}
