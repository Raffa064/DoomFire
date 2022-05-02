const fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}]

//Fire data:
var fireDataStructure = [] //pixels array
var width = 80 //width of the pixel matrix
var height = 80 //height of the pixel matrix
var pixelSize = 0 //size of the pixels in the canvas (auto)
var colorMode = "1" //color effect mode, used to apply color effects
var windDirection = 1 //direction of the fire, can be 0 (left), 1 (up), or 2 (right)

//User interface
var canvas = document.createElement('canvas')
canvas.width = 300
canvas.height = 300
var context = canvas.getContext("2d")
document.querySelector('#fireCanvas').appendChild(canvas)
var selectColorMode = document.getElementById('selectColorMode')
selectColorMode.onchange = function() {
    colorMode = selectColorMode.options[selectColorMode.options.selectedIndex].value
}
var windDirectionSlider = document.getElementById('windDirection')
windDirectionSlider.oninput = function() {
    windDirection = parseInt(this.value)
}
var canvasInputListener = createInputListener(canvas, ['mousemove', 'touchmove'])
mouseInput = { //Desktop input
    update: function(command) {
        var element = command.element
        var whitch = command.whitch
        var event = command.event
        if (whitch === 'mousemove') {
            var rect = element.getBoundingClientRect()
            var mousePos = {
                x: Math.floor((event.clientX - rect.left) / pixelSize),
                y: Math.floor((event.clientY - rect.top) / pixelSize)
            }
            draw(mousePos)
        }
    }
}
var touchInput = { //Mobile input
    update: function(command) {
        var element = command.element
        var whitch = command.whitch
        var event = command.event
        if (whitch === 'touchmove') {
            var rect = element.getBoundingClientRect()
            var touchPos = {
                x: Math.floor((event.touches[0].clientX - rect.left) / pixelSize),
                y: Math.floor((event.touches[0].clientY - rect.top) / pixelSize)
            }
            draw(touchPos)
        }
    }
}
canvasInputListener.subscribe(mouseInput)
canvasInputListener.subscribe(touchInput)

//Fire initialization
createFireDataStructure(width, height) //create the fire structure array
createFireSource() //start an fire source in the bottom
setInterval(calculateFirePropagation, 60) //start per frame updates

//Create an object with Observer design pattern structure
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

//Create an input listener with Observer design pattern
function createInputListener(listerningObject, callbackNames) {
    var inputListener = createObserverPattern()
    for (let callback in callbackNames) {
        listerningObject.addEventListener(callbackNames[callback], function(e) {
            inputListener.notifyAll({ element: listerningObject, whitch: callbackNames[callback], event: e })
        }, true)
    }
    return inputListener
}

//Draw an random square in a position of the canvas (Used when  user touch or mouse dragged)
function draw(pos) {
    pixelSize = canvas.width/(width-1)
    for (let x = -2; x < 2; x++) {
        for (let y = -2; y < 2; y++) {
            var center = (pos.y * width + pos.x)
            var drawPos = center + (y + Math.floor(-1.5 + Math.random() * 3)) * width + x
            if (drawPos >= width * (height-1)) continue
            fireDataStructure[drawPos] = Math.floor(21+Math.random()*15);
        }
    }
}

//Create the fire structure array 
function createFireDataStructure(w, h) {
    for (let i = 0; i < w * h; i++) {
        fireDataStructure[i] = 0
    }
}

//Create the fire source
function createFireSource() {
    for (let x = 0; x < width; x++) {
        fireDataStructure[(width * (height - 1)) + x] = 36
    }
}

//Increase or decrease a number of intensity in the fire source
function updateFireSource(number) {
    var fireForce = document.getElementById('fireForce')
    for (let x = 0; x < width; x++) {
        var index = (width * (height - 1)) + x
        fireDataStructure[index] += number
        fireDataStructure[index] = Math.max(0, Math.min(36, fireDataStructure[index]))
        fireForce.textContent = fireDataStructure[index]
        
    }
}

//The base of the algorithm, it's used for calculate the intensity of the pixels based by the next line pixels
function calculateIntensityPerPixel(currentPixel) {
    var bellowPixelIndex = currentPixel + width
    if (bellowPixelIndex >= width * height) {
        return
    }
    var decay = Math.floor(Math.random()*3) //numero inteiro de 0 a 2
    var bellowPixelFireIntensity = fireDataStructure[bellowPixelIndex]
    var newFireIntensity = bellowPixelFireIntensity - decay
    newFireIntensity = Math.max(0, newFireIntensity)
    switch(windDirection) {
        case 0:
            fireDataStructure[currentPixel - decay] = newFireIntensity
            break
        case 1:
            fireDataStructure[currentPixel] = newFireIntensity
            break
        case 2:
            fireDataStructure[currentPixel + decay] = newFireIntensity
            break
    }
}

//Apply the intensity calculation for arch pixels and render the result
function calculateFirePropagation() {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            calculateIntensityPerPixel(y * width + x)
        }
    }
    renderFire()
}

//Renderization of the fire
function renderFire() {
    pixelSize = canvas.width/width
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            var color = fireColorsPalette[fireDataStructure[y*width+x]]
            switch(colorMode) {
                case '1':
                    context.fillStyle = 'rgb('+color.r+','+color.g+','+color.b+')'
                    break;
                case '2':
                    context.fillStyle = 'rgb('+color.b+','+color.g+','+color.r+')'
                    break;
                case '3':
                    context.fillStyle = 'rgb('+color.b+','+color.r+','+color.g+')'
                    break;
                case '4':
                    var max = Math.max(color.r, Math.max(color.g, color.b))
                    context.fillStyle = 'rgb('+max+','+max+','+max+')'
                    break;
                case '5':
                    context.fillStyle = 'rgb('+color.r+','+0+','+0+')'
                    break;
                case '6':
                    context.fillStyle = 'rgb('+0+','+color.g+','+0+')'
                    break;
                case '7':
                    context.fillStyle = 'rgb('+0+','+0+','+color.b+')'
                    break;
            }
            context.fillRect(x*pixelSize, y*pixelSize, pixelSize, pixelSize)
        }
    }
}
