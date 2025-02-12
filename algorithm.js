const fs = require('fs');

const courses = [
  
];

// reading the json file
fs.readFile('./updated_courses_database.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);

    //making structure for the json file
    function Course(courseData) {
      this.title = courseData.code; // assuming "code" is the unique identifier for the course
      this.description = courseData.description;
      this.tags = courseData.tags;
    }

    // go through the json file and make the course objects
    Object.values(jsonData).forEach(courseData => {
      const newCourse = new Course(courseData);
      courses.push(newCourse);
    });

    // Now, the 'courses' array contains both the original courses and the courses from the JSON data
  } catch (jsonError) {
    console.error('Error parsing JSON data:', jsonError);
  }
});

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function presentMultipleChoiceQuestion(question, answers) {
  console.log(question);
  answers.forEach((answer, index) => {
    console.log(`${index + 1}. ${answer.option}`);
  });
}

function promptForChoice(options) {
  return new Promise((resolve) => {
    rl.question("Enter the number of your choice: ", (input) => {
      const choice = parseInt(input);
      if (choice >= 1 && choice <= options.length) {
        resolve(choice - 1);
      } else {
        console.log("Invalid choice. Please enter a valid option.");
        promptForChoice(options).then(resolve);
      }
    });
  });
}

async function main() {
  console.log("Course Recommendation Quiz");

  // User selections for each question
  const userSelections = [];
  // Load quiz questions from questions.json
  const questions = require('./questions.json');

  for (const question of questions) {
    presentMultipleChoiceQuestion(question.question, question.answers);
    const choiceIndex = await promptForChoice(question.answers);
    userSelections.push(question.answers[choiceIndex].option);
  }

// Calculate recommended courses and pass the courses array
  const recommendedCourses = recommendCourses(userSelections, questions, courses);

  console.log("\nRecommended Courses:");
  recommendedCourses.forEach((course, index) => {
    console.log(`${index + 1}. ${course.title}`);
  });

  rl.close();
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

        courseWithScores.push({ course, relevanceScore });
    }

    // Sort courses based on their relevance score in descending order
    courseWithScores.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Select the top 3 courses
    const top3Courses = courseWithScores.slice(0, 3).map(entry => entry.course);

    return top3Courses;
}


/*
function recommendCourses(userSelections) {
    // Create an array to store courses and their relevance scores
    const courseWithScores = [];
  
    // Iterate through the courses and calculate a relevance score for each course
    for (const course of courses) {
      // Implement your relevance scoring logic here
      // For this example, we'll count how many user selections are present in the course's tags
      const relevanceScore = userSelections.reduce((score, selection) => {
        if (course.tags.includes(selection)) {
          return score + 1;
        }
        return score;
      }, 0);
  
      courseWithScores.push({ course, relevanceScore });
    }
  
    // Sort courses based on their relevance score in descending order
    courseWithScores.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
    // Select the top 3 courses
    const top3Courses = courseWithScores.slice(0, 3).map(entry => entry.course);
  
    return top3Courses;
  }
 */ 
  
   
main();