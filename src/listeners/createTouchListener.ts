import IListener from './IListener';
import Touch from '../Touch';
import TouchFrame from '../TouchFrame';
import Vector2 from '../Vector2';
import { isNull } from 'util';

export default function(buttons: number[] = [0]): IListener {
    return (
        element: HTMLElement,
        newTouch: (touch: Touch) => void,
        newHoverFrame: (frame: TouchFrame) => void,
    ) => {
        element.addEventListener(
            'touchstart',
            (event) => _handleTouchesStart(event),
            false,
        );
        element.addEventListener(
            'touchmove',
            (event) => _handleTouchesMove(event),
            false,
        );
        element.addEventListener(
            'touchend',
            (event) => _handleTouchesEnd(event),
            false,
        );
        element.addEventListener(
            'touchcancel',
            (event) => _handleTouchesEnd(event),
            false,
        );

        let currentTouches: { [identifier: number]: Touch } = {};

        function _handleTouchesStart(event: TouchEvent) {
            event.preventDefault();
            const touches = event.changedTouches;
            for (let i = 0, l = touches.length; i < l; i++) {
                const currentTouch = new Touch(
                    'TOUCH',
                    _createTouchFrameFromEvent(touches[i]),
                );
                currentTouches[touches[i].identifier] = currentTouch;
                newTouch(currentTouch);
            }
        }

        function _handleTouchesMove(event: TouchEvent) {
            event.preventDefault();
            const touches = event.changedTouches;
            for (let i = 0, l = touches.length; i < l; i++) {
                const currentTouch =
                    currentTouches[touches[i].identifier] || null;
                if (!isNull(currentTouch)) {
                    currentTouch.move(
                        _createTouchFrameFromEvent(touches[i]),
                        false,
                    );
                }
            }
        }

        function _handleTouchesEnd(event: TouchEvent) {
            event.preventDefault();
            const touches = event.changedTouches;
            for (let i = 0, l = touches.length; i < l; i++) {
                const currentTouch =
                    currentTouches[touches[i].identifier] || null;
                if (!isNull(currentTouch)) {
                    currentTouch.move(
                        _createTouchFrameFromEvent(touches[i]),
                        true,
                    );
                    delete currentTouches[touches[i].identifier];
                }
            }
        }

        function _createTouchFrameFromEvent(event: {
            clientX: number;
            clientY: number;
        }) {
            return new TouchFrame(
                new Vector2(
                    event.clientX - element.offsetLeft,
                    event.clientY - element.offsetTop,
                ),
                performance.now(),
            );
        }

        return () => {
            //todo dispose
        };
    };
}
