import express from 'express';
import morganBody from 'morgan-body';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';

import userRouter from './routes/user.js';
import experienceRouter from './routes/experience.js';
import githubRouter from './routes/github.js';
import imageRouter from './routes/image.js';
import portfolioRouter from './routes/portfolio.js';
import projectRouter from './routes/project.js';
import templateRouter from './routes/template.js';

import vars from './config/vars.js';

const app = express();
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

morganBody(app, { noColors: true });

app.get('/', (req, res) =>
  res.send('Welcome to Palpa API! Hope you enjoy your time here ;)')
);
app.get('/version', (req, res) => res.json({ version: '1.0.0' }));

app.use('/user', userRouter);
app.use('/experience', experienceRouter);
app.use('/github', githubRouter);
app.use('/image', imageRouter);
app.use('/portfolio', portfolioRouter);
app.use('/project', projectRouter);
app.use('/template', templateRouter);

const port = vars.PORT || 3000;

app.listen(port, () =>
  // eslint-disable-next-line no-console
  console.log(`Server running on ${port}, http://localhost:${port}`)
);
