export class Reset {
    private _resetElement: HTMLImageElement;

    constructor(callback: () => void) {
        this._resetElement = document.createElement("img");
        this._resetElement.classList.add("reset");
        this._resetElement.src = "https://www.freeiconspng.com/thumbs/reload-icon/arrow-refresh-reload-icon-29.png";
        this._resetElement.addEventListener("click", () => {
            this._resetElement.classList.add("spin");
            callback();
        });
        this._resetElement.addEventListener("transitionend", () => {
            this._resetElement.classList.remove("spin");
        });
        document.body.append(this._resetElement);
    }

}