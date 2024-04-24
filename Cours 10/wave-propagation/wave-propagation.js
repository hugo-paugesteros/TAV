class WavePropagation extends HTMLElement {

	A = 30
	k = 2 * Math.PI / 200
	omega = 2 * Math.PI

	constructor() {
		super()
		this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        this.svg.setAttribute('viewBox', '0 0 1000 100')
        this.append(this.svg)
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

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		path.setAttribute('d', pathString)
		// path.setAttribute('stroke', 'white')
		path.setAttribute('stroke-width', '1')
		
		const animateTransform = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform')
		animateTransform.setAttribute('attributeName', 'transform')
		animateTransform.setAttribute('type', 'translate')
		animateTransform.setAttribute('from', '0 0')
		animateTransform.setAttribute('to', '0 -100')
		animateTransform.setAttribute('dur', '5s')
		animateTransform.setAttribute('repeatCount', 'indefinite')
		
		path.append(animateTransform)
		this.svg.append(path)
	}

	_drawSpeaker() {
		const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
		// g.setAttribute('fill', 'white')

		const rect1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
		rect1.setAttribute('width', '60')
		rect1.setAttribute('height', '2')
		rect1.setAttribute('y', '49')
		rect1.setAttribute('x', '-60')

		const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
		rect.setAttribute('width', '7')
		rect.setAttribute('height', '100')

		// Create animation element
		const animation = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion')
		animation.setAttribute('dur', '5s')
		animation.setAttribute('repeatCount', 'indefinite')
		animation.setAttribute('path', this._buildPath({'x0': 3*this.A, 'y0': 0}))
		animation.setAttribute('calcMode', 'linear')

		g.append(rect1)
		g.append(rect)
		g.append(animation)
		this.svg.append(g)
	}

	init() {
		this._drawSine()
		this._drawSpeaker()

		for (let x = 4*this.A; x < 1000; x+=20) {
			// let x = 100
			for (let y = 5; y < 100; y+=20) {
				// Initial position
				const x0 = x + 5*Math.random()
				const y0 = y + 5*Math.random()

				// Create circle element
				const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
				// point.setAttribute('fill', 'white')
				point.setAttribute('r', 2)

				// Create animation element
				const animation = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion')
				animation.setAttribute('dur', '5s')
				animation.setAttribute('repeatCount', 'indefinite')
				animation.setAttribute('path', this._buildPath({'x0': x0, 'y0': y0}))
				animation.setAttribute('calcMode', 'linear')

				point.append(animation)
				this.svg.append(point)
			}
		}
	}

	_buildPath(point) {
		let path = `M ${point.x0 + this._waveEquation(point.x0, 0)} ${point.y0} `
		for (let t = 1; t < 30; t++) {
			let x = point.x0 + this._waveEquation(point.x0, t/30)
			path += `H ${x} `
		}
		path += 'Z'
		return path
	}

	_waveEquation(x, t) {
		x = x - 3 * this.A
		return this.A * Math.sin(this.k * x - this.omega * t)
	}

}

customElements.define('wave-propagation', WavePropagation)