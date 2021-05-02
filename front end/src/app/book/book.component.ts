import { Book } from './../shard/book';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BooksService } from './../services/books.service';
import { environment } from './../../environments/environment';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import WebViewer from '@pdftron/webviewer';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  @ViewChild('viewer') viewer: ElementRef | undefined;

  book: Book | undefined;

  loaded = false;
  readMode = 'none';
  bookOps: Subscription | undefined;

  constructor(private bookSer: BooksService,
              private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const slug = this.actRoute.snapshot.params.slug;
    // tslint:disable-next-line: deprecation
    this.bookOps = this.bookSer.getBookBySlug(slug).subscribe(book => {
      this.book = book;
      this.loaded = true;
    }, err => {
      this.loaded = true;
      console.log(err);
    });
  }

  showBook(): void {
    this.readMode = 'block';
    WebViewer({
      path: environment.server + '/../assets/lib',
      initialDoc: this.book?.miniPath
    }, this.viewer?.nativeElement).then(instance => {
      console.log(instance);
    });
  }
}
