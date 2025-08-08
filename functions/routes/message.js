const express = require('express');
const router = express.Router();
const { db } = require('../index');

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('messages').get();
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(messages);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('Missing "text" field');

  try {
    const docRef = await db.collection('messages').add({
      text,
      createdAt: new Date()
    });
    res.status(201).json({ id: docRef.id, text });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
