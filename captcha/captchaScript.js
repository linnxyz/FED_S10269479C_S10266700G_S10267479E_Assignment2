// Select input and message elements
const inputField = document.getElementById("userInput");
const messageDiv = document.getElementById("message");
const loaderContainer = document.querySelector(".loader-container");




function captcha(predefinedWords){

    // Listen for input event on the input field
    inputField.addEventListener("input", () => {
        const userInput = inputField.value.trim().toLowerCase(); // Convert input to lowercase and trim spaces
        const words = userInput.split(/\s+/); // Split input into individual words
    
        // Count how many predefined words are in the input
        const matchingWordsCount = words.filter(word => predefinedWords.includes(word)).length;
    
        // Validate: Check if at least 3 predefined words are present
        if (matchingWordsCount >= 3) {
            messageDiv.textContent = "";
            inputField.style.borderColor = "#35ce4a";
            inputField.disabled = true;
            setTimeout(() => {
                window.location.href = "../index.html"
            }, 1000);

            
        } else {
            messageDiv.textContent = `Please include everything you see (${matchingWordsCount}/3).`;
            messageDiv.style.color = "red";
        }
    });
}

const image = document.getElementById("captchaImage");

const dog = ["dog", "chasing", "following", "running", "frisbee", "red", "park"];
const dogSrc = "https://img1.wsimg.com/isteam/stock/nbl5KlA";

const cat = ["cat", "plant", "looking", "staring"];
const catSrc = "https://www.humanesociety.org/sites/default/files/styles/768x326/public/2023-05/cat-grass-116668.jpg?h=464bc339&itok=U6H-jUuu";

const bird = ["bird", "sunflower", "sunflowers","flower", "flowers", "blue", "small", "yellow"];
const birdSrc = "https://www.lyricbirdfood.com/media/1739/indigo-bunting-bird-on-sunflowers.jpg?crop=0.0000000000000001263187085796,0.033665206552867186,0,0.03948446902175063&cropmode=percentage&width=700&height=365&rnd=133658806070000000";

const UniDog = ["dog", "unicorn", "tongue", "shirt", "stars", "mask"];
const UniDogSrc = "https://images.lifestyleasia.com/wp-content/uploads/sites/7/2021/03/09094056/137050737_411742716747464_7113369430332059484_n-e1615263120371.jpg";

const glassesDog = ["dog", "wearing", "glasses", "sunglasses", "pink", "red"];
const glassesDogSrc = "https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

const readingRabbit = ["rabbit", "reading", "book", "glasses", "white"];
const readingRabbitSrc = "https://images.pexels.com/photos/4588428/pexels-photo-4588428.jpeg";

let min = 1;
let max = 6;

function generate(){
    let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;

    if (randomInt === 1){
        image.src = dogSrc;
        captcha(dog);
    }
    else if (randomInt === 2){
        image.src = catSrc;
        captcha(cat)
    } 
    else if (randomInt === 3){
        image.src = birdSrc;
        captcha(bird)
    }
    else if (randomInt === 4){
        image.src = UniDogSrc;
        captcha(UniDog)
    }
    else if (randomInt === 5){
        image.src = glassesDogSrc;
        captcha(glassesDog)
    }
    else if (randomInt === 6){
        image.src = readingRabbitSrc;
        captcha(readingRabbit)
    }
}


generate();
setTimeout(() => {
    loaderContainer.style.display = "none";
  }, 1500);




