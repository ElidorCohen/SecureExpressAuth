const express = require('express');
const routes = require('./routes');
const logger = require('./winstonLogger');
const app = express();
const port = 5000; 



// Middleware to parse the request body as JSON
app.use(express.json());


// Routes under /api 
app.use('/api', routes);

app.listen(port, () => {
  logger.debug('Initializing server dependencies...');
  console.log(`Server is running at http://localhost:${port}`);
  
});


