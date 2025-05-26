const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/employeeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Employee Schema
const employeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  department: String,
  salary: Number
});

const Employee = mongoose.model('Employee', employeeSchema);

// Routes
app.get('/', async (req, res) => {
  const employees = await Employee.find();
  res.render('index', { employees });
});

// Create Employee
app.get('/employees/new', (req, res) => {
  res.render('new');
});

app.post('/employees', async (req, res) => {
  await Employee.create(req.body.employee);
  res.redirect('/');
});

// Update Employee
app.get('/employees/:id/edit', async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  res.render('edit', { employee });
});

app.put('/employees/:id', async (req, res) => {
  await Employee.findByIdAndUpdate(req.params.id, req.body.employee);
  res.redirect('/');
});

// Delete Employee
app.delete('/employees/:id', async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));