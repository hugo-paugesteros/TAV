SVG.Svg.prototype.viewrange = function(xMin, xMax, yMin, yMax) {
    this.xMin = xMin
    this.xMax = xMax
    this.yMin = yMin
    this.yMax = yMax
    return this
}

SVG.Svg.prototype.scale = function(point) {
    if (this.xMin === undefined || this.xMax === undefined || this.yMin === undefined || this.yMax === undefined) {
        return {x: point.x, y: point.y}
    }
    if (point.x === undefined) { point.x = 0 }
    if (point.y === undefined) { point.y = 0 }
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

// let old = SVG.Line.prototype.plot
// SVG.Line.prototype.plot = function(x1, y1, x2, y2) {
//     let point1 = this.parent().scale({x: x1, y: y1})
//     let point2 = this.parent().scale({x: x2, y: y2})
//     old.call(this, point1.x, point1.y, point2.x, point2.y)
// }

// (function(old) {
//     console.log(old)
//     SVG.Line.prototype.plot = function(x1, x2, y1, y2) {
//         let point1 = this.scale({x: x1, y: y1})
//         let point2 = this.scale({x: x2, y: y2})
//         old.call(this, point1.x, point2.x, point1.y, point2.y)
//     }
// }(SVG.Line.prototype.plot))