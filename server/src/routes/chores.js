const express = require('express');
const router = express.Router();
const Chore = require('../models/Chore');

router.get('/', async (req, res) => {
  try {
    const chores = await Chore.getAll();
    res.json(chores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const chore = await Chore.getById(req.params.id);
    if (!chore) {
      return res.status(404).json({ error: 'Chore not found' });
    }
    res.json(chore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, assigned_to, due_date, priority } = req.body;
    
    if (!title || !due_date) {
      return res.status(400).json({ error: 'Title and due_date are required' });
    }

    const choreData = {
      title,
      description: description || '',
      assigned_to: assigned_to || null,
      due_date,
      priority: priority || 'medium'
    };

    const chore = await Chore.create(choreData);
    res.status(201).json(chore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description, assigned_to, due_date, status, priority } = req.body;
    
    if (!title || !due_date) {
      return res.status(400).json({ error: 'Title and due_date are required' });
    }

    const choreData = {
      title,
      description: description || '',
      assigned_to: assigned_to || null,
      due_date,
      status: status || 'pending',
      priority: priority || 'medium'
    };

    const chore = await Chore.update(req.params.id, choreData);
    res.json(chore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Chore.delete(req.params.id);
    if (!result.deleted) {
      return res.status(404).json({ error: 'Chore not found' });
    }
    res.json({ message: 'Chore deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;