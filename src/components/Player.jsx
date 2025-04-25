import { useState, useRef } from "react";

export default function Player({
    name,
    symbol,
    reverseOrder,
    isActive,
    computerTypes,
    onUpdateName,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const ref = useRef();

    function handleEditClick() {
        if (isEditing) {
            onUpdateName(symbol, ref.current.value);
        }
        setIsEditing((editingState) => !editingState);
    }

    let editButton = (
        <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit"}</button>
    );

    let editablePlayerName = <span className="player-name">{name}</span>;
    if (isEditing) {
        editablePlayerName = computerTypes ? (
            <select ref={ref} defaultValue={name}>
                {computerTypes.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
        ) : (
            <input
                ref={ref}
                type="text"
                defaultValue={name}
                required
                maxLength={16}
            />
        );
    }

    let playerSymbol = <span className="player-symbol">{symbol}</span>;

    let classes = "player" + (reverseOrder ? " reverse-order" : "");
    return (
        <li className={isActive ? "active" : null}>
            <span className={classes}>
                {playerSymbol}
                {editablePlayerName}
                {editButton}
            </span>
        </li>
    );
}
