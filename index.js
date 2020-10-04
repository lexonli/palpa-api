import userRouter from './routes/user.js'
import experienceRouter from './routes/experience.js'
import express from 'express';
import morganBody from 'morgan-body';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import vars from './config/vars.js'

const app = express();
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

morganBody(app, { noColors: true });

app.get('/', (req, res) => res.send('Welcome to Palpa API! Hope you enjoy your time here ;)'));
app.get('/version', (req, res) => res.json({ version: '1.0.0' }));
app.use('/user', userRouter);
app.use('/experience', experienceRouter);
app.get('/contact/:id', (req, res) => res.send('Contact Page Route'));

const port = vars.PORT || 3000;

app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));
