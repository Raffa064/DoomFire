const fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}]


var fireDataStructure = []
var width = 80
var height = 80 //test
var pixelSize = 0
var colorMode = "1"
var windDirection = 1

var canvas = document.createElement('canvas')
var context = canvas.getContext("2d")
document.querySelector('#fireCanvas').appendChild(canvas)
canvas.width = 300
canvas.height = 300
pixelSize = canvas.width/(width-1)
canvas.addEventListener('touchmove', function(e) {
    var rect = canvas.getBoundingClientRect()
    var touchPos = {
        x: Math.floor((e.touches[0].clientX - rect.left) / pixelSize),
        y: Math.floor((e.touches[0].clientY - rect.top) / pixelSize)
    }
    draw(touchPos)
}, true)
canvas.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect()
    var mousePos = {
        x: Math.floor((e.clientX - rect.left) / pixelSize),
        y: Math.floor((e.clientY - rect.top) / pixelSize)
    }
    draw(mousePos)
}, true)
var selectColorMode = document.getElementById('selectColorMode')
selectColorMode.onchange = function() {
    colorMode = selectColorMode.options[selectColorMode.options.selectedIndex].value
}
var windDirectionSlider = document.getElementById('windDirection') 
windDirectionSlider.oninput = function() {
    windDirection = parseInt(this.value)
}
createFireDataStructure(width, height)
createFireSource()
setInterval(calculateFirePropagation, )

function draw(pos) {
    for (let x = -2; x < 2; x++) {
        for (let y = -2; y < 2; y++) {
            var center = (pos.y * width + pos.x)
            fireDataStructure[center + (y + Math.floor(-1.5 + Math.random() * 3)) * width + x] = Math.floor(21+Math.random()*15);
        }
    }
}

function createFireDataStructure(w, h) {
    for (let i = 0; i < w * h; i++) {
        fireDataStructure[i] = 0
    }
}

function createFireSource() {
    for (let x = 0; x < width; x++) {
        fireDataStructure[(width * (height - 1)) + x] = 36
    }
}

function updateFireSource(number) {
    var fireForce = document.getElementById('fireForce')
    for (let x = 0; x < width; x++) {
        var index = (width * (height - 1)) + x
        fireDataStructure[index] += number
        fireDataStructure[index] = Math.max(0, Math.min(36, fireDataStructure[index]))
        fireForce.textContent = fireDataStructure[index]
        
    }
}

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

function calculateFirePropagation() {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            calculateIntensityPerPixel(y * width + x)
        }
    }
    renderFire()
}

function renderFire() {
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

