let convert = require("color-convert")
import Color from "colorjs.io"

const wantedColor = document.querySelector(".color-string")
const nextButton = document.querySelector("#next-button")
const rgbRadioButton = document.querySelector("#rgb")
const hexRadioButton = document.querySelector("#hex")
const hslRadioButton = document.querySelector("#hsl")
const easyRadioButton = document.querySelector("#easy")
const mediumRadioButton = document.querySelector("#medium")
const hardRadioButton = document.querySelector("#hard")
const colorGrid = document.querySelector(".color-grid")
const results = document.querySelector(".results")
const resultText = document.querySelector("#result-text")
const colorButtons = [...colorGrid.children]
const newColors = []
let shuffledColors = []
let randomColor
let c

function generateColors() {
	let color1 = new Color(randomColor)
	if (hardRadioButton.checked) {
		while (newColors.length < 6) {
			const newColor = generateRandomColor()
			let color2 = new Color(newColor)
			if (color1.deltaE(color2, "CMC") < 30) {
				newColors.push(newColor)
			}
		}
	} else if (mediumRadioButton.checked) {
		while (newColors.length < 6) {
			const newColor = generateRandomColor()
			let color2 = new Color(newColor)
			if (color1.deltaE(color2, "CMC") < 90 && color1.deltaE(color2, "CMC") > 50) {
				newColors.push(newColor)
			}
		}
	} else {
		while (newColors.length < 6) {
			const newColor = generateRandomColor()
			newColors.push(newColor)
		}
	}
}

document.addEventListener("click", (e) => {
	if (e.target.matches("#next-button")) return
	if (e.target.matches("button")) {
		if (e.target.style.backgroundColor === convertToRgbHelper(randomColor)) {
			resultText.textContent = "Correct"
		} else {
			resultText.textContent = "Incorrect"
		}
		addWrongClassAndDisableButtons()
		results.classList.remove("hide")
	}
})

function addWrongClassAndDisableButtons() {
	colorButtons.forEach((btn) => {
		if (btn.style.backgroundColor !== convertToRgbHelper(randomColor)) {
			btn.classList.add("wrong")
		}
		btn.disabled = true
	})
}

function renderColors(shuffledColors) {
	for (let i = 0; i < 6; i++) {
		colorButtons[i].style.backgroundColor = shuffledColors[i]
	}
}

function generateWantedColor() {
	results.classList.add("hide")
	removeWrongFromButtons()
	newColors.length = 0
	randomColor = generateRandomColor()
	newColors.push(randomColor)

	generateColors()
	shuffleColors()
	renderColors(shuffledColors)

	if (rgbRadioButton.checked) {
		convertToRgb(randomColor)
	} else if (hexRadioButton.checked) {
		wantedColor.innerText = randomColor
	} else {
		convertToHsl(randomColor)
	}
}

generateWantedColor()

nextButton.addEventListener("click", () => {
	generateWantedColor()
	removeWrongFromButtons()
})

function removeWrongFromButtons() {
	colorButtons.forEach((btn) => {
		btn.classList.remove("wrong")
		btn.disabled = false
	})
}

function shuffleColors() {
	shuffledColors = newColors
		.map((value) => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value)
	// shuffiling twice for more randomness
	shuffledColors = shuffledColors
		.map((value) => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value)
}

easyRadioButton.addEventListener("click", () => {
	generateWantedColor()
})

mediumRadioButton.addEventListener("click", () => {
	generateWantedColor()
})

hardRadioButton.addEventListener("click", () => {
	generateWantedColor()
})

rgbRadioButton.addEventListener("click", () => {
	convertToRgb(randomColor)
})

hexRadioButton.addEventListener("click", () => {
	wantedColor.innerText = randomColor
})

hslRadioButton.addEventListener("click", () => {
	convertToHsl(randomColor)
})

function generateRandomColor() {
	c = ""
	while (c.length < 6) {
		c = `${Math.floor(Math.random() * 16777215).toString(16)}`
	}
	return "#" + c
}

function convertToRgb(randomColor) {
	const rgbArray = convert.hex.rgb(randomColor)
	wantedColor.innerText = `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`
}

function convertToHsl(randomColor) {
	const hslArray = convert.hex.hsl(randomColor)
	wantedColor.innerText = `hsl(${hslArray[0]}, ${hslArray[1]}%, ${hslArray[2]}%)`
}

function convertToRgbHelper(randomColor) {
	const rgbArray = convert.hex.rgb(randomColor)
	return `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`
}
