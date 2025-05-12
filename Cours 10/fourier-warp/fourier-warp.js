fetch('fourier-warp/index.html')
    .then(stream => stream.text())
    .then(text => define(text))

function define(html) {
    class FourierWarp extends HTMLElement {

        constructor() {
            super()

            this.innerHTML = html

            this.points = []
            
            this.gain = 20
            let freq = 1
            
            this.svg = SVG(this.querySelector('svg'))
            this.svg.viewbox(-this.gain, -this.gain, 2*this.gain, 2*this.gain)

            this.t = Array(10 * 200).fill().map((_, i) => i / 200)
            
            this.y = this.t.map(t => 
                this.gain * Math.cos(2 * Math.PI * freq * t)
            )

            this.y = this.t.map(t => 
                this.gain * Math.cos(2 * Math.PI * freq * t + Math.PI/4)
            )
            
            this.y = this.t.map(t => 
                this.gain * Math.cos(2 * Math.PI * freq * t)
                + this.gain / 2 * Math.cos(2 * Math.PI * 2 * freq * t)
            )
            this.axis()
            this.render(1)

            this.kRange = this.querySelector('#kRange')
            this.kRange.addEventListener('input', () => this.render(this.kRange.value))
        }

        axis() {
            this.svg.line(-20, 0, 40, 0)
                .stroke({ color: 'black', width: 0.05 })
    
            this.svg.line(0, -20, 0, 40)
                .stroke({ color: 'black', width: 0.05 })
        }
    
        render(k) {
            let N = this.y.length
            let mx = 0
            let my = 0
    
            if(this.points[0] === undefined) {
                this.center = this.svg.circle(0.3)
                                        .fill('red')
            }
    
            this.y.forEach((y, n) => {
                let cx = (y/5 + 10) * Math.cos(2 * Math.PI * k * n / N)
                let cy = (y/5 + 10) * Math.sin(2 * Math.PI * k * n / N)
    
                mx += cx/N
                my += cy/N
    
                if (this.points[n] !== undefined) {
                    this.points[n].center(cx, cy)
                } else {
                    const point = this.svg.circle(0.1)
                                         .center(cx, cy)
                    this.points.push(point)
                }
            })
            this.center.center(mx, my)
        }


    }

    customElements.define('fourier-warp', FourierWarp)
}