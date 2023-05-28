let template = document.createElement('template')
template.innerHTML = `
<input id="amp" step="0.1" type="range" min="0" max="1" value="0.5"/>
<input id="freq" type="range" min="200" max="8000" value="400"/>

<input id="type" name="type" type="radio" value="sine" checked>
<input id="type" name="type" type="radio" value="square">

<wave-visualizer></wave-visualizer>
`


class WaveGenerator extends HTMLElement {

	constructor() {
		super()

		this.wave = this.parentElement

		this.shadow 	= this.attachShadow({mode: 'open'})
		this.shadow.appendChild(template.content.cloneNode(true))

		this.ampRange = this.shadow.querySelector('#amp')
		this.freqRange = this.shadow.querySelector('#freq')
		// this.freqRange.setAttribute('max', this.getAttribute('maxFreq') ? this.getAttribute('maxFreq') : 800)
		this.typeBtns = this.shadow.querySelectorAll('input[name="type"]')
		this.wave_visualizer = this.shadow.querySelector('wave-visualizer')

		this.ampRange.addEventListener('click', () => this.update())
		this.freqRange.addEventListener('click', () => this.update())
		this.typeBtns.forEach((btn) => {
			btn.addEventListener('click', () => this.update())
		})
	}

	update() {
		this.oscillator = this.wave.audioContext.createOscillator()
		this.gainNode = this.wave.audioContext.createGain()

		this.gainNode.gain.value = this.ampRange.value
		this.oscillator.frequency.value = this.freqRange.value
		this.oscillator.type = this.shadow.querySelector('input[name="type"]:checked').value
		
		
		this.oscillator.connect(this.gainNode)
		this.oscillator.start(0)
		this.wave.source = 	this.gainNode
	}

}

customElements.define('wave-generator', WaveGenerator)