import express from 'express';

const app = express();

// https://hooks.zapier.com/hooks/catch/1234567/2342424/

// password logic

app.post('/hooks/catch/:hookId/:zapId?', (req, res) => {
    const userId = req.params.hookId;
    const zapid = req.params.zapId;
})