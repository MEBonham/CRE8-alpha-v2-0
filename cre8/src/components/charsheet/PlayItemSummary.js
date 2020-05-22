import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
import indent from '../../media/indent-arrow.png';
import up from '../../media/triangle-button-up.png';
import down from '../../media/triangle-button-down.png';

const PlayItemSummary = ({ item, index, flattened }) => {
    const [, dispatch] = useContext(Store);

    const moveUp = (ev) => {
        ev.stopPropagation();
        dispatch({ type: "CHAR_EDIT", field: "swapInventorySpots", flattened, index, direction: "up" });
    }
    const moveDown = (ev) => {
        ev.stopPropagation();
        dispatch({ type: "CHAR_EDIT", field: "swapInventorySpots", flattened, index, direction: "down" });
    }

    return (
        <h4>
            <span className="name-qty">
                {item.contained ?
                    <img src={indent} alt="" /> :
                null}
                {item.name}
                {item.quantity > 1 ? ` (x${item.quantity})` : null}
            </span>
            <span className="bulk">Bulk: {item.bulk}</span>
            <span className="price">Price: {item.price}</span>
            <span className="up-down">
                <span>
                    {item.current_index !== 0 ?
                        <button onClick={moveUp}>
                            <img src={up} alt="up" />
                        </button> :
                    null}
                    {item.current_index + 1 < item.out_of ?
                        <button onClick={moveDown}>
                            <img src={down} alt="down" />
                        </button> :
                    null}
                </span>
            </span>
        </h4>
    );
}

export default PlayItemSummary;