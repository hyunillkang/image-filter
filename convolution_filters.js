function applyBoxFilter() {
    let filterSize = document.getElementById("filterSize").value;

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

    let filterSize = document.getElementById("filterSize").value;

    if (filterSize % 2 == 0) {
        alert("Filter size should be odd number");
        return;
    }


    let sigma = document.getElementById("sigma").value;
    let constant = 1 / (2 * Math.PI * sigma * sigma);
    console.log(constant);

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

    let convertedData = context.createImageData(imageWidth, imageHeight);


    let item = [];
    for (let row = 0; row < imageHeight; row++) {
        for (let col = 0; col < imageWidth; col++) {

            convertedData.data[imageWidth * 4 * row + 4 * col] = imageMatrix.rChannel[row][col];// + 255;
            convertedData.data[imageWidth * 4 * row + 4 * col + 1] = imageMatrix.gChannel[row][col];// + 255;
            convertedData.data[imageWidth * 4 * row + 4 * col + 2] = imageMatrix.bChannel[row][col];// + 255;
            convertedData.data[imageWidth * 4 * row + 4 * col + 3] = 255;//imageMatrix.aChannel[row][col];

            item.push([row, col, imageWidth * 4 * row + 4 * col, imageMatrix.rChannel[row][col]]);

        }
    }

    context.putImageData(convertedData, 0, 0);

}

function convolutionTest() {

    let filter = [
        [-1, 0, 1],
        [-1, 0, 1],
        [-1, 0, 1]
    ];

    let imageMatrix = imageDataToImageMatrix(imageData);
    console.log(imageMatrix);
    calculateConvolution(imageMatrix, filter);

    imageMatrixToImageData(imageMatrix);
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
