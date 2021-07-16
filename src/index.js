const express = require('express')

const { v4: uuid } = require('uuid')

const app = express()

app.use(express.json())

const repositories = []

function checkExistsRepository(request, response, next) {
  const { id } = request.params

  const repository = repositories.find(repository => repository.id === id)

  if (!repository) {
    return response.status(404).json({
      error: 'Repository not found!'
    })
  }

  request.repository = repository

  return next()
}

function verifyFieldsToUpdate(repository, title, url, techs) {
  if (title != '') {
    repository.title = title
  }

  if (url != '') {
    repository.url = url
  }

  if (techs.length != 0) {
    repository.techs = techs
  }

  return repository
}

app.get('/repositories', (request, response) => {
  return response.json(repositories)
})

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  //Comando para inserir repositório criado na lista de repositórios
  repositories.push(repository)

  return response.status(201).json(repository)
})

app.put('/repositories/:id', checkExistsRepository, (request, response) => {
  const { likes } = request.body
  const { title, url, techs } = request.body
  const { repository } = request

  console.log('Likes: ' + likes)

  if (likes === '' || likes === undefined) {
    const updatedRepository = verifyFieldsToUpdate(
      repository,
      title,
      url,
      techs
    )

    return response.status(200).json(updatedRepository)
  } else {
    return response.status(200).json({
      likes: 0
    })
  }
})

app.delete('/repositories/:id', checkExistsRepository, (request, response) => {
  const { repository } = request

  const repositoryIndex = repositories.indexOf(repository)

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
})

app.post(
  '/repositories/:id/like',
  checkExistsRepository,
  (request, response) => {
    const { repository } = request

    repository.likes += 1

    return response.status(200).json({
      likes: repository.likes
    })
  }
)

module.exports = app
