function quantize(y, n_bit) {
	let n = Math.pow(2, n_bit - 1)
	// return y.map(y => Math.floor((y+1)/2 * n) / n * 2 - 1)
	return y.map(y => Math.floor(y * n) / n)
}

export {quantize}