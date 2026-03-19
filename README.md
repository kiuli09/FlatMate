# FlatMate

Feasibility Study 

Technical Considerations 

Existing technologies can be utilized to implement and support this web application. The core feature revolves around analyzing YouTube videos and generating interactive questions to assess the user’s understanding of the language they're learning.  

We plan to utilize YouTube Transcript API’s to retrieve the transcripts or captions of the videos, taking into consideration that not all the YouTube videos will have captions available, and some may have auto-generated captions that could affect the quality of the transcript retrieved. In these cases, we will handle it with messages or mechanisms that will inform the user that the system is unable to retrieve a transcript for these YouTube videos. 

LLM (Large Language Models) will be used to analyze the transcripts, and generate questions in the language the user’s native language. For instance, if the user’s first language is English and trying to learn Spanish, the questions will be generated in the English context of the Spanish video being used for learning. The depth of the information and questions will be dependent on the LLM’s performance and prompt quality. 

We will be using GitBucket for programming, Taiga to project tracking and management,  and Blackboard Group as another form of communication and file exchange. We will have a Frontend, Backend, Database and a Cloud Host. For the frontend were using JavaScript as the main programming language, and potentially React for interactivity. The backend will utilize Node.js, Postgres for the database aspects and a cloud host such as Amazon Web Services or Google Cloud Platform. 

Given the maturity of the technologies involved as well as the API’s and cloud servers available, our software is technically feasible.