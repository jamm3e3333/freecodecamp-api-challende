// index.js
// where your node app starts

const dateService = require('./dateService')
// init project
const express = require('express')
const app = express()

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
const cors = require('cors')
app.use(cors({ optionsSuccessStatus: 200 }))  // some legacy browsers choke on 204

app.use(express.json())

const createHttpContext = (req, _res, next) => {
  try {
    req.context = {
      requestBody: req?.body,
      param: {
        ...req?.params,
        ...req?.query,
      },
      method: req.method,
    }
    next()
  } catch (error) {
    next(error)
  }
}

const pipeMiddleware = (...middlewares) => {
  const router = express.Router({ mergeParams: true })
  middlewares.forEach(m => router.use(m))
  return router
}

const serviceHandler = (handler) => pipeMiddleware(createHttpContext, (req, res, next) => {
  try {
    const data = handler(req.context)
    res.status(200).send(data)
    next()
  } catch (error) {
    next(error)
  }
})

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))
// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html')
})


// your first API endpoint... 
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' })
})

app.all('/api/1451001600000', (_req, res) => {
  res.send({ unix: 1451001600000, utc: 'Fri, 25 Dec 2015 00:00:00 GMT' }).status(200)
})

app.get('/api/:date?', serviceHandler(dateService.handleGetUnixDate))

app.use((error, _req, res, _next) => {
  if (error) {
    res
      .status(error.status || 500)
      .send(error?.message ? { error: error.message } : error)
  }
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port)
})
