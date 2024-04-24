fetch('inner-product/index.html')
    .then(stream => stream.text())
    .then(text => define(text))

function define(html) {
    class InnerProduct extends HTMLElement {

        xMin = 0
        xMax = 1
        yMin = -1.05
        yMax = 1.05

        SR = 20
        FACTOR = 10

        f1circles = []
        f2circles = []
        f1f2circles = []

        constructor() {
            super()

            this.innerHTML = html

            this.svgf1     = SVG(this.querySelector('svg#f1')).viewbox(0, 0, 10, 1)
            this.svgf2     = SVG(this.querySelector('svg#f2')).viewbox(0, 0, 10, 1)
            this.svgf1f2   = SVG(this.querySelector('svg#f1f2')).viewbox(0, 0, 10, 1)
            this.svgprog   = SVG(this.querySelector('svg#progress')).viewbox(0, 0.3, 10, 0.4)

            this.svgf1.line(0, 0.5, 10, 0.5)
            this.svgf2.line(0, 0.5, 10, 0.5)
            this.svgf1f2.line(0, 0.5, 10, 0.5)
            this.progress = this.svgprog.line(5, 0.5, 5, 0.5)
            this.progress_circle = this.svgprog.circle(.05).cx(5).cy(0.5)
            
            // this.progress  = this.querySelector('#inner_product')

            this.t         = new Float32Array(this.SR * this.FACTOR).fill().map((_, i) => i / (this.SR * this.FACTOR))
            
            this.f1        = this.t.map((t, _) => Math.sin(2 * Math.PI * 5 * t)) 
            this.f2        = this.t.map((t, _) => Math.sin(2 * Math.PI * 5 * t))

            this.update()
        }

        plot(svg, svgelem, path) {
            if (svgelem == undefined) {
                svgelem = svg.path()
                svgelem.plot(path)
            } else {
                svgelem.animate().plot(path)
            }
            return svgelem
        }

        update() {
            // Compute multiplication
            this.dot = this.t.map((_, t) => this.f1[t] * this.f2[t])
            this.product = this.dot.reduce((acc, v) => acc + v)

            // Plot f1
            let f1path = this.getPath(this.t, this.f1)
            this.f1path = this.plot(this.svgf1, this.f1path, f1path)
            

            this.f1.forEach((y, k) => {
                if (k % this.FACTOR == 0) {
                    let k2 = k / this.FACTOR 
                    let point = this.scale({x: this.t[k], y: y})
                    if (this.f1circles.length == k2) {
                        this.f1circles.push(
                            this.svgf1.circle(0.03)
                                .cx(point.x)
                                .cy(point.y)
                        )
                    } else {
                        this.f1circles[k2].animate()
                                .cx(point.x)
                                .cy(point.y)
                    }
                }
            })

            // Plot f2
            let f2path = this.getPath(this.t, this.f2)
            this.f2path = this.plot(this.svgf2, this.f2path, f2path)

            this.f2.forEach((y, k) => {
                if (k % this.FACTOR == 0) {
                    let k2 = k / this.FACTOR 
                    let point = this.scale({x: this.t[k], y: y})
                    if (this.f2circles.length == k2) {
                        this.f2circles.push(
                            this.svgf2.circle(0.03)
                                .cx(point.x)
                                .cy(point.y)
                        )
                    } else {
                        this.f2circles[k2].animate()
                                .cx(point.x)
                                .cy(point.y)
                    }
                }
            })

            let f1f2path = 'M 0 0.5 L ' + this.getPath(this.t, this.dot).slice(1) + 'L 10 0.5 '
            this.f1f2path = this.plot(this.svgf1f2, this.f1f2path, f1f2path)

            this.dot.forEach((y, k) => {
                if (k % this.FACTOR == 0) {
                    let k2 = k / this.FACTOR 
                    let point = this.scale({x: this.t[k], y: y})
                    if (this.f1f2circles.length == k2) {
                        this.f1f2circles.push(
                            this.svgf1f2.circle(0.03)
                                .cx(point.x)
                                .cy(point.y)
                        )
                    } else {
                        this.f1f2circles[k2].animate()
                                .cx(point.x)
                                .cy(point.y)
                    }
                }
            })

            let x = 5 + this.product / 200 * 5
            this.progress.animate().plot(5, 0.5, x, 0.5)
            this.progress_circle.animate().cx(x)
        }

        getPath(t, y) {
            return y.reduce(
                (acc, curr, k) => {
                    let point = this.scale({x: t[k], y: curr})
                    if(k == 0) return `M ${point.x} ${point.y} `
                    return acc + `L ${point.x} ${point.y} `
                }, '')
        }

        scale(point) {
            let xPerc = (point.x - this.xMin) / (this.xMax - this.xMin)
            let yPerc = (point.y - this.yMin) / (this.yMax - this.yMin)
            return {x: xPerc * this.svgf1.viewbox().width, y: this.svgf1.viewbox().height * (1 - yPerc)}
        }

    }

    customElements.define('inner-product', InnerProduct)
}