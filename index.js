const express = require('express')
const app = express()
const port = 3001
const { connect } = require('./db');
const { getDatabase } = require('./db');
const { ObjectId } = require('mongodb');

const db = getDatabase();

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api', (req, res) => {
    res.json({message: 'Hello from server!'})
})

app.get('/api/messages', async (req, res) => {
    const messages = await db.collection('messagerie').find({}).toArray();
    res.json(messages);
})

app.get('/api/rooms', async (req, res) => {
    const rooms = await db.collection('salons').find({}).toArray();
    res.json(rooms);
})

app.get('/api/room/:id', async (req, res) => {
    const result = await db.collection('salons').findOne({ _id: new ObjectId(req.params.id) })
    res.json(result)
})

app.post('/api/join/room/:id', async (req, res) => {
    const result = await db.collection('salons').findOne({ _id: new ObjectId(req.params.id) })

    if (result === null) {
        res.status(404).json({ message: 'Room not found' })
        return
    }else{
        const user = await db.collection('salons').findOne({ _id: new ObjectId(req.params.id), users: req.body.user })
        if (user !== null) {
            res.status(200).json({ message: 'Vous avez déjà rejoint ce salon' })
            return
        }
        const result = await db.collection('salons').updateOne(
            {
                _id: new ObjectId(req.params.id)
            },
            {
                $push: {
                    users: req.body.user
                }
            }
        )
        return res.status(200).json({ message: 'Vous avez rejoins le salon' })
    }
})

app.post('/api/message/:id', async (req, res) => {
    const result = await db.collection('messagerie').insertOne({ message: req.body.message, room: new ObjectId(req.params.id) , user: req.body.user})
    res.json(result)
})

app.get('/api/room/messages/:id', async (req, res) => {
    const result = await db.collection('messagerie').find({ room: new ObjectId(req.params.id) }).toArray()
    res.json(result)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})