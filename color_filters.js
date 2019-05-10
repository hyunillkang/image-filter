function convertImageToGrayscale() {

    let convertedData = context.createImageData(imageData.width, imageData.height);
    let pixels = imageData.data;


    for(var i = 0; i < pixels.length; i += 4) {

        let avg = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3;
        convertedData.data[i] = avg;
        convertedData.data[i+1] = avg;
        convertedData.data[i+2] = avg;
        convertedData.data[i+3] = pixels[i+3];

    }

    context.putImageData(convertedData, 0, 0);
}

function convertImageColor() {


    let imageSlider = document.getElementsByName("imageSlider");
    
    let redSlider = imageSlider[0];
    let greenSlider = imageSlider[1];
    let blueSlider = imageSlider[2];
    let alphaSlider = imageSlider[3];

    let convertedData = context.createImageData(imageData.width, imageData.height);
    let pixels = imageData.data;
    
    for(var i = 0; i < pixels.length; i += 4) {

        convertedData.data[i] = pixels[i] * redSlider.value/255;
        convertedData.data[i+1] = pixels[i+1] * greenSlider.value/255;
        convertedData.data[i+2] = pixels[i+2] * blueSlider.value/255;
        convertedData.data[i+3] = pixels[i+3] * alphaSlider.value/255;

    }


    context.putImageData(convertedData, 0, 0);



}