import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CarouselService } from './../services/carousel.service';
import { Carousel } from './../shard/carousel';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-mycarousel',
  templateUrl: './mycarousel.component.html',
  styleUrls: ['./mycarousel.component.scss']
})
export class MycarouselComponent implements OnInit, OnDestroy {

  pageSize: number | undefined;
  carPosition: number | undefined;
  carTran = '.5s ease-out;';
  mobileScreen: boolean | undefined;
  sliderIterv: number | undefined;
  carouselLoad = false;
  carouselObs: Subscription | undefined;

  gallery: Carousel[] = [];

  constructor(private carouselSer: CarouselService, private message: NzMessageService) { }

  ngOnInit(): void {

    this.carouselObs = this.carouselSer.getCarousel().subscribe((gallery: Carousel[]) => {
      this.carouselLoad = true;
      this.gallery = gallery;
    }, err => {
      this.carouselLoad = true;
      this.message.error(err.error);
    });

    if (window.innerWidth <= 576) {
      this.mobileScreen = true;
    }

    this.pageSize = window.innerWidth;
    this.carPosition = - this.pageSize;

    this.sliderIterv = window.setInterval(() => this.carRight(this.pageSize!), 10000);
  }

  ngOnDestroy(): void {
    if (this.carouselObs) {
      this.carouselObs.unsubscribe();
    }
  }


  carRight(w: number): void {
    // About Interval
    window.clearInterval(this.sliderIterv);

    // About Position
    if (this.carPosition === -w) {
      this.carPosition = 2 * (-w);
    } else {
      if (this.carPosition === -(this.gallery.length + 1) * w) {
        this.carPosition = -w;
        this.carTran = 'none';
        setTimeout(() => {
          this.carPosition! -= w;
          this.carTran = '.5s ease-out;';
        }, 0);
      } else {
        this.carPosition! -= w;
        this.carTran = '.5s ease-out;';
      }
    }

    this.sliderIterv = window.setInterval(() => this.carRight(this.pageSize!), 10000);
  }

  carLeft(w: number): void {
    // About Interval
    window.clearInterval(this.sliderIterv);

    // About Position
    if (this.carPosition === 0) {
      this.carTran = 'none';
      this.carPosition = -(this.gallery.length) * w;
      setTimeout(() => {
        this.carPosition! += w;
        this.carTran = '.5s ease-out;';
      }, 0);
    }else if (this.carPosition === -w) {
      this.carPosition = 0;
    }else {
      this.carPosition! += w;
    }

    this.sliderIterv = window.setInterval(() => this.carRight(this.pageSize!), 10000);
  }

  bulletClick(i: number): void {
    // About Interval
    window.clearInterval(this.sliderIterv);
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < this.gallery.length; j++) {

    }

    this.carPosition = -this.pageSize! * (i + 1);
    this.sliderIterv = window.setInterval(() => this.carRight(this.pageSize!), 10000);
  }


}
