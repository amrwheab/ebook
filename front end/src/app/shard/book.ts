import { Department } from './depart';

export class Book {
  id: string;
  name: string;
  imgUrl: string;
  info: string;
  auther: string;
  price: number;
  department: Department;
  buysNum: number;
  miniPath: string;
  fullPath: string;
  isFeatured: boolean;
}
