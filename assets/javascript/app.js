(function() {
  var questions = [
    {
      question: "What is the capital of Spain?",
      choices: ["Madrid", "Barcelona", "Sevilla", "Valencia", "Andorra"],
      correctAnswer: 0
    },
    {
      question: "What is the capital of Morrocco?",
      choices: ["Fes", "Marrakesh", "Casablanca", "Rabat", "Tangier"],
      correctAnswer: 3
    },
    {
      question: "What is the capital of Cambodia?",
      choices: ["Siem Reap", "Angkor", "Battambang", "Kampot", "Phnom Penh"],
      correctAnswer: 4
    },
    {
      question: "What is the capital of Brazil?",
      choices: [
        "Rio de Janeiro",
        "Sao Paulo",
        "Brasilia",
        "Salvador",
        "Fortaleza"
      ],
      correctAnswer: 2
    },
    {
      question: "What is the capital of Tanzania?",
      choices: ["Dar es Salaam", "Mwanza", "Dodoma", "Moshi", "Morogorp"],
      correctAnswer: 2
    }
  ];

  var questionCounter = 0; //Tracks question number
  var selections = []; //Array containing user choices
  var quiz = $("#quiz"); //Quiz div object
  var time = 30;
  var clockRunning = false;
  var numCorrect = 0;
  var numIncorrect = 0;

  // Display initial question
  displayNext();

  // Click handler for the 'next' button
  $("#next").on("click", function(e) {
    e.preventDefault();

    // Suspend click listener during fade animation
    if (quiz.is(":animated")) {
      return false;
    }
    choose();

    // If no user selection, progress is stopped
    if (isNaN(selections[questionCounter])) {
      alert("Please make a selection!");
    } else {
      questionCounter++;
      displayNext();
    }
  });

  // Click handler for the 'prev' button
  $("#prev").on("click", function(e) {
    e.preventDefault();

    if (quiz.is(":animated")) {
      return false;
    }
    choose();
    questionCounter--;
    displayNext();
  });

  // Click handler for the 'Start Over' button
  $("#start").on("click", function(e) {
    e.preventDefault();

    if (quiz.is(":animated")) {
      return false;
    }
    questionCounter = 0;
    selections = [];
    displayNext();
    $("#start").hide();
  });

  // Animates buttons on hover
  $(".button").on("mouseenter", function() {
    $(this).addClass("active");
  });
  $(".button").on("mouseleave", function() {
    $(this).removeClass("active");
  });

  // Creates and returns the div that contains the questions and
  // the answer selections
  function createQuestionElement(index) {
    var qElement = $("<div>", {
      id: "question"
    });

    var header = $("<h2>Question " + (index + 1) + ":</h2>");
    qElement.append(header);

    var question = $("<p>").append(questions[index].question);
    qElement.append(question);

    var radioButtons = createRadios(index);
    qElement.append(radioButtons);

    return qElement;
  }

  // Creates a list of the answer choices as radio inputs
  function createRadios(index) {
    var radioList = $("<ul>");
    var item;
    var input = "";
    for (var i = 0; i < questions[index].choices.length; i++) {
      item = $("<li>");
      input = '<input type="radio" name="answer" value=' + i + " />";
      input += questions[index].choices[i];
      item.append(input);
      radioList.append(item);
    }
    return radioList;
  }

  // Reads the user selection and pushes the value to an array
  function choose() {
    selections[questionCounter] = +$('input[name="answer"]:checked').val();
  }

  // counts down the timer
  function count() {
    time--;
    $("#timer").text(time + " seconds left");
    if (time === 0) {
      selections.push(-1);
      questionCounter++;
     // alert("Time's up!");
      displayNext();
    }
  }
  if (!clockRunning) {
    intervalId = setInterval(count, 1000);
    clockRunning = true;
  }
  function myStopFunction() {
    clearInterval(intervalId);
  }

  // Displays next requested element
  function displayNext() {
    quiz.fadeOut(function() {
      $("#question").remove();
      clockRunning = false;
      time = 31;

      if (questionCounter < questions.length) {
        var nextQuestion = createQuestionElement(questionCounter);
        quiz.append(nextQuestion).fadeIn();
        if (!isNaN(selections[questionCounter])) {
          $("input[value=" + selections[questionCounter] + "]").prop(
            "checked",
            true
          );
        }

        // Controls display of 'prev' button
        if (questionCounter === 1) {
          $("#prev").show();
        } else if (questionCounter === 0) {
          $("#prev").hide();
          $("#next").show();
        }
      } else {
        var scoreElem = displayScore();
        quiz.append(scoreElem).fadeIn();
        $("#next").hide();
        $("#prev").hide();
        $("#timer").hide();
        myStopFunction();
        $("#start").show();
      }
    });
  }

  // Computes score and returns a paragraph element to be displayed
  function displayScore() {
    var score = $("<p>", { id: "question" });

    for (var i = 0; i < selections.length; i++) {
      if (selections[i] === questions[i].correctAnswer) {
        numCorrect++;
      } else {
        numIncorrect++;
      }
    }

    score.append("<p> Correct answers: " + numCorrect + "</p>");
    score.append("<p> Incorrect answers: " + numIncorrect + "</p>");

    return score;
  }
})();
