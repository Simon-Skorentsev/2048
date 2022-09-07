// Tile - это плитка, имеет value 2 4 8... и координаты, совпадающие с клеткой внутри которой находится (получит их при Cell.setTile())
export class Tile {
    private _tileElement: HTMLDivElement;
    private _x: number | undefined;
    private _y: number | undefined;
    private _value: number;

    //tileContainer - это div GameBoard -а
    constructor(tileContainer: HTMLDivElement, value = Math.random() > 0.5 ? 2 : 4) {
        this._tileElement = document.createElement("div");
        this._tileElement.classList.add("tile");
        tileContainer.append(this._tileElement);
        this.value = value;
    }

    get value() {
        return this._value;
    }

    //отвечает за значение, его цвет и цвет фона
    set value(v: number) {
        this._value = v;
        this._tileElement.textContent = v.toString();
        const power = Math.log2(v);

        //чем больше value, тем темнее фон. 9 тк 11*9 === 100, 11 тк 2^11 === 2048 => последняя
        const backgroundLightness = 100 - power * 9;
        this._tileElement.style.setProperty(
            "--background-lightness",
            `${backgroundLightness}%`
        );
        //при слишком темном фоне, цифру стоит сделать белой
        this._tileElement.style.setProperty(
            "--text-lightness",
            `${backgroundLightness >= 50 ? 10 : 90}%`
        );
    }

    set x(value: number) {
        this._x = value;
        this._tileElement.style.setProperty("--x", `${value}`);
    }

    set y(value: number) {
        this._y = value;
        this._tileElement.style.setProperty("--y", `${value}`);
    }

    remove() {
        this._tileElement.remove();
    }

    //дождется конца движения плитки. Или ее появления при true
    waitForTransition(animation = false): WaitAnimationPromise {
        return new Promise(resolve => {
            this._tileElement.addEventListener(
                animation ? "animationend" : "transitionend",
                resolve,
                {
                    once: true,
                }
            );
        });
    }
}

export type WaitAnimationPromise = Promise<TransitionEvent | AnimationEvent>;