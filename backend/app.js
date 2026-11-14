const express = require('express');
const cors = require('cors');
const contacts = require('./routes/contactRoutes');
const projects = require('./routes/projectRoutes');
const qualifications = require('./routes/qualificationRoutes');
const users = require('./routes/userRoutes');
const auth = require('./routes/authRoutes');
const contactMessages = require('./routes/contactMessageRoutes');
const { authenticate } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.json({ message: 'Welcome to My Portfolio application.' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/contacts', contacts);
app.use('/api/contact-messages', contactMessages);
app.use('/api/projects', projects);
app.use('/api/qualifications', qualifications);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/auth', auth); // Alias for the exact paths used in the assignment handout.
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'You accessed a protected route!', userId: req.auth.sub, role: req.user.role });
});
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.use(errorHandler);
module.exports = app;
