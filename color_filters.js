
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
        imageData.data[i + 1] = 255 - imageData.data[i + 1];
        imageData.data[i + 2] = 255 - imageData.data[i + 2];
        //        imageData.data[i+3] = imageData.data[i+3];

    }

    context.putImageData(imageData, 0, 0);
}

function adjustRGBAChannel() {


    let rgbaSlider = document.getElementsByName("rgbaSlider");

    let redSlider = rgbaSlider[0];
    let greenSlider = rgbaSlider[1];
    let blueSlider = rgbaSlider[2];
    let alphaSlider = rgbaSlider[3];

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

function adjustBrightness() {

    let brightnessSlider = document.getElementsByName("brightnessSlider");

    let brightness = brightnessSlider[0].value / 50;

    let convertedData = context.createImageData(imageData.width, imageData.height);

    for (var i = 0; i < imageData.data.length; i += 4) {

        convertedData.data[i] = imageData.data[i] * brightness;
        convertedData.data[i + 1] = imageData.data[i + 1] * brightness;
        convertedData.data[i + 2] = imageData.data[i + 2] * brightness;
        convertedData.data[i + 3] = imageData.data[i + 3];

    }


    context.putImageData(convertedData, 0, 0);
}

function adjustHSBChannel() {
    let hsbSlider = document.getElementsByName("hsbSlider");

    let hueSlider = hsbSlider[0];
    let saturationSlider = hsbSlider[1];
    let valueSlider = hsbSlider[2];

    let hue = hueSlider.value;
    let saturation = saturationSlider.value / 100;
    let value = valueSlider.value / 100;

    //let a = (1 - Math.abs(2*value - 1)) * saturation;
    let a = value * saturation;
    console.log(a);
    let b = a * (1 - Math.abs((hue / 60) % 2 - 1));
    console.log(b);
    //    let c = value - a/2;
    let c = value - a;

    let tempR = 0;
    let tempG = 0;
    let tempB = 0;

    if ((0 <= hue && hue < 60) || hue == 360) {
        tempR = a;
        tempG = b;
    } else if (60 <= hue && hue < 120) {
        tempR = b;
        tempG = a;
    } else if (120 <= hue && hue < 180) {
        tempG = a;
        tempB = b;
    } else if (180 <= hue && hue < 240) {
        tempG = b;
        tempB = a;
    } else if (240 <= hue && hue < 300) {
        tempR = b;
        tempG = a;
    } else if (300 <= hue && hue < 360) {
        tempR = a;
        tempG = b;
    }


    let convertedData = context.createImageData(imageData.width, imageData.height);

    for (var i = 0; i < imageData.data.length; i += 4) {

        convertedData.data[i] = (tempR + c) * imageData.data[i]
        convertedData.data[i + 1] = (tempG + c) * imageData.data[i + 1]
        convertedData.data[i + 2] = (tempB + c) * imageData.data[i + 2]
        convertedData.data[i + 3] = imageData.data[i + 3];

    }


    context.putImageData(convertedData, 0, 0);
} 