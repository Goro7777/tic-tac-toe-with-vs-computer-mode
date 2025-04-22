import { useRef } from "react";
import { useState } from "react";

export default function Player({
    name,
    symbol,
    rtl,
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

    let editablePlayerName = <span className="player-name">{name}</span>;
    if (isEditing && !computerTypes) {
        editablePlayerName = (
            <input
                ref={ref}
                type="text"
                defaultValue={name}
                required
                maxLength={16}
            />
        );
    }
    if (isEditing && computerTypes) {
        editablePlayerName = (
            <select ref={ref} defaultValue={name}>
                {computerTypes.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
        );
    }

    let editButton = (
        <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit"}</button>
    );
    let playerSymbol = <span className="player-symbol">{symbol}</span>;

    return (
        <li className={isActive ? "active" : null}>
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
