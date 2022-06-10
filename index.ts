import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import errorHandlerMiddleware from './core/middleware/error-handler';
import routes from './core/routes';

const app = express();
const port = 3000


/* ESSENTIALS */
app.use(bodyParser.json());
app.use(helmet());

/* ROUTES */
app.use('/', routes)

/* ERROR HANDLER */
app.use(errorHandlerMiddleware)

/* INITIALIZE */
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;