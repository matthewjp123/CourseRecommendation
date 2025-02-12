import questions1 from './questions.json' assert {type: 'json'};
import questions2 from './questionSet2.json' assert {type: 'json'};
import questions3 from './questionSet3.json' assert {type: 'json'};
import questions4 from './questionSet4.json' assert {type: 'json'};
import courseJSON from './updated_courses_database.json' assert {type: 'json'};
import userCourseJSON from './userCourseList.json' assert {type: 'json'};

const courses = [];
const userCourses = userCourseJSON["courses"];

function Course(courseData) {
    this.title = courseData.code; // assuming "code" is the unique identifier for the course
    this.description = courseData.description;
    this.tags = courseData.tags;
}

function loadQuestionSet() {
    const selectedSet = document.getElementById('firstQuestionSelect').value;
    let selectedQuestions;

    switch (selectedSet) {
        case 'set1':
            selectedQuestions = questions1;
            break;
        case 'set2':
            selectedQuestions = questions2;
            break;
        case 'set3':
            selectedQuestions = questions3;
            break;
        case 'set4':
            selectedQuestions = questions4;
            break;
        // Include cases for set3 and set4 as needed
    }

    document.getElementById('firstQuestion').style.display = 'none';
    makeForm(selectedQuestions); // Create the form with the selected questions
}

// go through the json file and make the course objects
Object.values(courseJSON).forEach(courseData => {
    const newCourse = new Course(courseData);
    courses.push(newCourse);
});


function addQuestion(thisQuestion, index){
    var thisQNum = index + 1;

    // Each question is displayed in their own form-control
    var questionDiv = document.createElement('div');
    questionDiv.className = "form-control";

    // Question
    var questionText = document.createElement('label');
    questionText.innerHTML = `<b>Question ${thisQNum}</b>: `+ thisQuestion.question;
    questionDiv.appendChild(questionText);

    // Generate choices
    for (let i = 0; i < thisQuestion.answers.length; i++) {
        const answer = thisQuestion.answers[i];
        var thisANum = i + 1;
        const id = `q${thisQNum}-${thisANum}`
        const name = `q${thisQNum}`;

        // Create radio buttons using this not-so-pretty but functional method
        const createRadio = '<input type="radio" id="'+id+'" name="'+name+'" value="'+answer.option+'">'+answer.option+'</input>';

        var option = document.createElement('label');
        option.htmlFor = id;
        option.innerHTML = createRadio;

        questionDiv.appendChild(option);
    }

    document.getElementById('quizform').appendChild(questionDiv);
}

// Generate form where questions start, where if statement will have to go
function makeForm(questions) {
    const quizForm = document.getElementById('quizform');
    quizForm.innerHTML = '';
    
    for (let i = 0; i < questions.length; i++){
        addQuestion(questions[i], i);
    }

    var submitButton = document.createElement('button');
    submitButton.id = "submitButton";
    submitButton.type = "submit";
    submitButton.innerHTML = "See Results";
    quizForm.appendChild(submitButton);

    document.getElementById('submitButton').addEventListener('click', (evt) => {
        evt.preventDefault();
        const userSelections = [];
    
        // Check if all questions are answered; otherwise, prevent submission
        for (let i = 0; i < questions.length; i++) {
            var index = i+1;
            const radios = document.getElementsByName(`q${index}`);
            let val;
            Object.keys(radios).forEach((obj, j) =>{
                if (radios[j].checked){
                    val = radios[j].value;
                }
            })
            if (val === undefined) {
                alert("Please make sure you have answered all questions before submitting.");
                return;
            }
            // Generate user's response
            userSelections.push(val);
        }
    
        document.getElementById('quizform').innerHTML = '';
        const recomm = recommendCourses(userSelections, questions);
        
        var recommHeader = document.createElement('h2');
        recommHeader.innerHTML = "Nice! We found the following courses to be potentially beneficial to you:";
        document.getElementById('quizform').appendChild(recommHeader);
    
        recomm.forEach((course, index) => {
            var courseBox = document.createElement('div');
            var courseHeader = document.createElement('h4');
            courseHeader.innerHTML = `${index+1}. ${course.title}`;
            courseBox.appendChild(courseHeader);
            var courseDesc = document.createElement('label');
            courseDesc.innerHTML = course.description;
            courseBox.appendChild(courseDesc);
            document.getElementById('quizform').appendChild(courseBox);
        });
    
        var repeatQuiz = document.createElement('button');
        repeatQuiz.value = "repeat";
        repeatQuiz.innerHTML = "Click to take the questionnaire again";
        document.getElementById('quizform').appendChild(repeatQuiz);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('firstQuestionSubmit').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default form submission
        loadQuestionSet();
    });
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

function recommendCourses(userSelections, questions) {
    // Create an array to store courses and their relevance scores
    const courseWithScores = [];

    // Iterate through the courses and calculate a relevance score for each course
    for (const course of courses) {
        // Initialize the relevance score for this course
        let relevanceScore = 0;

        // Iterate through the questions and their selections
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const userSelection = userSelections[i];

            // Find the selected answer for the current question
            const selectedAnswer = question.answers.find(answer => answer.option === userSelection);
            if (selectedAnswer) {
                // Include tag-based scoring: If the user's selection matches any tags of the course, add to the relevance score
                if (selectedAnswer.tags) {
                    if (selectedAnswer.tags.some(tag => course.tags.includes(tag))) {
                        relevanceScore += 1 * question.weight;
                    }
                }
            } else {
                console.log(`Warning: Invalid selection for question ${i + 1}.`);
            }
        }

        courseWithScores.push({course, relevanceScore});
    }

    shuffleArray(courseWithScores);
    // Sort courses based on their relevance score in descending order
    courseWithScores.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Select the top 3 courses
    const top5Courses = courseWithScores.slice(0, 5).map(entry => entry.course);

    return top5Courses;
}

let engBusinessMinor1And2 = 0;
let engBusinessMinorTotal = 0;
let engBusinessMinor5and6 = 0;
let remaining1To4=0;
let remaining4To6=0;
let minor="";

function findMatchingCourses(userCourses, courses) {
   
    engBusinessMinor1And2 = 0;
    engBusinessMinor5and6 = 0;
    engBusinessMinorTotal = 0;
    remaining1To4=0;
    remaining4To6=0;
    minor="";
   
    userCourses.forEach(userCourseCode => {
        // Find the matching courses in the course database using course codes
        const matchedCourse = courses.find(course => course.code === userCourseCode);

        if (matchedCourse) {
            // match is found, check the tags of the matched course if it includes repective minor tag incrament that minor counter
            if (matchedCourse.tags.includes("EngineeringBusinessMinor1") || 
                matchedCourse.tags.includes("EngineeringBusinessMinor2") || 
                matchedCourse.tags.includes("EngineeringBusinessMinor3") || 
                matchedCourse.tags.includes("EngineeringBusinessMinor4")) {
                engBusinessMinor1And2++;
            }
            if (matchedCourse.tags.includes("EngineeringBusinessMinor5and6")) {
                engBusinessMinor5and6++;
            }
            // Add other minors
        }
    });

    engBusinessMinorTotal=engBusinessMinor1And2+engBusinessMinor5and6;

    // global variable is the largest
    let maxCount = Math.max(engBusinessMinorTotal);


    if (maxCount === engBusinessMinorTotal) {
            minor="Engineering Business";
            remaining1To4=4-engBusinessMinor1And2;
            remaining4To6=2-engBusinessMinor5and6;

            //display using this data, gives you the minor, and how many courses needed in each section
            return;
    }   
    
    
}

findMatchingCourses(userCourses, courses);