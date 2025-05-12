class WavePropagation extends HTMLElement {

	A = 30
	k = 2 * Math.PI / 200
	omega = 2 * Math.PI

	constructor() {
		super()
		this.svg = SVG().addTo(this).viewbox(-5, 0, 1000, 100)
	}

	connectedCallback() {
		this.init()
	}

	_drawSine() {
		let pathString = `M ${this.A} 0 `
		for (let y = 0; y < 200; y++) {
			let x = this.A + this.A * Math.sin(this.omega * y/100)
			pathString += `L ${x} ${y} `
		}

		this.svg.path(pathString)
      	.stroke({ width: 1 })
      	.animate(5000)
		.ease('-')
      	.translate(0, -100)
		.loop(true)
	}

	_drawSpeaker() {
		const g = this.svg.group()

		g.rect(60, 2).move(this.A, 49)
		g.rect(7, 100).move(this.A + 60, 0)

		g.animate(5000, '-')
		.during(t => {
		var x = this.A + this._waveEquation(3*this.A, t)
    		g.x(x)
		}).loop(true)
	}

	init() {
		this._drawSine()
		this._drawSpeaker()

		for (let x = 4 * this.A; x < 1000; x += 20) {
			for (let y = 5; y < 100; y += 20) {
			  	const x0 = x + 5 * Math.random()
			  	const y0 = y + 5 * Math.random()
	  
			  	const point = this.svg.circle(4).center(x0 + this._waveEquation(x0, 0), y0)
	  
				point.animate(5000, '-')
				.during(t => {
					var x = x0 + this._waveEquation(x0, t)
					point.x(x)
				}).loop(true)
			}
		}
	}

	_waveEquation(x, t) {
		x = x - 3 * this.A
		return this.A * Math.sin(this.k * x - this.omega * t)
	}

}

customElements.define('wave-propagation', WavePropagation)