let template = document.createElement('template')
template.innerHTML = `
<input type="file" />
`

class WaveInput extends HTMLElement {
	
	constructor() {
		super()
		this.wave = this.parentElement
		let shadow 	= this.attachShadow({mode: 'open'})
		shadow.appendChild(template.content.cloneNode(true))
		this.input = shadow.querySelector('input')
		this.input.addEventListener('change', this.fileChange.bind(this))
	}

	async fileChange() {
		const arrayBuffer = await this.input.files[0].arrayBuffer()
		const audioBuffer = await this.wave.audioContext.decodeAudioData(arrayBuffer)
		// let data = audioBuffer.getChannelData(0)

		let source = this.wave.audioContext.createBufferSource()
		source.buffer = audioBuffer
		source.start()
		this.wave.source = source
	}

}

customElements.define('wave-input', WaveInput)