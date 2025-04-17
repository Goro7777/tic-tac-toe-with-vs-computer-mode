import { useState } from "react";

export default function Player({ initialName, symbol, ltr = true }) {
    const [playerName, setPlayerName] = useState(initialName);
    const [isEditing, setIsEditing] = useState(false);

    function handleEditClick() {
        setIsEditing((editingState) => !editingState);
    }

    function handleChange(event) {
        setPlayerName(event.target.value);
    }

    let editablePlayerName = <span className="player-name">{playerName}</span>;
    if (isEditing) {
        editablePlayerName = (
            <input
                type="text"
                required
                value={playerName}
                onChange={handleChange}
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
            {ltr ? (
                <span className="player">
                    {editButton}
                    {editablePlayerName}
                    {playerSymbol}
                </span>
            ) : (
                <span span className="player">
                    {playerSymbol}
                    {editablePlayerName}
                    {editButton}
                </span>
            )}
        </li>
    );
}
