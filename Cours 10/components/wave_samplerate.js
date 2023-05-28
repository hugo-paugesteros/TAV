let template = document.createElement('template')
template.innerHTML = `
<input type="range" min="8000" max="44100" value="44100"/>
`

class WaveSamplerate extends HTMLElement {
	
	constructor() {
		super()
		this.wave = this.parentElement
		let shadow 	= this.attachShadow({mode: 'open'})
		shadow.appendChild(template.content.cloneNode(true))
		this.input = shadow.querySelector('input')
		this.input.addEventListener('change', this.update.bind(this))

		this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
			sampleRate: this.getAttribute('sr') ? this.getAttribute('sr') : 44100,
		})
	}

	update() {
		this.wave.audioContext = new (window.AudioContext || window.webkitAudioContext)({
			sampleRate: this.input.value
		})
	}

}

customElements.define('wave-samplerate', WaveSamplerate)