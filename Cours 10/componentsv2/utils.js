function quantize(y, n_bit) {
	let n = Math.pow(2, n_bit - 1)
	return y.map(y => 
		Math.ceil(y * n) / n
	)
}

export {quantize}