import { Auther } from './../shard/auther';
import { Book } from './../shard/book';
import { BooksService } from './../services/books.service';
import { AutherService } from './../services/auther.service';
import { DepartmentService } from './../services/department.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Carousel } from './../shard/carousel';
import { Subscription } from 'rxjs';
import { CarouselService } from './../services/carousel.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Department } from '../shard/depart';

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

  action: string[] = [];
  bookOps: Subscription | undefined;
  books: Book[] = [];
  departOps: Subscription | undefined;
  department: Department[] = [];
  autherOps: Subscription | undefined;
  auther: Auther[] = [];

  carouselForm = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    content: new FormControl(null, [Validators.required]),
    carouselImg: new FormControl(null),
    dist: new FormControl(null, [Validators.required]),
    actionSelect: new FormControl(null, [Validators.required]),
  });

  constructor(private carouselSer: CarouselService,
              private message: NzMessageService,
              private departSer: DepartmentService,
              private autherSer: AutherService,
              private bookSer: BooksService) { }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
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
    if (this.departOps) {
      this.departOps.unsubscribe();
    }
    if (this.autherOps) {
      this.autherOps.unsubscribe();
    }
    if (this.bookOps) {
      this.bookOps.unsubscribe();
    }
  }

  generatingValues(): void {
    const actionArr: any = this.carousel.find(ele => ele.id === this.selectedCarouselValue)?.action?.split('/');
    this.carouselForm.patchValue({
      title: this.carousel.find(ele => ele.id === this.selectedCarouselValue)?.title,
      content: this.carousel.find(ele => ele.id === this.selectedCarouselValue)?.content,
      dist: actionArr[0],
      actionSelect: actionArr[1]
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
    // tslint:disable-next-line: no-non-null-assertion
    const selectedDeletingCarousel = this.selectedDeletingCarousel!;
    // tslint:disable-next-line: deprecation
    this.carouselSer.deleteCarousel(selectedDeletingCarousel).subscribe(() => {
      this.message.remove(id);
      this.message.success('deleted successfully');
      this.carousel = this.carousel.filter(ele => ele.id !== this.selectedDeletingCarousel);
      this.deleteVisable = false;
    }, err => {
      this.message.remove(id);
      this.message.error(err.error);
    });
  }

  inputDist(): void {
    const value = this.carouselForm.value.dist;
    if (value === '/departments') {
      this.departOps = this.departSer.getDeparts().subscribe(departs => this.department = departs);
    } else if (value === '/authors') {
      this.autherOps = this.autherSer.getAuthers('1', '').subscribe(authers => this.auther = authers.authers);
    } else {
      this.bookOps = this.bookSer.getBooks(1, '', '10').subscribe(books => this.books = books);
    }
  }

  autherSearch(search: string): void {
    if (search) {
      this.autherOps = this.autherSer.getAuthers('1', search).subscribe(authers => this.auther = authers.authers);
    }
  }

  bookSearch(search: string): void {
    if (search) {
      this.bookOps = this.bookSer.getBooks(1, search, '10').subscribe(books => this.books = books);
    }
  }

  onSubmit(): void {
    const action = this.carouselForm.value.dist + '/' + this.carouselForm.value.actionSelect;
    if (this.updateMode) {
      const formData = new FormData();

      // tslint:disable-next-line: no-non-null-assertion
      formData.append('id', this.selectedCarouselValue!);
      formData.append('title', this.carouselForm.value.title);
      formData.append('content', this.carouselForm.value.content);
      if (this.carouselForm.value.carouselImg) {
        formData.append('carouselImg', this.carouselForm.value.carouselImg);
      }
      formData.append('action', action);

      const id  = this.message.loading('Action in progress').messageId;
      // tslint:disable-next-line: deprecation
      this.carouselSer.updateCarousel(formData).subscribe(() => {
        this.message.remove(id);
        this.message.success('Updated successfully');
        // tslint:disable-next-line: no-non-null-assertion
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
        formData.append('action', action);

        const id  = this.message.loading('Action in progress').messageId;
        // tslint:disable-next-line: deprecation
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
