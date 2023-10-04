// Get references to DOM elements
const canvas = document.getElementById('canvas')
const colorInput = document.getElementById('colorInput')
const penBtn = document.getElementById('pen')
const rainbowBtn = document.getElementById('rainbow')
const lightenBtn = document.getElementById('lighten')
const darkenBtn = document.getElementById('darken')
const eraserBtn = document.getElementById('eraser')
const clearBtn = document.getElementById('clear')
const gridSizeDiv = document.getElementById('gridSize')
const pixelSlider = document.getElementById('pixelSlider')
const settings = document.querySelectorAll('.option')
const settingsList = Array.from(settings).slice(0, -2)

// Initialize variables
let pixelCount = 16
let activeColor = '#1e293b'
let isMouseDown = false
let activeMode = 'pen'
let gridSize = 16

// Helper function to toggle active class on click
function toggleActiveOnClick(event) {
    const selectedItem = event.target
    settingsList.forEach(item => {
        if (item !== selectedItem) {
            item.classList.remove('active')
        }
    })
    selectedItem.classList.add('active')
}

// Function to handle mouse events for drawing
function mouseMode(event) {
    if (event.type === 'mousedown') {
        if (activeMode === 'pen' || activeMode === 'rainbow') {
            event.target.style.backgroundColor = activeColor
        }
        isMouseDown = true
    } else if (event.type === 'mouseup') {
        isMouseDown = false
    }
}

// Function to change cell color on mouseover if the mouse is down
function changeColor(event) {
    if (isMouseDown) {
        if (activeMode === 'pen') {
            event.target.style.backgroundColor = activeColor
        } else if (activeMode === 'rainbow') {
            // Generate a random hex number
            const letters = '0123456789ABCDEF'
            let color = '#'

            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)]
            }
            activeColor = color
            event.target.style.backgroundColor = color

        } else if (activeMode === 'lighten') {
            const computedStyle = window.getComputedStyle(event.target)
            event.target.style.backgroundColor = lightenColor(computedStyle.backgroundColor, 1.07)

        } else if (activeMode === 'darken') {
            const computedStyle = window.getComputedStyle(event.target)
            event.target.style.backgroundColor = darkenColor(computedStyle.backgroundColor, 0.93)

        } else if (activeMode === 'eraser') {
            event.target.style.backgroundColor = '#fff'
        }
    }
}

// Function to lighten the color
function lightenColor(rgbColor, amount) {
    let [red, green, blue] = rgbColor.match(/\d+/g)
    if ((red === '0' && green === '0' && blue === '0')) red = green = blue = 10

    const lightenedRed = Math.min(255, Math.ceil(red * amount))
    const lightenedGreen = Math.min(255, Math.ceil(green * amount))
    const lightenedBlue = Math.min(255, Math.ceil(blue * amount))
    return `rgb(${lightenedRed},${lightenedGreen},${lightenedBlue})`
}

// Function to darken the color
function darkenColor(rgbColor, amount) {
    const [red, green, blue] = rgbColor.match(/\d+/g)

    const darkenedRed = Math.max(0, Math.floor(red * amount))
    const darkenedGreen = Math.max(0, Math.floor(green * amount))
    const darkenedBlue = Math.max(0, Math.floor(blue * amount))
    return `rgb(${darkenedRed},${darkenedGreen},${darkenedBlue})`
}

// Function to create a grid with the specified number of pixels
function createGrid(pixelCount) {
    canvas.innerHTML = ''
    canvas.style.gridTemplateRows = `repeat(${pixelCount}, 1fr)`
    canvas.style.gridTemplateColumns = `repeat(${pixelCount}, 1fr)`
    for (let i = 0; i < pixelCount * pixelCount; i++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.addEventListener('mousedown', mouseMode)
        cell.addEventListener('mousedown', changeColor)
        cell.addEventListener('mouseover', changeColor)
        canvas.appendChild(cell)
    }
}

// Add mouseup event listener on the window for drawing
window.addEventListener('mouseup', mouseMode)

// Add click event listeners to settings items
settingsList.forEach(item => {
    item.addEventListener('click', toggleActiveOnClick)
})

colorInput.addEventListener('input', () => {
    activeColor = colorInput.value
})

// Add change event listener to the pixel slider
pixelSlider.addEventListener('change', () => {
    pixelCount = pixelSlider.value
    createGrid(pixelCount)
})

// Add input event listener to the pixel slider
pixelSlider.addEventListener('input', () => {
    gridSize = pixelSlider.value
    gridSizeDiv.innerHTML = `Grid Size: ${gridSize}x${gridSize}`
})

// Add click event listeners to buttons to change the active color or clear the canvas
penBtn.addEventListener('click', () => {
    activeMode = 'pen'
    activeColor = colorInput.value
})

rainbowBtn.addEventListener('click', () => {
    activeMode = 'rainbow'
})

lightenBtn.addEventListener('click', () => {
    activeMode = 'lighten'
})

darkenBtn.addEventListener('click', () => {
    activeMode = 'darken'
})

eraserBtn.addEventListener('click', () => {
    activeMode = 'eraser'
})

clearBtn.addEventListener('click', () => createGrid(pixelCount))

// Create the initial grid
createGrid(pixelCount)
