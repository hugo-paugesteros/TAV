fetch('sub-sampling/index.html')
    .then(stream => stream.text())
    .then(text => define(text))

function define(html) {
    class SubSampling extends HTMLElement {

        f = 1

        interval = null
        circles = []
        currentSample = -1
        animation = null

        constructor() {
            super()

            this.innerHTML = html

            this.svg       = SVG(this.querySelector('svg#wheel')).viewbox(-1.05, -1.05, 2.1, 2.1)
            this.svg2      = SVG(this.querySelector('svg#snapshot')).viewbox(-1.05, -1.05, 2.1, 2.1)
            this.srInput   = this.querySelector('#sr')

            this.svg.circle(2).cx(0).cy(0).css({fill: 'none'})
            this.line = this.svg.line(0, 0, 1, 0).stroke({linecap: 'round'})
            this.line.animate(1/this.f * 1000).ease('-').rotate(-360, 0, 0).loop()
            this.line2 = this.svg2.line(0, 0, 1, 0).stroke({linecap: 'round'})

            this.srInput.addEventListener('input', () => this.update())
            this.update()
        }

        update() {
            cancelAnimationFrame(this.animation)
            this.sr = this.srInput.value
            this.circles.forEach(circle => circle.remove())
            this.circles = []
            this.animation = requestAnimationFrame((t) => {
                if (this.zero === undefined) this.zero = t
                if (this.currentSample != -1) this.currentSample = Math.floor((t - this.zero) / (1000/this.sr)) + 1
                this.draw(t)
            })
        }

        draw(t) {
            this.currentSample2 = Math.floor((t - this.zero) / (1000/this.sr))

            if (this.currentSample < this.currentSample2) {
                this.currentSample = this.currentSample2
                let angle = 2 * Math.PI / (1/this.f * this.sr) * this.currentSample
                this.circles.push(
                    this.svg.circle(.05).cx(Math.cos(angle)).cy(-Math.sin(angle))
                )
                this.line2.plot(0, 0, Math.cos(angle), -Math.sin(angle))
                // this.shadow.timeline().finish()
                this.shadow = this.svg.line(0, 0, Math.cos(angle), -Math.sin(angle)).animate().attr({opacity: '0'})
            } 
            this.animation = requestAnimationFrame((t) => this.draw(t))

        }

    }

    customElements.define('sub-sampling', SubSampling)
}