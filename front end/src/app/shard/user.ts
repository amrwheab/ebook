import { Book } from './book';

export class User {
  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  address: string | undefined;
  buyedBooks: Book[] | undefined;
  isAdmin: boolean | undefined;
  cart: Book[] | undefined;
  slug: string | undefined;
}
