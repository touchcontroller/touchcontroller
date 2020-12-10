import { Observable } from 'rxjs/internal/Observable';
import { BoundingBox, ITransform, Transform, Vector } from 'xyzt';
import { Multitouch } from '../Multitouch';
import { _dragging } from './dragging';
import { _twoFingerring } from './twoFingerring';

export interface IMultitouchTransformsOptions {
    multitouch: Multitouch<BoundingBox>;
    getElementCenter: () => Vector;
    pick?: Array<keyof ITransform>;
    // TODO: Prevent extremes
}

export function multitouchTransforms({
    multitouch,
    getElementCenter,
    pick,
}: IMultitouchTransformsOptions): Observable<Transform> {
    pick = pick || ['translate', 'scale', 'rotate'];
    return new Observable((observer) => {
        multitouch.ongoingTouchesChanges.subscribe(
            (touches) => {
                // TODO: !! free the memory
                // TODO: Debounce
                // TODO: What about 3 and more fingers

                if (touches.length === 1) {
                    if (pick!.includes('translate')) {
                        _dragging(touches[0]).subscribe(observer);
                    }
                } else if (touches.length > 1) {
                    _twoFingerring({ getElementCenter, touch1: touches[0], touch2: touches[1], pick: pick! }).subscribe(
                        observer,
                    );
                }
            },
            // TODO: Maybe error and complete callbacks not nessesary
            (error) => {
                observer.error(error);
            },
            () => {
                observer.complete();
            },
        );
    });
}
