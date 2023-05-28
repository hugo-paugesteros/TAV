let template = document.createElement('template')
template.innerHTML = `
<button id="play">Play</button>
<slot></slot>
<slot name="visualizer"></slot>
`

class WaveMain extends HTMLElement {

	isPlaying = false
	
	constructor() {
		super()

		let shadow 	= this.attachShadow({mode: 'open'})
		shadow.appendChild(template.content.cloneNode(true))
		this.button = shadow.querySelector('button')
		this.button.addEventListener('click', this.playPause.bind(this))

		this.shadowRoot.querySelector('slot[name="visualizer"').addEventListener('slotchange', () => {
			this._wave_visualizer = this.shadowRoot.querySelector('slot[name="visualizer"').assignedNodes()[0]
		})
		
		this._audioContext = new (window.AudioContext || window.webkitAudioContext)()

		this._source = this.audioContext.createOscillator()
		this._analyser = this.audioContext.createAnalyser()

		this._source.connect(this._analyser)
		this._analyser.connect(this.audioContext.destination)
		this.audioContext.suspend()
	}

	set source(source) {
		this._source.disconnect()
		this._source = source
		this._source.connect(this._analyser)
		this.renderStatic()
	}

	get audioContext() {
		return this._audioContext
	}

	set audioContext(audioContext) {
		this._source.disconnect()
		this._audioContext = audioContext
		
		this._source = audioContext.createOscillator()
		this._analyser = audioContext.createAnalyser()
		
		this._source.connect(this._analyser)
		this._analyser.connect(this.audioContext.destination)
		this.audioContext.suspend()

		this._wave_visualizer.svg.setAttribute('viewBox', `-10 0 1024 276`)
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
		window.cancelAnimationFrame(this._animation)
	}

	renderStatic() {
		console.log(this._source)
		// let dataArray = this._source.
	}

	render() {
		let dataArray = new Uint8Array(this._analyser.frequencyBinCount)
		this._analyser.getByteTimeDomainData(dataArray)

		let t = Array(dataArray.length).fill().map((_, i) => i / this.audioContext.sampleRate / 0.01 * 1024)
		let y = dataArray
		
		if(this._plot) {
			this._plot.t = t
			this._plot.y = y
			this._plot.render(this.wave_visualizer)
		} else {
			this._plot = this._wave_visualizer.plot(t, y, 'scatter')
			// this._wave_visualizer.svg.setAttribute('viewBox', '-51.150000000000006 -12.75 1125.3000000000002 280.5')
			this._wave_visualizer.svg.setAttribute('viewBox', `0 -10 1024 276`)
		}

		this._animation = window.requestAnimationFrame(this.render.bind(this))
	}

}

customElements.define('wave-main', WaveMain)