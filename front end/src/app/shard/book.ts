import { Auther } from './auther';
import { Department } from './depart';

export class Book {
  id: string | undefined;
  name: string | undefined;
  imgUrl: string | undefined;
  info: string | undefined;
  auther: Auther | undefined;
  price: number | undefined;
  department: Department | undefined;
  buysNum: number | undefined;
  miniPath: string | undefined;
  fullPath: string | undefined;
  isFeatured: boolean | undefined;
  rate: number | undefined;
  rateNum: number | undefined;
  slug: string | undefined;
}
