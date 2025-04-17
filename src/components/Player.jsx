import { useRef } from "react";
import { useState } from "react";

export default function Player({ name, onUpdateName, symbol, rtl }) {
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef();

    function handleEditClick() {
        if (isEditing) {
            onUpdateName(symbol, inputRef.current.value);
        }
        setIsEditing((editingState) => !editingState);
    }

    let editablePlayerName = <span className="player-name">{name}</span>;
    if (isEditing) {
        editablePlayerName = (
            <input
                ref={inputRef}
                type="text"
                defaultValue={name}
                required
                maxLength={16}
            />
        );
    }

    let editButton = (
        <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit"}</button>
    );
    let playerSymbol = <span className="player-symbol">{symbol}</span>;

    return (
        <li>
            {rtl ? (
                <span className="player">
                    {editButton}
                    {editablePlayerName}
                    {playerSymbol}
                </span>
            ) : (
                <span className="player">
                    {playerSymbol}
                    {editablePlayerName}
                    {editButton}
                </span>
            )}
        </li>
    );
}
