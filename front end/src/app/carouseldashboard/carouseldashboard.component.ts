import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Carousel } from './../shard/carousel';
import { Subscription } from 'rxjs';
import { CarouselService } from './../services/carousel.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-carouseldashboard',
  templateUrl: './carouseldashboard.component.html',
  styleUrls: ['./carouseldashboard.component.scss']
})
export class CarouseldashboardComponent implements OnInit, OnDestroy {

  carouselObs: Subscription | undefined;
  carousel: Carousel[] = [];
  loadedCar = false;
  modifyVisable = false;
  updateMode = false;
  updateModeHelper = false;
  selectedCarouselValue: string | undefined;
  imageUpload = null;
  deleteVisable = false;
  selectedDeletingCarousel: string | undefined;
  carouselForm = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    content: new FormControl(null, [Validators.required]),
    carouselImg: new FormControl(null),
  });

  constructor(private carouselSer: CarouselService,
              private message: NzMessageService) { }

  ngOnInit(): void {
    this.carouselObs = this.carouselSer.getCarousel().subscribe((carousel: Carousel[]) => {
      this.carousel = carousel;
      this.loadedCar = true;
    }, err => {
      this.message.error(err.error);
      this.loadedCar = true;
    });
  }

  ngOnDestroy(): void {
    if (this.carouselObs) {
      this.carouselObs.unsubscribe();
    }
  }

  generatingValues(): void {
    this.carouselForm.patchValue({
      title: this.carousel.find(ele => ele.id === this.selectedCarouselValue)?.title,
      content: this.carousel.find(ele => ele.id === this.selectedCarouselValue)?.content
    });

    this.updateModeHelper = true;
  }

  onFileChange(event: any): void {
    if (event.target.files[0]) {
      this.carouselForm.patchValue({
        carouselImg: event.target.files[0]
      });
    }
  }

  deleteCarousel(): void {
    const id  = this.message.loading('Action in progress').messageId;
    this.carouselSer.deleteCarousel(this.selectedDeletingCarousel!).subscribe(() => {
      this.message.remove(id);
      this.message.success('deleted successfully');
      this.carousel = this.carousel.filter(ele => ele.id !== this.selectedDeletingCarousel);
      this.deleteVisable = false;
    }, err => {
      this.message.remove(id);
      this.message.error(err.error);
    });
  }

  onSubmit(): void {
    if (this.updateMode) {
      const formData = new FormData();

      formData.append('id', this.selectedCarouselValue!);
      formData.append('title', this.carouselForm.value.title);
      formData.append('content', this.carouselForm.value.content);
      if (this.carouselForm.value.carouselImg) {
        formData.append('carouselImg', this.carouselForm.value.carouselImg);
      }

      const id  = this.message.loading('Action in progress').messageId;
      this.carouselSer.updateCarousel(formData).subscribe(() => {
        this.message.remove(id);
        this.message.success('Updated successfully');
        const selectedCar = this.carousel.find(ele => ele.id === this.selectedCarouselValue)!;
        selectedCar.title = this.carouselForm.value.title;
        selectedCar.content = this.carouselForm.value.content;
        this.modifyVisable = false;
      }, err => {
        this.message.remove(id);
        this.message.error(err.error);
      });
    } else {
      if (this.carouselForm.value.carouselImg) {
        const formData = new FormData();

        formData.append('title', this.carouselForm.value.title);
        formData.append('content', this.carouselForm.value.content);
        formData.append('carouselImg', this.carouselForm.value.carouselImg);

        const id  = this.message.loading('Action in progress').messageId;
        this.carouselSer.addCarousel(formData).subscribe((carousel: Carousel) => {
          this.message.remove(id);
          this.message.success('Added successfully');
          this.carousel.push(carousel);
          this.modifyVisable = false;
        }, err => {
          this.message.remove(id);
          this.message.error(err.error);
        });
      } else {
        this.message.error('Image is required');
      }
    }
  }

}
