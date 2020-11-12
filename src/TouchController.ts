import { Subject } from 'rxjs/internal/Subject';

import { Grid } from './Grid';
import { GridTouchController } from './GridTouchController';
import { Awaitable } from './interfaces/Awaitable';
import { IElement } from './interfaces/IElement';
import { IListener } from './interfaces/IListener';
import { ITouchController } from './interfaces/ITouchController';
import { MouseListener } from './listeners/MouseListener';
import { TouchListener } from './listeners/TouchListener';
import { Touch } from './Touch';
import { TouchFrame } from './TouchFrame';
import { EventManager } from './utils/EventManager';

/*
interface ITouchControllerOptions {
    toggleTouchByTap: boolean;
}

const TouchControllerOptionsDefault: ITouchControllerOptions = {
    toggleTouchByTap: false,
};
*/

// TODO: multitouch should be extended from this
export class TouchController implements ITouchController {
    public static fromCanvas(canvas: HTMLCanvasElement) {
        return new TouchController([canvas], canvas, true);
    }

    // TODO: !!! Use subjects everywhere
    public readonly touches = new Subject<Touch>();
    public readonly hoveredFrames = new Subject<TouchFrame>();
    public readonly eventManager = new EventManager();

    private listeners: IListener[] = [];

    constructor(
        public elements: IElement[], // TODO: syntax sugar if set only one element
        public anchorElement: HTMLElement,
        setListeners = true,
        // public readonly options: ITouchControllerOptions = TouchControllerOptionsDefault,
    ) {
        if (setListeners) {
            this.addListener(new MouseListener(this.eventManager));

            this.addListener(
                new MouseListener(this.eventManager, [1, 2], true),
            );

            this.addListener(new TouchListener(this.eventManager));
        }
    }

    public addListener(listener: IListener) {
        this.listeners.push(listener);
        for (const element of this.elements) {
            this.callListenerOnElement(listener, element);
        }
    }

    public addElement(element: IElement) {
        this.elements.push(element);

        for (const listener of this.listeners) {
            this.callListenerOnElement(listener, element);
        }
    }

    public addInitialElement(
        element: IElement,
        newElementCreator: (event: Event) => Awaitable<IElement>,
    ) {
        for (const listener of this.listeners) {
            // TODO: Should be here updateEventListener or addEventListener
            this.eventManager.addEventListener(
                element,
                listener.startEventType,
                async (event) => {
                    if (!listener.acceptsEvent(event)) {
                        return;
                    }

                    const newElement = await newElementCreator(event);
                    // this.addElement(newElement);

                    if (
                        !this.elements.some(
                            (elementx) => elementx === newElement,
                        )
                    ) {
                        throw new Error(
                            `When using touchController.addInitialElement you must use touchController.addElement inside the newElementCreator callback.`,
                        );
                    }

                    listener.startFromExternalEvent(newElement, event as any);
                },
            );
        }
    }

    public emulateTouch(touch: Touch) {
        // await forImmediate();
        this.touches.next(touch);
    }

    public applyGrid(grid: Grid): GridTouchController {
        return grid.applyToTouchController(this);
    }

    private callListenerOnElement(listener: IListener, element: IElement) {
        listener.init(
            element,
            this.anchorElement,
            (touch: Touch) => this.touches.next(touch),
            (frame: TouchFrame) => this.hoveredFrames.next(frame),
        );
        // TODO: array of listeners disposers
    }

    // TODO: method for dispose
}
