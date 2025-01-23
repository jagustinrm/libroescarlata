import { useEffect } from 'react';
import { useBookStore } from '../stores/bookStore'; // Importa el store de libros

const BooksLoader = () => {
  const { areBooksLoaded, setBooks } = useBookStore();

  useEffect(() => {
    if (!areBooksLoaded) {
      const loadBooks = async () => {
        try {
          const res = await fetch('/mocks/books.json'); // Ruta del archivo books.json
          const data = await res.json();
          setBooks(data); // Actualiza el estado global con los libros cargados
        } catch (error) {
          console.error('Error loading books:', error);
        }
      };

      loadBooks();
    }
  }, [areBooksLoaded, setBooks]);

  return null;
};

export default BooksLoader;
