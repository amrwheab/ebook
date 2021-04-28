import { Department } from './depart';

export class Book {
  id: string | undefined;
  name: string | undefined;
  imgUrl: string | undefined;
  info: string | undefined;
  auther: string | undefined;
  price: number | undefined;
  department: Department | undefined;
  buysNum: number | undefined;
  miniPath: string | undefined;
  fullPath: string | undefined;
  isFeatured: boolean | undefined;
}
