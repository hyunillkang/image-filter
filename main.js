
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

context.fillRect(0, 0, canvas.width, canvas.height);

const uploader = document.getElementById("uploader");

/*
canvas.addEventListener("click", function (e) {
    getColorData(e);
});*/

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

image.src = "src/hedgehog.jpg";



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
