// Include packages needed for this application
const fs = require('fs');
const inquirer = require('inquirer');
const util = require('util');
const http = require('http');
const pdfKit = require('pdfkit');
const axios = require('axios');

const port = 3001;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

server.listen(port, () => {
  console.log(`Server running at: ${port}`);
});

// User quesions array
const questions = 
    [{
        type: "input",
        name: "ghubUsername",
        message: "Please enter your GitHub Username"
    },
    {
        type: "input",
        name: "email",
        message: "Please enter your e-mail ID"
    },
    {
        type: "input",
        name: "repository",
        message: "Please enter your GitHub repository"
    },
    {
        type: "input",
        name: "projectTitle",
        message: "Please enter the project title"
    }
];

inquirer.prompt(questions).then((answers) => {
  // call getGitHubProfileInfo function
  console.log(JSON.stringify(answers, null, '  '));
  getGitHubProfileInfo(
    answers.ghubUsername,
    answers.email,
    answers.repository,
    answers.projectTitle
  );
});

// Function for retrieving user GitHub Profile information based on their responses
async function getGitHubProfileInfo(user, email, repo, title) {
  // Use axios to make an API call to retrieve the user's GitHub information
  const { data } = await axios.get(`https://api.github.com/users/${user}`);

  data.email = email;

  // Generate a URL for their GitHub profile based on the response
  const repoURL = `https://github.com/${user}/${repo}`;

  console.log("Data: ", data);
  console.log("Repo URL: ", repoURL);
  console.log("Project Title: ", title);

  // Turn the results into a string
  const stringData = JSON.stringify(data, null, "  ");

  // Variable containing code for readme template to be generated
  const result = `
# Title: ${title} 
## Project Description 
## Contents
## Tech used
## License
## Contributing
## Tests
## Questions
## Issues
* GitHub profile avatar:
![alt text](${data.avatar_url} "User GitHub Profile Picture")
* GitHub profile username: [${data.login}](${data.html_url})
* GitHub email: [${data.email}](mailto:${data.email})
* GitHub repository: ${repoURL}
`;

  // Log results
  console.log(result);

  // Write to a readme file
  fs.writeFile("readmetemplate.md", result, function (err) {
    if (err) return console.log(err);
  });

  console.log(data.avatar_url);

  // Close server when complete
  server.close();
}

