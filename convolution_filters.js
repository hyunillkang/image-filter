function applyBoxFilter() {

    insertImageData();

    let filterSize = document.getElementById("filterSizeForBoxFilter").value;

    if (filterSize % 2 == 0) {
        alert("Filter size should be odd number");
        return;
    }

    let filter = [];
    for (let i = 0; i < filterSize; i++) {
        let temp = [];
        for (let j = 0; j < filterSize; j++) {
            temp.push(1 / (filterSize * filterSize));
        }
        filter.push(temp);
    }

    let imageMatrix = imageDataToImageMatrix(imageData);

    calculateConvolution(imageMatrix, filter);

    imageMatrixToImageData(imageMatrix);
}

function applyGaussianFilter() {

    insertImageData();

    let filterSize = document.getElementById("filterSizeForGaussianFilter").value;

    if (filterSize % 2 == 0) {
        alert("Filter size should be odd number");
        return;
    }


    let sigma = document.getElementById("sigma").value;
    let constant = 1 / (2 * Math.PI * sigma * sigma);

    let filter = [];

    for (let i = 0; i < filterSize; i++) {
        let temp = [];
        for (let j = 0; j < filterSize; j++) {
            let x = i - parseInt(filterSize / 2);
            let y = j - parseInt(filterSize / 2);
            let value = constant * Math.pow(Math.E, -(x * x + y * y) / (2 * sigma * sigma));
            temp.push(value);
        }
        filter.push(temp);
    }

    let imageMatrix = imageDataToImageMatrix(imageData);

    calculateConvolution(imageMatrix, filter);

    imageMatrixToImageData(imageMatrix);

}

function applySobelFilter() {

    insertImageData();

    let sobleDirection = document.querySelector('input[name=sobelDirection]:checked').value;
    console.log(sobleDirection);


    let xFilter = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ];

    let yFilter = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
    ];

    let imageMatrix;
    let xImageMatrix;
    let yImageMatrix;

    if (sobleDirection == 'X-Gradient' || sobleDirection == 'bi-Gradient') {

        xImageMatrix = imageDataToImageMatrix(imageData);

        calculateConvolution(xImageMatrix, xFilter);
        imageMatrix = xImageMatrix;

    }

    if (sobleDirection == 'Y-Gradient' || sobleDirection == 'bi-Gradient') {

        yImageMatrix = imageDataToImageMatrix(imageData);

        calculateConvolution(yImageMatrix, yFilter);
        imageMatrix = yImageMatrix;

    }

    if (sobleDirection == 'bi-Gradient') {
        for (let value in xImageMatrix) {
            for (let row = 0; row < xImageMatrix[value].length; row++) {
                for (let col = 0; col < xImageMatrix[value][0].length; col++) {
                    xImageMatrix[value][row][col] = Math.sqrt(
                        xImageMatrix[value][row][col] * xImageMatrix[value][row][col] +
                        yImageMatrix[value][row][col] * yImageMatrix[value][row][col])
                }
            }
        }

        imageMatrix = xImageMatrix;
    }
    imageMatrixToImageData(imageMatrix, 0);
}

function imageDataToImageMatrix() {

    let imageWidth = imageData.width;
    let imageHeight = imageData.height;


    let imageMatrix = {
        rChannel: [],
        gChannel: [],
        bChannel: [],
        aChannel: []
    };

    for (let row = 0; row < imageHeight; row++) {
        let rChannel = [];
        let gChannel = [];
        let bChannel = [];
        let aChannel = [];

        for (let col = 0; col < imageWidth; col++) {

            rChannel.push(imageData.data[imageWidth * 4 * row + 4 * col]);
            gChannel.push(imageData.data[imageWidth * 4 * row + 4 * col + 1]);
            bChannel.push(imageData.data[imageWidth * 4 * row + 4 * col + 2]);
            aChannel.push(imageData.data[imageWidth * 4 * row + 4 * col + 3]);

        }

        imageMatrix.rChannel.push(rChannel);
        imageMatrix.gChannel.push(gChannel);
        imageMatrix.bChannel.push(bChannel);
        imageMatrix.aChannel.push(aChannel);

    }



    return imageMatrix;
}

function imageMatrixToImageData(imageMatrix) {

    let imageWidth = imageData.width;
    let imageHeight = imageData.height;



    let item = [];
    for (let row = 0; row < imageHeight; row++) {
        for (let col = 0; col < imageWidth; col++) {

            imageData.data[imageWidth * 4 * row + 4 * col] = imageMatrix.rChannel[row][col];
            imageData.data[imageWidth * 4 * row + 4 * col + 1] = imageMatrix.gChannel[row][col];
            imageData.data[imageWidth * 4 * row + 4 * col + 2] = imageMatrix.bChannel[row][col];
            imageData.data[imageWidth * 4 * row + 4 * col + 3] = 255;//imageMatrix.aChannel[row][col];

            item.push([row, col, imageWidth * 4 * row + 4 * col, imageMatrix.rChannel[row][col]]);

        }
    }

    context.putImageData(imageData, 0, 0);


}

function convolutionTest() {
/*

    console.log(imageDataList);
    console.log(listIndex);
*/
    let filter = [
        [-1, -1, -1],
        [-1, 9, -1],
        [-1, -1, -1]
    ];

    let imageMatrix = imageDataToImageMatrix(imageData);

    calculateConvolution(imageMatrix, filter);


    imageMatrixToImageData(imageMatrix, 0);
}

function calculateConvolution(imageMatrix, filter) {

    let halfFilterSize = parseInt(filter.length / 2);

    let imageWidth = imageData.width;
    let imageHeight = imageData.height;



    for (let value in imageMatrix) {

        let convolutedMatrix = Array(imageHeight).fill().map(() => Array(imageWidth).fill(0));

        for (var imageRow = halfFilterSize; imageRow < imageHeight - halfFilterSize; imageRow++) {
            for (var imageCol = halfFilterSize; imageCol < imageWidth - halfFilterSize; imageCol++) {

                let convolutedValue = 0;
                //console.log(imageRow, imageCol);

                for (var filterRow = -halfFilterSize; filterRow <= halfFilterSize; filterRow++) {
                    for (var filterCol = -halfFilterSize; filterCol <= halfFilterSize; filterCol++) {
                        convolutedValue += imageMatrix[value][imageRow + filterRow][imageCol + filterCol] * filter[halfFilterSize - filterRow][halfFilterSize - filterCol];
                    }
                }
                convolutedMatrix[imageRow][imageCol] = parseInt(convolutedValue);
            }
        }

        imageMatrix[value] = convolutedMatrix;

    }


}
