import { Vector2 } from './Vector2';
export declare class Transformation {
    translate: Vector2;
    rotate: number;
    rotateCenter: Vector2;
    scale: number;
    constructor(translate?: Vector2, rotate?: number, rotateCenter?: Vector2, scale?: number);
    static Neutral(): Transformation;
    static translate(translate: Vector2): Transformation;
    static rotate(rotate: number): Transformation;
    static scale(scale: number): Transformation;
    clone(): Transformation;
    cloneDeep(): Transformation;
    add(transformation: Transformation): Transformation;
    subtract(transformation: Transformation): Transformation;
    applyOnElement(element: Element): void;
    applyOnHtmlElement(element: HTMLElement): void;
    applyOnSvgElement(element: SVGGElement): void;
}
