import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mycarousel',
  templateUrl: './mycarousel.component.html',
  styleUrls: ['./mycarousel.component.scss']
})
export class MycarouselComponent implements OnInit {

  pageSize: number;
  carPosition: number;
  carTran = '.5s ease-out;';
  mobileScreen: boolean;
  sliderIterv: number;

  gallery = [
    {
      title: 'title 1',
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum fuga id eaque deleniti consequuntur. Consectetur, necessitatibus quo excepturi possimus',
      img: 'assets/lib1.jpg'
    },
    {
      title: 'title 2',
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum fuga id eaque deleniti consequuntur. Consectetur, necessitatibus quo excepturi possimus',
      img: 'assets/lib2.jpg'
    },
    {
      title: 'title 3',
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum fuga id eaque deleniti consequuntur. Consectetur, necessitatibus quo excepturi possimus',
      img: 'assets/lib3.jpg'
    },
  ];

  constructor() { }

  ngOnInit(): void {

    if (window.innerWidth <= 576) {
      this.mobileScreen = true;
    }

    this.pageSize = window.innerWidth;
    this.carPosition = - this.pageSize;

    this.sliderIterv = window.setInterval(() => this.carRight(this.pageSize), 10000);
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
          this.carPosition -= w;
          this.carTran = '.5s ease-out;';
        }, 0);
      } else {
        this.carPosition -= w;
        this.carTran = '.5s ease-out;';
      }
    }

    this.sliderIterv = window.setInterval(() => this.carRight(this.pageSize), 10000);
  }

  carLeft(w: number): void {
    // About Interval
    window.clearInterval(this.sliderIterv);

    // About Position
    if (this.carPosition === 0) {
      this.carTran = 'none';
      this.carPosition = -(this.gallery.length) * w;
      setTimeout(() => {
        this.carPosition += w;
        this.carTran = '.5s ease-out;';
      }, 0);
    }else if (this.carPosition === -w) {
      this.carPosition = 0;
    }else {
      this.carPosition += w;
    }

    this.sliderIterv = window.setInterval(() => this.carRight(this.pageSize), 10000);
  }

  bulletClick(i: number): void {
    // About Interval
    window.clearInterval(this.sliderIterv);
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < this.gallery.length; j++) {

    }

    this.carPosition = -this.pageSize * (i + 1);
    this.sliderIterv = window.setInterval(() => this.carRight(this.pageSize), 10000);
  }


}
