import { useEffect, useState } from 'react';
import { Book } from '../../stores/types/books';
import ButtonEdited from '../UI/ButtonEdited';
import './Book.css';
import { loadBook } from './BookLoader';

interface ReadBookProps {
  selectedItem: Book;
  handleRead: () => void;
}

export default function ReadBook({ selectedItem, handleRead }: ReadBookProps) {
  const [bookData, setBookData] = useState<any>(null);
  useEffect(() => {
    async function fetchBook() {
      try {
        const data = await loadBook(selectedItem);
        setBookData(data[0]);
      } catch (error) {
        console.error('Error al cargar los datos del libro:', error);
      }
    }

    fetchBook();
  }, [selectedItem]);
  return (
    <div className="excerpt ">
      <div className="title__container">
        <h1 className="title__first bookH1">Fragmentos</h1>
        <h1 className="title__second bookH1">{selectedItem.name}</h1>
        <img
          className="flower"
          src="/img/enemies/goblin.png"
          alt="flower silhouette"
        />
        <h2 className="bookH2"> Por {selectedItem.author}</h2>
        <h3 className="bookH3">Capítulo {selectedItem.chapter}</h3>
      </div>
      <div className="text_container">
        {bookData && <p className="bookPgf">{bookData.text}</p>}
      </div>
      <div className="buttonBook">
        <ButtonEdited
          label="Salir"
          width="130px"
          height="40px"
          onClick={() => handleRead()}
        />
      </div>
    </div>
  );
}
