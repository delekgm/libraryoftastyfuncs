// Simple pow
function exponentialScaling(x, a = 0.5) {
    if (x > 0.5) {
        return Math.pow(x, 1 / a);
    } else {
        return 1 - Math.pow(1 - x, a);
    }
}

// Sigmoid function
function sigmoidStretching(x, k = 10) {
    return 1 / (1 + Math.exp(-k * (x - 0.5)));
}

// Expand range
function inverseMapping(x, c = 5) {
    return Math.atan(c * (x - 0.5)) / Math.PI + 0.5;
}

// CDF
function CDFStretching(noiseArray) {
    // Step 1: Sort the noise array and create a map for the CDF values
    let sorted = [...noiseArray].sort((a, b) => a - b);
    let cdfMap = new Map();

    // Step 2: Calculate the CDF for each unique value
    sorted.forEach((value, index) => {
        if (!cdfMap.has(value)) {
            // CDF = (rank of the value) / (total number of values)
            let cdfValue = (index + 1) / sorted.length;
            cdfMap.set(value, cdfValue);
        }
    });

    // Step 3: Map original noise values to their CDF-transformed values
    return noiseArray.map(x => cdfMap.get(x));
}
