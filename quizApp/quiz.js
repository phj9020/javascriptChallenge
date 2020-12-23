const quizData = [
    {
        question: 'How old is Han?',
        a : '10',
        b : '17',
        c : '26',
        d : '33',
        correct : 'd' 
    },
    {
        question: 'What is the most used programming language in 2021?',
        a: 'JAVA',
        b: 'Python',
        c: 'C+',
        d: 'Javascript',
        correct: 'd'
    },
    {
        question: 'When is the Christmas?',
        a: '11/24',
        b: '12/24',
        c: '11/25',
        d: '12/25',
        correct: 'd'
    },
    {
        question: 'What does the HTML stands for',
        a: 'Hyper Text Markup Language',
        b: 'Cascading style sheet',
        c: 'JASON Object Notation',
        d: 'Hellicopters Terminals',
        correct: 'a'
    },
    {
        question: 'Which one is belongs to category of coffee?',
        a: 'Pepsi',
        b: 'Coke',
        c: 'Americano',
        d: 'Mountain Dew',
        correct: 'c'
    },
];

const question = document.querySelector("#question");
const a_text = document.querySelector("#a_text");
const b_text = document.querySelector("#b_text");
const c_text = document.querySelector("#c_text");
const d_text = document.querySelector("#d_text");
const submitBtn = document.querySelector("button");
const answerEl = document.querySelectorAll(".answer");
const quiz = document.querySelector("#quiz");

let currentQuestion = 0; 
let score = 0;

loadQuiz();

// 매번 submit될때마다 불러온다 
function loadQuiz(){
    deSelectAnswer();
    // quizData[0].question 
    const currentQuizData = quizData[currentQuestion];
    question.innerText = currentQuizData.question;
    a_text.innerText = currentQuizData.a;
    b_text.innerText = currentQuizData.b;
    c_text.innerText = currentQuizData.c;
    d_text.innerText = currentQuizData.d;
}



function getSelected(){
    let answer = undefined;

    // for each VER.
    // answerEl.forEach((answerElement) => {
    //     if(answerElement.checked) {
    //         answer = answerElement.id;
    //     }
    // })

    // for loop VER.
    for(const item of answerEl) {
        if(item.checked) {
            answer = item.id;
        }
    }
    return answer;
}


function deSelectAnswer(){
    for(const item of answerEl) {
        item.checked = false;
    }
}

submitBtn.addEventListener("click", ()=>{
    // check to see the answer text
    const answer = getSelected();
    console.log(answer);

    // 답을 체크했다면 다음으로 넘어간다 
    if(answer) {

        // 맞는질문인지 판별 
        if(answer === quizData[currentQuestion].correct){
            // 1개 맞을때마다 1점 
            score += 1;
        }

        console.log(score);
        currentQuestion++;

        if(currentQuestion < quizData.length) {
            loadQuiz();
        } else {
            // show result
            quiz.innerHTML = `<h2>You answered Correctly at ${score}/${quizData.length} questions</h2> <button onclick="location.reload()">Retry</button>`;
        }

    }
});