import { useNavigate } from "react-router-dom";

export default function BackButton () {
    const navigate = useNavigate();
    function handleBack() {
        navigate('/home')
    }
    return (
        <div>
            <button className="rpgui-button" onClick={() => handleBack()}>Volver</button>
        </div>
    )
}