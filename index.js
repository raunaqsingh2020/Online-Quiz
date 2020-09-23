console.log('----index.js working correctly----')

const data = {
  questions: [
      {
          prompt: 'Slowly, over time, have your parents stopped saying your name and started calling you by generic names like "champ", "kiddo", "disappointment", or "buddy"?',
          options: {
              A: "They usually say my name two to five times every sentence to make sure they don't forget it.",
              B: "When I call, they tell me to 'hold on, I need to check your birth certificate.'",
              C: "They usually ask me if I'm calling the wrong number.",
              D: "I never talk to my parents."
          }
      },
      {
          prompt: 'When was the last time your parents expressed disappointment in you?',
          options: {
              A: "Never. I am a paradigm of human excellence.",
              B: "The third time they caught me in a compromising position with a peach.",
              C: "When I asked them for a single bean.",
              D: "When I called them over the phone sobbing, telling them that I miss them and wish they were a larger presence in my life."
          }
      },
      {
          prompt: 'How much of your childhood trauma stems specifically from the way your parents raised you?',
          options: {
              A: "T-trauma? Who has that? Ha. Hahahahahahahahah-",
              B: "My parents are two very nice, gentle people who never really wanted to commit to the responsibilities of childrearing and I suffered for it.",
              C: "Let's not talk about it.",
              D: "I was raised as an upstanding, moral individual thanks to the occasional spanking."
          }
      },
      {
          prompt: 'Do you often dream of your mother giving you a nice, warm sponge bath, as if your brain is craving maternal comfort?',
          options: {
              A: "Yes, but it is my father who is doing the sponging.",
              B: "No, I do not dream because I cannot fall asleep at night because I worry that my parents hate me.",
              C: "Yes, except I wasn't dreaming, and I was, in fact, remembering the last night I spent time with my mother before returning to school.",
              D: " I'm allergic to sponges, so this is not a dream, but a nightmare."
          }
      },
      {
          prompt: "If you were asked to identify the sound of your father's voice, would you be able to do it?",
          options: {
              A: "No, because my father's voice is identical to that of James Earl Jones and I think every man sounds like James Earl Jones.",
              B: "No, because my father has a medical condition that does not allow him to speak.",
              C: "No, because I have not talked to my father since I left home.",
              D: "No, because my father is a chronic smoker, smokes twenty cigarettes a day, and as a result his voice becomes more unrecognizable with every passing day."
          }
      },
      {
          prompt: "If you do not call your parents, will they ever call you?",
          options: {
              A: "No.",
              B: "No.",
              C: "No.",
              D: "No.",
          }
      },
  ],
  results: [
      "Your parents don't miss you and just feel obligated to talk to you when they call. You are a nuisance in their life and a constant drain on their financial resources. You're the reason they weren't able to go to Cancun this year, and you should be ashamed of it.",
      "Your parents don't miss you and just feel obligated to talk to you! You are their greatest disappointment, and you will never live up to the high expectations set by your older sibling. You will forever live in their shadow, and your parents will leave everything to your high-achieving sibling and will only leave you one bean.",
      "Your parents feel obligated to talk to you, but still love you. They are just rediscovering themselves in their old age and deserve the time to do so. They'll always be there for you, and are your biggest supporters. I hope you give them the chance to do so.",
      "Your parents don't miss you, and you are in fact a horrible person. Your parents are right to disown you. I am sorry, but you will need to put yourself up for adoption right now.",
  ]
}

const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
var resultsCount = new Array(data.results.length).fill(0); //stores number of responses for each option
var progressPercent = 0.0; //value for progress bar at top

function buildQuiz(){
    const output = [];
  
    data.questions.forEach(
      (question, questionNum) => {
  
        const answers = [];
  
        for(letter in question.options){ //create radio button for each question option
          answers.push(
            `<label class = "uncheckedLabel">
              <input type="radio" name="question${questionNum}" value="${letter}" onclick = "answerSelected()">
              ${letter} :
              ${question.options[letter]}
            </label> 
            <br>`
          );
        }
  
        output.push(
          `<div class="question"> ${question.prompt} </div>
          <div class="answers"> ${answers.join('')} </div>`
        );
      }
    );
  
    quizContainer.innerHTML = output.join('');

}

//handle quiz submission
function showResults(){
    
    resultsCount.fill(0)

    const answerContainers = quizContainer.querySelectorAll('.answers');
  
    data.questions.forEach( (question, questionNum) => {
  
      const answerContainer = answerContainers[questionNum];
      const selector = `input[name=question${questionNum}]:checked` //selected option
      const userAnswer = (answerContainer.querySelector(selector) || {}).value //value of selected option (e.g. "B")

      let options = Object.keys(question.options) // all possible options

      resultsCount[options.indexOf(userAnswer)] += 1 //incremement count for selected option
    });
    
    let i = resultsCount.indexOf(Math.max(...resultsCount)) //index of most selected option (e.g. if "A" was selected the most, index is 0)
    let finalResult = (data.results)[i] //result at index of most selected option

    var numResponses = resultsCount.reduce((a, b) => a + b, 0) //number of options selected

    if(numResponses != data.questions.length){ //should never run since submit button is disabled if not all questions are answered
        resultsContainer.innerHTML = `Respond to all questions!`;

    }else{
        document.getElementById("resultCont").style.display = "block"; //display results
        resultsContainer.innerHTML = `${finalResult}`;

        //disable all options
        data.questions.forEach( (question, questionNum) => {
            $(`input[name=question${questionNum}]`).prop('disabled',true);
        });

        //change submit button to a retake quiz button
        submitButton.innerHTML = 'Retake Quiz'; 
        submitButton.removeEventListener('click', showResults);
        submitButton.addEventListener('click', resetQuiz);
    }

}

//handle retake quiz
function resetQuiz(){
    
    data.questions.forEach( (question, questionNum) => {
      $(`input[name=question${questionNum}]`).prop('checked',false); //uncheck all options
      $(`input[name=question${questionNum}]`).prop('disabled',false); //enable all options
    });

    resultsCount.fill(0);
    resultsContainer.innerHTML = '';

    //change retake quiz button to submit button
    submitButton.innerHTML = 'Submit Quiz';
    submitButton.removeEventListener('click', resetQuiz);
    submitButton.addEventListener('click', showResults);
    submitButton.disabled = true;

    //make all labels with radio button options have class uncheckedLabel
    $('label:has(input:radio)').removeClass();
    $('label:has(input:radio:not(:checked))').addClass('uncheckedLabel');

    //hide results
    document.getElementById("resultCont").style.display = "none";

    //reset progress bar
    progressPercent = 0.0;
    document.getElementsByClassName('progress-bar').item(0).setAttribute('style','width:'+Number(progressPercent)+'%');
}
  
//handle selection of any option
function answerSelected(){
    
    var numResponses = $('input:radio:checked').length

    //keep submit button disabled unless all questions have selected answers
    if(numResponses != data.questions.length){
        submitButton.disabled  = true;
    }else{
        submitButton.disabled  = false;
    }

    //update progress bar
    progressPercent = (numResponses*1.0/data.questions.length)*100
    document.getElementsByClassName('progress-bar').item(0).setAttribute('style','width:'+Number(progressPercent)+'%');

    //update classes of labels with radio buttons
    $('label:has(input:radio)').removeClass()
    $('label:has(input:radio:checked)').addClass('checkedLabel')
    $('label:has(input:radio:not(:checked))').addClass('uncheckedLabel')

}

buildQuiz();

submitButton.addEventListener('click', showResults);
submitButton.disabled = true;

document.getElementById("resultCont").style.display = "none"