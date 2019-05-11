
function applyGrayscale() {

    insertImageData();

    for (var i = 0; i < imageData.data.length; i += 4) {

        let avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        imageData.data[i] = avg;
        imageData.data[i + 1] = avg;
        imageData.data[i + 2] = avg;
        //        imageData.data[i+3] = imageData.data[i+3];

    }

    context.putImageData(imageData, 0, 0);
}

function applySepia() {
    insertImageData();

    for (var i = 0; i < imageData.data.length; i += 4) {

        imageData.data[i] = 0.393 * imageData.data[i] + 0.769 * imageData.data[i + 1] + 0.189 * imageData.data[i + 2];
        imageData.data[i] = imageData.data[i] > 255 ? 255 : parseInt(imageData.data[i]);
        
        imageData.data[i + 1] = 0.349 * imageData.data[i] + 0.686 * imageData.data[i + 1] + 0.168 * imageData.data[i + 2];
        imageData.data[i + 1] = imageData.data[i + 1] > 255 ? 255 : parseInt(imageData.data[i + 1]);
        
        imageData.data[i + 2] = 0.272 * imageData.data[i] + 0.534 * imageData.data[i + 1] + 0.131 * imageData.data[i + 2];
        imageData.data[i + 2] = imageData.data[i + 2] > 255 ? 255 : parseInt(imageData.data[i + 2]);

        //imageData.data[i+3] = imageData.data[i+3];

    }

    console.log(imageData);

    context.putImageData(imageData, 0, 0);
}

function applyInvert() {

    insertImageData();

    for (var i = 0; i < imageData.data.length; i += 4) {

        imageData.data[i] = 255 - imageData.data[i];
        imageData.data[i + 1] = 255 - imageData.data[i+1];
        imageData.data[i + 2] = 255 - imageData.data[i+2];
        //        imageData.data[i+3] = imageData.data[i+3];

    }

    context.putImageData(imageData, 0, 0);
}

function adjustRGBAChannel() {


    let imageSlider = document.getElementsByName("imageSlider");

    let redSlider = imageSlider[0];
    let greenSlider = imageSlider[1];
    let blueSlider = imageSlider[2];
    let alphaSlider = imageSlider[3];

    let convertedData = context.createImageData(imageData.width, imageData.height);
    //    let pixels = imageData.data;

    for (var i = 0; i < imageData.data.length; i += 4) {

        convertedData.data[i] = imageData.data[i] * redSlider.value / 255;
        convertedData.data[i + 1] = imageData.data[i + 1] * greenSlider.value / 255;
        convertedData.data[i + 2] = imageData.data[i + 2] * blueSlider.value / 255;
        convertedData.data[i + 3] = imageData.data[i + 3] * alphaSlider.value / 255;

    }


    context.putImageData(convertedData, 0, 0);

}

function applyRGBAChannel() {

    insertImageData();
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
}