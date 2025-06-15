document.addEventListener('DOMContentLoaded', function() {
  const words = [
    { foreign: "Apple", native: "Яблоко", example: "An apple a day keeps the doctor away." },
    { foreign: "Book", native: "Книга", example: "I am reading a book." },
    { foreign: "Cat", native: "Кот", example: "The cat is sleeping." },
    { foreign: "Dog", native: "Собака", example: "The dog is barking." },
    { foreign: "House", native: "Дом", example: "This is my house." }
  ];

  let currentWordIndex = 0;
  let isExamMode = false;
  let selectedCards = [];
  let correctPairs = 0;
  let startTime;
  let timerInterval;

  const cardFront = document.getElementById('card-front');
  const cardBack = document.getElementById('card-back');
  const currentWordElement = document.getElementById('current-word');
  const totalWordElement = document.getElementById('total-word');
  const backButton = document.getElementById('back');
  const nextButton = document.getElementById('next');
  const examButton = document.getElementById('exam');
  const shuffleButton = document.getElementById('shuffle-words');
  const examCardsContainer = document.getElementById('exam-cards');
  const studyModeElement = document.getElementById('study-mode');
  const examModeElement = document.getElementById('exam-mode');
  const sliderElement = document.getElementById('slider');
  const correctPercentElement = document.getElementById('correct-percent');
  const timeElement = document.getElementById('time');
  const flipCard = document.querySelector('.flip-card');

  function init() {
    updateWord();
    totalWordElement.textContent = words.length;
  }

  function updateWord() {
    const word = words[currentWordIndex];
    cardFront.querySelector('h1').textContent = word.foreign;
    cardBack.querySelector('h1').textContent = word.native;
    cardBack.querySelector('span').textContent = word.example;
    currentWordElement.textContent = currentWordIndex + 1;
    updateButtons();
  }

  function updateButtons() {
    backButton.disabled = currentWordIndex === 0;
    nextButton.disabled = currentWordIndex === words.length - 1;
  }

  backButton.addEventListener('click', function() {
    if (currentWordIndex > 0) {
      currentWordIndex--;
      updateWord();
    }
  });

  nextButton.addEventListener('click', function() {
    if (currentWordIndex < words.length - 1) {
      currentWordIndex++;
      updateWord();
    }
  });

  examButton.addEventListener('click', function() {
    isExamMode = true;
    studyModeElement.classList.add('hidden');
    examModeElement.classList.remove('hidden');
    examCardsContainer.innerHTML = '';
    selectedCards = [];
    correctPairs = 0;
    startTime = new Date();
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);

    const allCards = [...words, ...words]
    .map((word, index) => ({
      id: index < words.length ? index : index - words.length,
      text: index < words.length ? word.foreign : word.native,
      type: index < words.length ? 'foreign' : 'native'
    }))
    .sort(() => Math.random() - 0.5);

    allCards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = 'card';
      cardElement.textContent = card.text;
      cardElement.dataset.id = card.id;
      cardElement.dataset.type = card.type;
      cardElement.addEventListener('click', handleCardClick);
      examCardsContainer.appendChild(cardElement);
    });
  });

  function handleCardClick(event) {
    const card = event.target;
    if (selectedCards.length < 2 && !card.classList.contains('correct') && !card.classList.contains('fade-out')) {
      card.classList.add(selectedCards.length === 0 ? 'correct' : 'selected');
      selectedCards.push(card);

      if (selectedCards.length === 2) {
        const [firstCard, secondCard] = selectedCards;
        const firstCardId = +firstCard.dataset.id;
        const secondCardId = +secondCard.dataset.id;

        if (firstCardId === secondCardId && firstCard.dataset.type !== secondCard.dataset.type) {
          setTimeout(() => {
            firstCard.classList.add('correct');
            secondCard.classList.add('correct');
            setTimeout(() => {
              firstCard.classList.add('fade-out');
              secondCard.classList.add('fade-out');
            
              correctPairs++;
              correctPercentElement.textContent = `${Math.round((correctPairs / words.length) * 100)}%`;

            if (correctPairs === words.length) {
              clearInterval(timerInterval);
              setTimeout(() => alert('Поздравляем! Вы успешно завершили тестирование.'), 500);
            }
            
            selectedCards = [];
            }, 500);
          }, 500);  
        } else {
          setTimeout(() => {
            firstCard.classList.remove('correct');
            secondCard.classList.remove('selected');
            secondCard.classList.add('wrong');
            setTimeout(() => {
              secondCard.classList.remove('wrong');
            }, 500);
            selectedCards = [];
          }, 500);
        }
      }
    }
  }

  function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    timeElement.textContent = `${minutes}:${seconds}`;
  }

   shuffleButton.addEventListener('click', function() {
    words.sort(() => Math.random() - 0.5);
    updateWord();
  });

  flipCard.addEventListener('click', function() {
    this.classList.toggle('active');
  });

  init();
});