import { Dispatch, SetStateAction} from "react";
import ButtonEdited from "../UI/ButtonEdited";

export default function ShopMenu ({buyOrSell, setBuyOrSell}: {buyOrSell:string, setBuyOrSell: Dispatch<SetStateAction<string>>}) {
    const buyOrSellChanger = () => {
      buyOrSell === 'Comprar' ? setBuyOrSell('Vender') : setBuyOrSell('Comprar');
    }
    return (
        <div className="rpgui-container framed-golden-2" style={{position: 'absolute', left: '40px', top: '40%'}}>
            <ButtonEdited
                  label={buyOrSell}
                  width="130px"
                  height="33px"
                  onClick={() =>
                    buyOrSellChanger()
                  }
                />
        </div>
    )
}