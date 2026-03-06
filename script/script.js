

//  for sound of words
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}



// work flow 4 ============================================================

const manageSpinner = (isLoading) => {
    const spinnerSection = document.getElementById('spinner');
    if (isLoading) {
        spinnerSection.classList.remove('hidden');
        document.getElementById('wordContainer').classList.add('hidden');
    } else {
        spinnerSection.classList.add("hidden");
        document.getElementById("wordContainer").classList.remove("hidden");
    }
}

const createElement = (synonyms) => {
    const arr = synonyms.map(el => `<span class="btn" >${el}</span>`)
    return arr.join(' ');
}

const WordDeatails = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    displayWordDetails(data.data);
}
// id: 5;
// level: 1;
// meaning: "আগ্রহী";
// partsOfSpeech: "adjective";
// points: 1;
// pronunciation: "ইগার";
// sentence: "The kids were eager to open their gifts.";
// synonyms: (3)[("enthusiastic", "excited", "keen")];
// word: "Eager";


const displayWordDetails = (data) => {
    const wordDetailsContainer = document.getElementById('wordDetailsContainer');
    console.log(data);
    wordDetailsContainer.innerHTML = `
         <div class="space-y-1">
            <h3 class="text-lg font-bold">${data.word} (<i class="fa-etch fa-solid fa-microphone"></i> :${data.pronunciation})</h3>
        </div>
        <div class="space-y-1">
            <p class="  font-bold">Meaning</p>
            <p class="">${data.meaning ? data.meaning: "meaning not found"}</p>
        </div>
        <div class="space-y-1">
            <p class=" font-bold">Example</p>
            <p class="">${data.sentence ? data.sentence: "example not found"}</p>
        </div>
        <div class="space-y-1">
            <p class="  font-bold">synonym</p>
            <p>${createElement(data.synonyms)} </p>
        </div>
    
    `;
    my_modal_5.showModal();
    //  <p>${data.synonyms && data.synonyms.length > 0 ? data.synonyms.map(s => `<span class="btn ">${s}</span>`).join(' ') : "synonym not found"}</p>
}




// work flow 3 ============================================================

const removeActive = () => {
    const allLessons = document.querySelectorAll('.lessonBtn');
    allLessons.forEach(element => element.classList.remove('Active'));
}

// id: 105;
// level: 2;
// meaning: "বৃষ্টি";
// pronunciation: "রেইন";
// word: "Rain";


// work flow 2 ======================================================

const words = (data) => {
    // console.log(data);
    const cardContainer = document.getElementById('wordContainer');
    cardContainer.textContent = '';
    if (data.length == 0) {
        const div = document.createElement('div');
        div.classList.add('col-span-3', 'text-center', 'space-y-4', 'bangla-font');
        div.innerHTML = `
            <img class="mx-auto" src="./assets/alert-error.png" alt="">
            <p>এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <p class="text-3xl font-bold">নেক্সট Lesson এ যান</p>
        `;
        cardContainer.appendChild(div);
        manageSpinner(false);
        return;
    }
    data.forEach(element => {
        // console.log(element);
        const div = document.createElement('div');
        div.innerHTML = `
             <div class="bg-white p-10 space-y-4 text-center shadow-lg rounded-lg">
            <h2 class="text-2xl font-bold">${element.word ? element.word : "শব্দ পাওয়া যায়নি"}</h2>
            <p class="font-medium">Meaning / Pronunciation</p>
            <p class="bangla-font text-2xl font-semibold">"${element.meaning ? element.meaning : "অর্থ পাওয়া যায়নি"} / ${element.pronunciation ? element.pronunciation : "উচ্চারণ পাওয়া যায়নি"}"</p>
            <div class="flex justify-between">
                <button onclick="WordDeatails(${element.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80] "><i class="fa-sharp fa-solid fa-circle-info"></i></button>
                <button onclick=pronounceWord('${element.word}') class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-sharp fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `;
        cardContainer.appendChild(div);
    });
    manageSpinner(false);
}


const loadWords = async (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    // words(data.data);
    // ================= part of work flow 3 start =================
    removeActive();
    const clicklesson = document.getElementById(`lesson-${id}`);
    clicklesson.classList.add('Active');
        // =================part of work flow 3 end=================
    words(data.data);
}


// work step 1 ===========================================================


const Loadlesson = async () => {
    const url = 'https://openapi.programming-hero.com/api/levels/all';
    const res = await fetch(url);
    const data = await res.json();
    displayLesson(data);
    // console.log(data);
};


const displayLesson = lesson => {
    // 1. get the container and empty it
    const allLevels = document.getElementById('all-levels');
    allLevels.textContent = '';
    // 2. loop through the array 
    lesson.data.forEach(element => {
        // 2.1 create a div
        const div = document.createElement('div');

        // 2.2 set the innerHTML of the div
        div.innerHTML = `
            <button id="lesson-${element.level_no}" onclick="loadWords(${element.level_no})" class="btn btn-outline btn-primary lessonBtn"><i class="fa-etch fa-solid fa-book-open"></i> Lession-${element.level_no}</button>
        `;
        // 2.3 append the div to the container
        allLevels.appendChild(div);
    });
           
};

Loadlesson();

document.getElementById('searchBtn').addEventListener('click', () => {
    removeActive();
    const inputValue = document.getElementById('input').value.trim().toLowerCase();
    // console.log(inputValue);
    // use of trim() means remove whitespace from both ends of a string

    fetch("https://openapi.programming-hero.com/api/words/all")
        .then(res => res.json())
        .then(data => {
            const allWords = data.data;
            const foundWords = allWords.filter(word => word.word.toLowerCase().includes(inputValue));
            if(foundWords.length === 0){
                alert("No words found");
                return;
            }
            words(foundWords);

        });
});