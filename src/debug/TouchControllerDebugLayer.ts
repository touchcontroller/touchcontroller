
import { TouchController } from '../touch/TouchController';
import { _createDebugLayerCss, _CSS_PREFIX } from './createDebugLayerCss';


export class TouchControllerDebugLayer {
    constructor(touchController: TouchController) {
        _createDebugLayerCss();

        const showElement = document.createElement('div');
        document.body.appendChild(showElement);

        touchController.touches.subscribe((touch) => {
       
            const showTouchElement = document.createElement('div');
            showTouchElement.classList.add(`${_CSS_PREFIX}touch-show`);
            showElement.appendChild(showTouchElement);

            touch.frames.subscribe({
                next: ({position})=>{
                    showTouchElement.style.left = position.x-7+'px';
                    showTouchElement.style.top = position.y-7+'px';
                },
                complete: ()=>{
                    showTouchElement.remove();
                }
            });

            


        });
    }
}

