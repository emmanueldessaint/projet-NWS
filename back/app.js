const express = require('express');
const app = express();
const axios = require('axios');
const http = require('http');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const Materiel = require('./models/Materiel');
const Emprunt = require('./models/Emprunt');
var jsonParser = bodyParser.json();
require('dotenv').config();

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var URL = 'mongodb+srv://Emmanuel:Emmanuel199627@cluster0.44jw3e7.mongodb.net/test';

const nodemailer = require("nodemailer");

app.use(express.json());
const db = mongoose.connection

mongoose.connect('mongodb+srv://Emmanuel:Emmanuel199627@cluster0.44jw3e7.mongodb.net/test',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.log(err));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/getStudents', function (req, res) {
    axios.get('http://vps-a47222b1.vps.ovh.net:4242/Student')
        // .then(response => {
        //     console.log(response.data);
        // })
        .then(response => res.status(200).json(response.data))
        .catch(error => {
            console.log(error);
        });
})
app.post('/api/addEtudiant', jsonParser, function (req, res) {
    console.log(req.body)
    const student = new Student({
        ...req.body
    });
    student.save()
        .then(() => res.status(201).json({ message: 'Etudiant enregistré !' }))
        .catch(error => res.status(400).json({ error }));
})
app.delete('/api/deleteEtudiant/:id', (req, res, next) => {
    Student.deleteOne({ id: req.params.id })
        .then(() => res.status(201).json({ message: 'Etudiant supprimé !' }))
        .catch(error => res.status(400).json({ error }));
    try {
        db.collection('emprunts').deleteMany({ id_etudiant: req.params.id });
    } catch (e) {
        print(e);
    }
});

app.use('/api/getAllEmprunts', function (req, res) {
    Emprunt.find()
        .then(emprunts => res.status(200).json(emprunts))
        .catch(error => res.status(400).json({ error }));
})

app.post('/api/reminderEmprunt', jsonParser, function (req, res) {
    var student = {};
    console.log(req.body)

    db.collection('students').findOne({ id: req.body.id_etudiant })
        .then(res => {
            student = res;
            console.log(req.body)

            var nodeoutlook = require('nodejs-nodemailer-outlook')
            nodeoutlook.sendEmail({
                auth: {
                    user: "mat_et_manu@hotmail.fr",
                    pass: process.env.PASSWORD
                },
                from: 'mat_et_manu@hotmail.fr',
                to: res.mail,
                subject: 'Rappel emprunt de matériel NWS',
                html: `Bonjour ${res.prenom}, nous vous rappelons que vous avez emprunter du matériel à la NWS. Vous devez le rendre au plus tard le ${req.body.date_rendu.charAt(8)}${req.body.date_rendu.charAt(9)}/${req.body.date_rendu.charAt(5)}${req.body.date_rendu.charAt(6)}/${req.body.date_rendu.charAt(0)}${req.body.date_rendu.charAt(1)}${req.body.date_rendu.charAt(2)}${req.body.date_rendu.charAt(3)}.`,
                text: 'This is text version!',
                replyTo: res.mail,
                onError: (e) => console.log(e),
                onSuccess: (i) => console.log(i)
            }
            );
        })
        .catch(error => res.status(400).json({ error }));
})

app.post('/api/addEmprunt', jsonParser, function (req, res) {
    // console.log(req.body)
    var student = {};
    var materielName = '';
    const emprunt = new Emprunt({
        ...req.body
    });
    emprunt.save()
        .then(() => res.status(201).json({ message: 'Emprunt enregistré !' }))
        .catch(error => res.status(400).json({ error }));
})

app.delete('/api/deleteEmprunt/:id', (req, res, next) => {
    console.log(req.params.id)
    Emprunt.deleteOne({ id: req.params.id })
        .then(() => res.status(200).json({ message: 'Emprunt supprimé !' }))
        .catch(error => res.status(400).json({ error }));
});

app.use('/api/getAllMateriels', function (req, res) {
    Materiel.find()
        .then(materiels => res.status(200).json(materiels))
        .catch(error => res.status(400).json({ error }));
})

app.post('/api/addMateriel', jsonParser, function (req, res) {
    console.log(req.body)
    const materiel = new Materiel({
        ...req.body
    });
    materiel.save()
        .then(() => res.status(201).json({ message: 'Matériel enregistré !' }))
        .catch(error => res.status(400).json({ error }));
})

app.put('/api/updateMaterial/:id', (req, res, next) => {
    console.log(req.params.id)
    Materiel.updateOne({ id: req.params.id }, { ...req.body })
        .then(() => res.status(200).json({ message: 'Matériel modifié !' }))
        .catch(error => res.status(400).json({ error }));
});

app.delete('/api/deleteMaterial/:id', (req, res, next) => {
    console.log(req.params.id)
    Materiel.deleteOne({ id: req.params.id })
        .then(
            Emprunt.deleteMany({ id_materiel: req.params.id })
                .then(() => res.status(200).json({ message: 'Matériel supprimé !' }))
                .catch(error => res.status(400).json({ error }))
        )
        .catch(error => res.status(400).json({ error }));
});

module.exports = app;

// app.use(express.json());

// app.get('/', (req, res) => res.send('Hello world'));

// app.use('/api/getAllMateriels', function (req, res) {
//     Materiel.find()
//         .then(materiels => res.status(200).json(materiels))
//         .catch(error => res.status(400).json({ error }));
// })

// module.exports = app;