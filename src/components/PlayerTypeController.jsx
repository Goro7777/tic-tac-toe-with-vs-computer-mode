export default function PlayerTypeController({
    onSwitchType,
    isComputer,
    highlight,
}) {
    return (
        <button className={highlight ? "highlight" : ""} onClick={onSwitchType}>
            Switch to <strong>{isComputer ? "human" : "computer"}</strong>{" "}
            player
        </button>
    );
}
