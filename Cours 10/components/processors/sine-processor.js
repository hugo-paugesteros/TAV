class SineProcessor extends AudioWorkletProcessor {

	arg = 0
	freq = 440

	constructor() {
		super()
		this.port.onmessage = this.onmessage.bind(this);
	}

	onmessage(e) {
		if (e.data.type === 'freq') {
			this.freq = e.data.value
		}
	}

	process(inputs, outputs, parameters) {
		const output = outputs[0]
		output.forEach((channel) => {
			for (let i = 0; i < channel.length; i++) {
				this.arg += 1/44100
				channel[i] = Math.sin(2 * Math.PI * this.freq * this.arg)
			}
		});
		return true;
	}
}

registerProcessor("sine-processor", SineProcessor)