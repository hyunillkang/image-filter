
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

context.fillRect(0, 0, canvas.width, canvas.height);

const uploader = document.getElementById("uploader");

canvas.addEventListener("click", function (e) {
    getColorData(e);
});

uploader.addEventListener("change", function (e) {
    uploadImage(e);
});

let imageData;
let image = new Image();

image.onload = function () {
    canvas.width = this.width;
    canvas.height = this.height;
    context.drawImage(image, 0, 0, this.width, this.height);
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    console.log(imageData);

}

image.src = "hedgehog.jpg";



function uploadImage(e) {
    let file = e.target.files[0];
    if (file == undefined) {
        return;
    }

    let url = URL.createObjectURL(file);

    let image = new Image();
    image.onload = function () {
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(image, 0, 0, this.width, this.height);

        imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        console.log(imageData);
    }

    image.src = url;
}

function getColorData(e) {

    var color = document.getElementById("color");
    color.innerText = e.clientX + ", " + e.clientY;
    let pixel = context.getImageData(e.offsetX, e.offsetY, 1, 1).data;
    let rgba = "rgba(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ", " + pixel[3] + ")";

    color.style.background = rgba;
}

function recoverImageToOriginal() {
    context.putImageData(imageData, 0, 0);
}

function imageDataToImageMatrix() {

    let imageWidth = imageData.width;
    let imageHeight = imageData.height;

    console.log(imageData);

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

            convertedData.data[imageWidth * 4 * row + 4 * col] = imageMatrix.rChannel[row][col];
            convertedData.data[imageWidth * 4 * row + 4 * col + 1] = imageMatrix.gChannel[row][col];
            convertedData.data[imageWidth * 4 * row + 4 * col + 2] = imageMatrix.bChannel[row][col];
            convertedData.data[imageWidth * 4 * row + 4 * col + 3] = imageMatrix.aChannel[row][col];

            item.push([row, col, imageWidth * 4 * row + 4 * col, imageMatrix.rChannel[row][col]]);

        }
    }

    context.putImageData(convertedData, 0, 0);

}

function convolutionTest() {

    let filterSize = 7;
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
