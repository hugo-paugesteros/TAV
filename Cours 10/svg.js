SVG.Svg.prototype.viewrange = function(xMin, xMax, yMin, yMax) {
    this.xMin = xMin
    this.xMax = xMax
    this.yMin = yMin
    this.yMax = yMax
    return this
}

SVG.Svg.prototype.scale = function(point) {
    let xPerc = (point.x - this.xMin) / (this.xMax - this.xMin)
    let yPerc = (point.y - this.yMin) / (this.yMax - this.yMin)
    return {x: xPerc * this.viewbox().width, y: this.viewbox().height * (1 - yPerc)}
}

SVG.Svg.prototype.getPath = function(x, y) {
    return y.reduce(
    (acc, curr, k) => {
        let point = this.scale({x: x[k], y: curr})
        if(k == 0) return `M ${point.x} ${point.y} `
        return acc + `L ${point.x} ${point.y} `
    }, '')
}