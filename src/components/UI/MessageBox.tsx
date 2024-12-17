import './MessageBox.css';
import '../UI/designRpg.css';
interface MessageBoxProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, type, onClose }) => {
  return (
    <div className={`message-box ${type}`}>
      <div className="message-content">
        <p>{message}</p>
        <button className="rpgui-button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
