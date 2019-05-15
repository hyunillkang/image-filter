
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

context.fillRect(0, 0, canvas.width, canvas.height);

const uploader = document.getElementById("uploader");


uploader.addEventListener("change", function (e) {
    uploadImage(e);
});


let originalImageData;
let imageData;

let imageDataList = [];
let listIndex = 0;

uploadImage();

function uploadImage(e) {

    let url;

    if (e != undefined) {
        let file = e.target.files[0];
        if (file == undefined) {
            return;
        }
        url = URL.createObjectURL(file);
    } else {
        url = "src/hedgehog.jpg";
    }

    let image = new Image();
    image.onload = function () {
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(image, 0, 0, this.width, this.height);

        imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        originalImageData = copyImageData(imageData);       
//        insertImageData(); 
    }

    image.src = url;
}

function copyImageData(copyingImageData) {
    
    let copiedImageData;

    copiedImageData = context.createImageData(copyingImageData.width, copyingImageData.height);

    for(var i = 0; i < copyingImageData.data.length; i += 4) {
        copiedImageData.data[i] = copyingImageData.data[i];
        copiedImageData.data[i+1] = copyingImageData.data[i+1];
        copiedImageData.data[i+2] = copyingImageData.data[i+2];
        copiedImageData.data[i+3] = copyingImageData.data[i+3];
    }


    return copiedImageData;
}

function recoverImageToOriginal() {

    insertImageData();

    context.putImageData(originalImageData, 0, 0);
    imageData = copyImageData(originalImageData);
}

function insertImageData() {
    if(imageDataList.length == 10) {
        imageDataList.splice(0, 1);
        listIndex--;
    }

    imageDataList.push(copyImageData(imageData));
    listIndex++;

}

function undoImageFilter() {
    console.log(listIndex);
    imageDataList.splice(listIndex);
    listIndex--;
    if(listIndex < 0) {
        listIndex = 0;
        return;
    }
    
    imageData = imageDataList[listIndex];

    console.log(imageDataList);

    context.putImageData(imageData, 0, 0);
}
