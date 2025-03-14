import { generalItem } from "./items";

export interface Book extends generalItem {
  id: string;
  name: string;
  author: string;
  description?: string;
  chapter: number;
  img?: string;
  cost: number;
  color?: string;
  rarity?: string;
  weight: number;
  deleteable?: boolean;
}

export interface BookStore {
  books: Book[];
  areBooksLoaded: boolean;
  setBooks: (book: Book[]) => void;
  addBook: (book: Book) => void;
  updateBook: (updatedBook: Book) => void;
}
