import clamp from 'lodash/clamp';
//@ts-ignore
import DT from 'duration-time-conversion';

export default class Sub {
    start: number;
    end: number;
    text: string;
    text2?: string;

    constructor(obj: Partial<Sub>) {
        this.start = obj.start ?? 0;
        this.end = obj.end ?? 0;
        this.text = obj.text ?? "";
        this.text2 = obj.text2;
    }

    get check() {
        return this.startTime >= 0 && this.endTime >= 0 && this.startTime < this.endTime;
    }

    get clone(): Sub {
        return new Sub(this);
    }

    get startTime() {
        return DT.t2d(this.start);
    }

    set startTime(time) {
        this.start = DT.d2t(clamp(time, 0, Infinity));
    }

    get endTime() {
        return DT.t2d(this.end);
    }

    set endTime(time) {
        this.end = DT.d2t(clamp(time, 0, Infinity));
    }

    get duration() {
        return parseFloat((this.endTime - this.startTime).toFixed(3));
    }
}
