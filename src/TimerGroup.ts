import { randomInt } from "crypto";
import { clearInterval } from "timers";

export class TimerGroup {
    protected _intervalId?: NodeJS.Timeout;

    public constructor(
        protected _commands: (() => void)[],
        protected readonly _delayMinutes: number,
        protected readonly _offsetMinutes: number = 0,
        protected readonly _randomizeCommands: boolean = false) {
    }

    public startTimer(): void {
        if (this._commands.length === 0) {
            return;
        }
        
        let currentIndex = 0;
        let intervalCommands = this._commands;
        if (this._randomizeCommands) {
            const orderedCommands = this._commands;
            const shuffledCommands = [];
            while (orderedCommands.length > 0) {
                const index = randomInt(orderedCommands.length);
                shuffledCommands.push(orderedCommands[index]);
                orderedCommands.splice(index, 1);
            }
            intervalCommands = shuffledCommands;
        }
        
        const delayMillis = this._offsetMinutes * 60 * 1000;
        setTimeout(() => {
            const intervalMillis = this._delayMinutes * 60 * 1000;
            this._intervalId = setInterval(() => {
                console.log(currentIndex);
                intervalCommands[currentIndex]();
                currentIndex = currentIndex === intervalCommands.length - 1
                    ? 0
                    : currentIndex + 1;
            }, intervalMillis);
        }, delayMillis);
    }

    public stopTimer(): void {
        if (this._intervalId) {
            clearInterval(this._intervalId);
        }
    }
}