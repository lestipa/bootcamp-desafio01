const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let totalRequests = 0;

function showTotalRequests(req, res, next) {
  totalRequests++;
  console.log(`Total Requests: ${totalRequests}`);

  return next();
}

/* Middleware global */
server.use(showTotalRequests);

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  //console.log(`id: ${id}`);
  const index = projects.indexOf(projects.find(project => project.id === id));
  if (index < 0) {
    return res.status(400).json({ error: "Project does not exists!" })
  }
  req.project = projects[index];

  return next();
}

server.get('/projects', (req, res) => {
  return res.json(projects);
})

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const index = projects.indexOf(projects.find(project => project.id === id));
  projects.splice(index, 1);

  return res.json(projects);
})

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const index = projects.indexOf(projects.find(project => project.id === id));
  projects[index].title = title;

  return res.json(projects);
})

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  /*
  const index = projects.indexOf(projects.find(project => project.id === id));
  const tasks = projects[index].tasks;
  tasks.push(title);
  projects[index].tasks = tasks;
  */

  const myProject = projects.find(project => project.id === id);
  myProject.tasks.push(title);

  //console.log(tasks);

  //return res.json(myProject);
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  //const { id } = req.body;
  //const { title } = req.body;
  const { id, title } = req.body;

  const projeto = {
    id, title, tasks: []
  };

  projects.push(projeto);

  return res.json(projects);
});

server.listen(3003);
