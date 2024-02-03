// 1) Get DOM elements

const resultElement = 
document.getElementById("result");
const pokemonImageElement = 
document.getElementById("pokemonImage");
const optionsContainer = 
document.getElementById("options");
const pointsElement = 
document.getElementById("pointsValue");
const totalCount = 
document.getElementById("totalCount");
const mainContainer = 
document.getElementsByClassName("container");
const loadingContainer = 
document.getElementById("loadingContainer");

// Variables
let usedPokemonIds=[];
let count = 0;
let points = 0;
let showLoading = false;

// 2) Create function fetch one pokemon with an ID

async function fetchPokemonById(id){
    showLoading = true; 
    const responce = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await responce.json();
    return data;
}

// 4) Function to load questions with options
async function loadQuestionWithOptions(){
    if (showLoading){
        showLoadingWindow();
        hidePuzzleWindow();
    }
    let pokemonId = getRandomPokemonId();

    while (usedPokemonIds.includes(pokemonId)){
        pokemonId = getRandomPokemonId();
    }
    usedPokemonIds.push(pokemonId);
    const pokemon = await fetchPokemonById(pokemonId);
    // option array
    const options = [pokemon.name];
    const optionsIds = [pokemon.id];
    //addtitional options
    while(options.length < 4){
        let randomPokemonId = getRandomPokemonId();
        while (optionsIds.includes(randomPokemonId)){
            randomPokemonId = getRandomPokemonId();
        }
        optionsIds.push(randomPokemonId);
        const randomPokemon = await fetchPokemonById(randomPokemonId);
        const randomOption = randomPokemon.name;
        options.push(randomOption);

        console.log(options);
        console.log(optionsIds);

        if (options.length === 4){
            showLoading = false;
        }
    }

    shuffleArray(options);

    resultElement.textContent = "who is that Pokemon?";
    pokemonImageElement.src= pokemon.sprites.other.dream_world.front_default; 

    optionsContainer.innerHTML = ""; 
    options.forEach((option)=>{
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = (event) => checkAnswer(option === pokemon.name, event);
        optionsContainer.appendChild(button);
    });

    if (!showLoading){
        hideLoadingWindow();
        showPuzzleWindow();
    }
}

// function to check the answer
function checkAnswer(isCorrect, event){
    const selectedButton = document.querySelector(".selected");
    if (selectedButton){
        return;
    }
    event.target.classList.add("selected");
    count++;
    totalCount.textContent = count;

    if (isCorrect){
        displayResult("Correct answer!");
        points++;
        pointsElement.textContent = points;
        event.target.classList.add("correct");
    } else {
        displayResult("Wrong answer...");
        
        event.target.classList.add("wrong");
    } 

    //load the next questions
    setTimeout(()=>{
        showLoading = true; 
        loadQuestionWithOptions();
    }, 1000);

}

// Loading...
loadQuestionWithOptions();

//----- Utilities Functions -------

// 3) function to randomize the id
function getRandomPokemonId(){
    return Math.floor(Math.random() * 151) + 1 ;
}

// function to shuffle the array 
function shuffleArray(array){

    return array.sort(()=> Math.random()- 0.5);
}

// function to update result text and class name
function displayResult(result){
    resultElement.textContent = result;
}

// function to hide loading
 function hideLoadingWindow(){
    loadingContainer.classList.add("hide");
}

// function to show loading
function showLoadingWindow(){
    mainContainer[0].classList.remove("show");
    loadingContainer.classList.remove("hide");
    loadingContainer.classList.add("show");
}

// function to show puzzle window
function showPuzzleWindow(){
    loadingContainer.classList.remove("show");
    mainContainer[0].classList.remove("hide");
    mainContainer[0].classList.add("show");
}

// function to hide puzzle window
function hidePuzzleWindow(){
    mainContainer[0].classList.add("hide");
}
