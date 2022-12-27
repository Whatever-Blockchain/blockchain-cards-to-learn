import { ContextProvider } from './context/ContextProvider';
import './solanaboard.css';
import SolanaHome from './SolanaHome';

export interface Menu {
    name: string;
}

function SolanaBoard({name}: Menu) {

    return (
        <div className="solanaboard">
            <ContextProvider>
                <SolanaHome name={name}/>
            </ContextProvider>
        </div>
    )
}

export default SolanaBoard;