// TODO: Получить данные по Апи
// TODO: Вставить слово в Контейнер (results word)
// TODO: Добавить фукнционал для воспроизвидения звука
// TODO: Вставить в контейнер с результатами

let state = {
	word: "",
	meanings: [],
	phonetics: [],
};


const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const input = document.getElementById('word-input');
const form = document.querySelector('.form');
const containerWord = document.querySelector('.results-word');
const soundButton = document.querySelector('.results-sound');
const resultsWrapper = document.querySelector('.results');
const resultsList = document.querySelector('.results-list');
const errorConinaer = document.querySelector('.error');


const showError = (error) => {
	errorConinaer.style.display = "block"
	resultsWrapper.style.display = "none"

	errorConinaer.innerText = error.message;
};

const renderDefinition = (itemDefinition) => {
	const example = itemDefinition.example
		? `<div class="results-item__example">
		<p>Example: <span>${itemDefinition.example}</span></p>
		</div>`
		: ""

	return `<div class="results-item__definitions">
				<p>${itemDefinition.definition}</p>
				${example}
				</div>`;
};

const getDefinitions = (definitions) => definitions.map(renderDefinition).join("");



const renderItem = (item) => {
	return `
	<div class="results-item">
	<div class="results-item__part">${item.partOfSpeech}</div>
	<div class="results-item__definitions">
	${getDefinitions(item.definitions)}
	</div>
</div>
`;
}

const showResults = () => {
	resultsWrapper.style.display = "block";
	resultsList.innerHTML = "";

	state.meanings.forEach((item) => (resultsList.innerHTML += renderItem(item)));
};

const insertWord = () => {
	containerWord.innerText = state.word;
}

const handleSubmit = async (e) => {
	e.preventDefault();

	errorConinaer.style.display = "none"

	if (!state.word.trim()) return;

	try {
		const response = await fetch(`${url}${state.word}`);
		const data = await response.json();

		if (response.ok && data.length) {
			const item = data[0];


			state = {
				...state,
				meanings: item.meanings,
				phonetics: item.phonetics,
			}

			insertWord();
			showResults();
		} else {
			showError(data);
		}
	} catch (err) {
		console.log(err);
	}
};


const handleKeyUp = (e) => {
	const value = e.target.value;

	state.word = value;
};


const hamdleSound = () => {
	if (state.phonetics.length) {
		const sound = state.phonetics[0];

		if (sound.audio) {
			new Audio(sound.audio).play();
		}
	}
};


// EVENTST
input.addEventListener('keyup', handleKeyUp);
form.addEventListener('submit', handleSubmit);
soundButton.addEventListener('click', hamdleSound);