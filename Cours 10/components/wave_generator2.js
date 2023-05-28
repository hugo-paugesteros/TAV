let template = document.createElement('template')
template.innerHTML = `
<button id="play">Play</button>
<input id="file" type="file" />
<input id="amp" step="0.1" type="range" min="0" max="1" value="0.5"/>
<input id="freq" type="range" min="200" max="800" value="4000"/>

<input id="type" name="type" type="radio" value="sine">
<input id="type" name="type" type="radio" value="square">

<wave-visualizer></wave-visualizer>
`


class WaveGenerator extends HTMLElement {

	isPlaying = false

	constructor() {
		super()

		this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
			sampleRate: this.getAttribute('sr') ? this.getAttribute('sr') : 44100,
		})

		this.shadow 	= this.attachShadow({mode: 'open'})
		this.shadow.appendChild(template.content.cloneNode(true))

		// this.oscillator = this.audioContext.createOscillator()
		// this.gainNode = this.audioContext.createGain()
		
		// this.oscillator.connect(this.gainNode)
		// this.gainNode.connect(this.analyser)
		
		// this.oscillator.start(0)
		// this.audioContext.suspend()

		this.audioContext.audioWorklet.addModule("processors/sine-processor.js").then(() => {
			this.sineProcessor = new AudioWorkletNode(
				this.audioContext,
				"sine-processor"
			)

			this.analyser = this.audioContext.createAnalyser()

			this.sineProcessor.connect(this.analyser)
			this.analyser.connect(this.audioContext.destination)

			// this.sineProcessor.start()
			this.audioContext.suspend()
		})

		// let frames = this.audioContext.sampleRate * 2
		// this.buffer = this.audioContext.createBuffer(1, frames, this.audioContext.sampleRate)
		// let tmp = this.buffer.getChannelData(0)
		// for (let i = 0; i < frames; i++) {
		// 	tmp[i] = Math.sin(2 * Math.PI * 440 * i / this.audioContext.sampleRate)
		// }
		
		// this.source = this.audioContext.createBufferSource()
		// this.source.buffer = this.buffer

		// this.analyser = this.audioContext.createAnalyser()
		
		// this.source.connect(this.analyser)
		// this.analyser.connect(this.audioContext.destination)

		// this.source.start()
		// this.audioContext.suspend()
		
		this.playBtn = this.shadow.querySelector('#play')
		this.ampRange = this.shadow.querySelector('#amp')
		this.freqRange = this.shadow.querySelector('#freq')
		this.freqRange.setAttribute('max', this.getAttribute('maxFreq') ? this.getAttribute('maxFreq') : 800)
		this.typeBtns = this.shadow.querySelectorAll('input[name="type"]')
		this.wave_visualizer = this.shadow.querySelector('wave-visualizer')

		this.playBtn.addEventListener('click', () => this.playPause())
		this.ampRange.addEventListener('click', () => this.update())
		this.freqRange.addEventListener('click', () => this.update())
		this.typeBtns.forEach((btn) => {
			btn.addEventListener('click', () => this.update())
		})
	}

	playPause() {
		(this.isPlaying ? this.pause() : this.play())
		this.isPlaying = !this.isPlaying
	}

	play() {
		this.audioContext.resume()
		this.render()
	}

	pause() {
		this.audioContext.suspend()
		window.cancelAnimationFrame(this.animation)
	}

	update() {
		this.sineProcessor.port.postMessage({
			type: 'freq',
			value: this.freqRange.value
		});	
		// this.gainNode.gain.value = this.ampRange.value
		// this.oscillator.frequency.value = this.freqRange.value
		// this.oscillator.type = this.shadow.querySelector('input[name="type"]:checked').value
	}

	render() {
		let dataArray = new Uint8Array(this.analyser.frequencyBinCount)
		this.analyser.getByteTimeDomainData(dataArray)

		let t = Array(dataArray.length).fill().map((element, i) => i)
		let y = dataArray

		if(this.plot) {
			this.plot.y = y
			this.plot.render(this.wave_visualizer)
		} else {
			this.plot = this.wave_visualizer.plot(t, y)
			this.wave_visualizer.svg.setAttribute('viewBox', '-51.150000000000006 -12.75 1125.3000000000002 280.5')
		}

		this.animation = window.requestAnimationFrame(this.render.bind(this))
	}

}

customElements.define('wave-generator', WaveGenerator)