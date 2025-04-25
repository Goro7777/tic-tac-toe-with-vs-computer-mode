export default function PlayerTypeController({ onSwitchType, isComputer }) {
    return (
        <button onClick={onSwitchType}>
            Switch to <strong>{isComputer ? "human" : "computer"}</strong>{" "}
            player
        </button>
    );
}
