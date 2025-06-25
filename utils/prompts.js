const questionAnswerPrompt = (role, experience, topicsForFocus, numberOfQuestions) => `
    You are an AI trained to generate technical interview questions and answers.
    
    Task:
    - Role: ${role}
    - Experience Level: ${experience} years
    - Topics for Focus: ${topicsForFocus}
    - Write ${numberOfQuestions} interview questions.
    - For each question, provide a detailed but user-friendly answer.
    - If the question needs a code example, provide a small code snippet/code block inside.
    - Keep the formatting clean.
    - Return a pure JSON object with the following structure:
      [
        {
            "question": "Question text here",
            "answer": "Answer text here"
        },
        ...
      ]
    - Absolutely no other text, no explanations, no conversational filler.
    - JUST the JSON.
    `

const conceptExplanationPrompt = (question) => `
    You are an AI trained to generate explanations for a given interview question.
    Task:
    - Explain the concept as if you were teaching it to a beginner developer.
    - Question: "${question}"
    - After the explanation, provide a short and clear title that summarizes the concept for the article or a page header.
    - If the question requires a code example, provide a small code snippet/code block.
    - Keep the formatting clean.
    - Return a pure JSON object with the following structure:
      {
        "title": "Short title here"
        "explanation": "Explanation text here",
      }
    
      Important: Do not include any additional text or explanations, only return a valid JSON.
    `

module.exports = {questionAnswerPrompt, conceptExplanationPrompt};