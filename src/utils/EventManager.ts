import { IElementListeners } from './../interfaces/IElement';

export class EventManager {
    private listeners: Array<{
        element: IElementListeners;
        eventType: string;
        callback: IListenerCallback;
    }> = [];

    public addEventListener(
        element: IElementListeners,
        eventType: string,
        callback: IListenerCallback,
        options?: AddEventListenerOptions | boolean,
    ): void {
        element.addEventListener(eventType, callback, options);
        this.listeners.push({ element, eventType, callback });
    }

    public removeEventListener(element: IElementListeners, eventType: string, callback: IListenerCallback): void {
        element.removeEventListener(eventType, callback);
    }

    /**
     *
     * @param element  Element or * as wildcard
     * @param eventType String of event type - for example pointerdown or * as wildcard
     */
    public removeEventListeners(element: IElementListeners | '*' = '*', eventType = '*'): void {
        // TODO: eventType wildcard
        this.listeners
            .filter(
                (listener) =>
                    (listener.element === element || element === '*') &&
                    (listener.eventType === eventType || eventType === '*'),
            )
            .forEach((listener) => {
                /*
                console.log(
                    `Removing event listener on "${eventType}" from element.`,
                    element,
                    listener,
                );
                */
                listener.element.removeEventListener(listener.eventType, listener.callback);
            });
    }

    public updateEventListener(
        element: IElementListeners,
        eventType: string,
        callback: IListenerCallback,
        options?: AddEventListenerOptions | boolean,
    ): void {
        this.removeEventListeners(element, eventType);
        this.addEventListener(element, eventType, callback, options);
    }

    // TODO: !!! Destoroy

    // TODO: override destroy and really destroy event listeners created here
    // TODO: detect in methods if I am destroyed
}

type IListenerCallback = (event: any /*Event | TouchEvent | MouseEvent | PointerEvent /* TODO: Better */) => void;
