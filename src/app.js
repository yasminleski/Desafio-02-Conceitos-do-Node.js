const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(req, res, next) { 
  const {method, url } = req

  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.log(logLabel)

  return next()
}
 
app.use(logRequests)


      app.get("/repositories", (request, response) => {
         return response.json(repositories)
      })


      app.post("/repositories", (request, response) => {
          const {title, url, techs} = request.body

            const projeto =  { id: uuid(), title, url, techs, likes: 0 }

            repositories.push(projeto)

          return response.json(projeto)
      });
      

      app.put("/repositories/:id", (request, response) => {
        const {id} = request.params
        const {title, url, techs} = request.body

        const projetoIndex = repositories.findIndex(project => project.id == id)

        if (projetoIndex < 0){
          return response.status(400).json({ error: "Project not found. "})
      }

        const projeto = {id, title, url, techs, likes: repositories[projetoIndex].likes}

        repositories[projetoIndex] = projeto

        return response.json(projeto)
      })


      app.delete("/repositories/:id", (request, response) => {
        const {id} = request.params

        const projetoIndex = repositories.findIndex(proj => proj.id == id)

        if (projetoIndex >= 0){
          repositories.splice(projetoIndex, 1)
      }else{
        return response.status(400).json({ error: "Project does not exists! "})
      }

      return response.status(204).send()

      });


      app.post("/repositories/:id", (request, response) => {
        const {id } = request.params

        const projetoIndex = repositories.findIndex(proj => proj.id == id)

        if (projetoIndex <0 ){
        return response.status(400).json({ error: "Project does not exists. "})
        }
        repositories[projetoIndex].likes += 1

        return response.json(repositories[projetoIndex])
      });

module.exports = app;
