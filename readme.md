# Simple Doom fire algorithm

![screenshot](/imgs/fire-image.jpg)

I maked this Doom game fire algorithm for learn more of the javascript lenguage, in that i am a beginner.
This algorithm is very easy to add winds, and have a beautiful result. 
It basically get the bottomside pixels value and decrease it to take the [smooth color effect](#smooth).
This project is based by [Filipe Deschamps's code](https://github.com/filipedeschamps/doom-fire-algorithm).

For this projects i choose to use the Factory and Observer design patterns:
```javascript
function createObserverPattern() {
    var subject = {}
    subject.observers = []
    subject.subscribe = function(observer) {
        this.observers.push(observer)
    }
    subject.unsubscribe = function(observer) {
        this.observers.splice(observer)
    }
    subject.notifyAll = function(command) {
        for (let observer in this.observers) {
            this.observers[observer].update(command)
        }
    }
    return subject
}

function createInputListener(listerningObject, callbackNames) {
    var inputListener = createObserverPattern()
    for (let callback in callbackNames) {
        listerningObject.addEventListener(callbackNames[callback], function(e) {
            inputListener.notifyAll({ element: listerningObject, whitch: callbackNames[callback], event: e })
        }, true)
    }
    return inputListener
}
```
With that, adding other forms of input to the canvas is simple, bud it can too be used for other elements.

<a name="smooth"></a>
## Smooth color effect 
<div style="margin-left: auto; margin-right: auto;">
    <img src="./imgs/algorithm.gif">
</div>

For take the smooth color and the movement effect, basically the pixels gets the bottom pixel value decreased by an decay variable that receive an random value in range of 0 to 2.

For given the wind effect you only need to add or dec the decay value in the index of the current calculating pixel, remebering that the decay is an float value, and you need to add her using the floor function.

You can run this project [here](https://raffa064.github.io/DoomFire/)
