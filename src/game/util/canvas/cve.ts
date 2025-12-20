import { Transform2d } from "./util/math/transform";

export class CVE {

    below: Record<string, CVE> = {};
    children: Record<string, CVE> = {};
    above: Record<string, CVE> = {};
    parent?: CVE;

    private _order: number = 1;
    public get order(): number {
        return this._order;
    }
    public set order(value: number) {
        this._order = value;
    }

    transform: Transform2d;
    constructor() {
        this.transform = new Transform2d();
    }

    add(name: string, parent: CVE, order: number = 1) {
        if (parent.children[name]) {
            throw new Error(`Child ${name} already exists`);
        }
        parent.children[name] = this;
        if (order < 0) {
            parent.below[name] = this;
            parent.below = Object.fromEntries(Object.entries(parent.below).sort((a, b) => a[1].order - b[1].order));
        } else if (order > 0) {
            parent.above[name] = this;
            parent.above = Object.fromEntries(Object.entries(parent.below).sort((a, b) => a[1].order - b[1].order));

        } else {
            throw new Error(`Order must be less than 0 or greater than 0`);
        }

        this.parent = parent;
        this.order = order;
    }
    preTransform() {
        // void
    }
    preRender() {
        // void
    }
    render() {
        // void
    }
    postRender() {
        // void
    }
    tick() {
        canvas.save();
        this.preTransform();
        this.transform.apply(canvas.ctx);
        this.preRender();
        for (const child of Object.values(this.below)) {
            child.tick();
        }
        this.render();
        for (const child of Object.values(this.above)) {
            child.tick();
        }
        this.postRender();
        canvas.restore();
    }
}
