import axios from 'axios';
import { Book } from '../../stores/types/books';

export async function loadBook(selectedItem: Book) {
  try {
    const response = await axios.get(`/mocks/books/annotations-goblin-1.json`);
    
    return response.data;
  } catch (error) {
    console.error(`Error al cargar el libro "${selectedItem.name}":`, error);
    throw new Error(`No se pudo cargar el libro: ${error}`);
  }
}
