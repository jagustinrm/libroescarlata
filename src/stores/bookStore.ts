import { create } from 'zustand';
import { Book, BookStore } from './types/books';

export const useBookStore = create<BookStore>((set) => ({
  books: [],
  areBooksLoaded: false,

  setBooks: (books: Book[]) =>
    set((state) => {
      if (!state.areBooksLoaded && books.length > 0) {
        return {
          books,
          areBooksLoaded: true,
        };
      }
      return state;
    }),

  addBook: (book: Book) =>
    set((state) => ({
      books: [...state.books, book],
    })),

  updateBook: (updatedBook: Book) =>
    set((state) => ({
      books: state.books.map((book) =>
        book.id === updatedBook.id ? { ...book, ...updatedBook } : book,
      ),
    })),
}));
