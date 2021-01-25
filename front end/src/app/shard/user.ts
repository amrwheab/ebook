import { Book } from './book';

export class User {
  id: string;
  name: string;
  email: string;
  address: string;
  buyedBooks: Book[];
  isAdmin: boolean;
  cart: Book[];
  slug: string;
}
