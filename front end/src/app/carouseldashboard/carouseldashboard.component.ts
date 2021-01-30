import { NzMessageService } from 'ng-zorro-antd/message';
import { Carousel } from './../shard/carousel';
import { Subscription } from 'rxjs';
import { CarouselService } from './../services/carousel.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-carouseldashboard',
  templateUrl: './carouseldashboard.component.html',
  styleUrls: ['./carouseldashboard.component.scss']
})
export class CarouseldashboardComponent implements OnInit, OnDestroy {

  carouselObs: Subscription;
  carousel: Carousel[] = [];

  constructor(private carouselSer: CarouselService, private message: NzMessageService) { }

  ngOnInit(): void {
    this.carouselObs = this.carouselSer.getCarousel().subscribe((carousel: Carousel[]) => {
      this.carousel = carousel;
    }, err => {
      this.message.error(err.error);
    });
  }

  ngOnDestroy(): void {
    if (this.carouselObs) {
      this.carouselObs.unsubscribe();
    }
  }

}
