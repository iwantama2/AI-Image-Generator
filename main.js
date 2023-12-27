const apiKey = "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";

const maxImages = 6;
let selectedImageNumber = null;

// fungsi untuk mengenerate gambar

function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// fungsi untuk menbatalkan sebelum proses
function disableGenerateButton(){
    document.getElementById("generate").disabled = true;
}

// fungsi untuk memulai generate proses
function enableGenerateButton(){
    document.getElementById("generate").disabled = false;
}

//fungsi untuk menghapus/restart
function clearImageGrid(){
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}

//fungsi untuk mengenerate gambar
async function generateImages(input){
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];

    for(let i = 0; i < maxImages; i++){
        //Generate gambar 
        const randomNumber = getRandomNumber(1, 1000);
        const prompt = `${input} ${randomNumber}`;

        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ inputs: prompt}),
            }
        );

        if(!response.ok){
            alert("Gagal Membuat Gambar!");
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }

    loading.style.display = "none";
    enableGenerateButton();

    selectedImageNumber = null;

}

document.getElementById("generate").addEventListener('click', () =>{
    const input = document.getElementById("user-prompt").value;
    generateImages(input);
});

function downloadImage(imgUrl, imageNumber){
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}