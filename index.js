const mongoose = require('mongoose');
const express = require('express');
const bp = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const multer = require('multer');
const Report = require('./models/Report');

const { DB, PORT } = require('./config');

const app = express();

app.use(cors());
app.use(bp.json());
app.use(passport.initialize());

require("./middlewares/passport")(passport);

app.use("/api", require("./routes/users"));

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose
    .connect(DB, connectionParams)
    .then(() => {
        console.log("Connected to the DB");
    })
    .catch((e) => {
        console.log("Error:", e);
    });

//Storage
const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: Storage
}).single('image')


//Upload report conent
app.post('/api/reports', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
        } else {
            const newReport = new Report({
                reportID: req.body.reportID,
                location: req.body.location,
                date: req.body.date,
                cause: req.body.cause,
                type: req.body.type,
                vehicle: req.body.vehicle,
                image: {
                    data: req.file.filename,
                    contentType: 'image/jpg'
                }
            })
            newReport.save()
                .then(() => res.send("Sucessfully inserted!"))
                .catch(err => console.log(err))
        }
    })
})


//Get all reports
app.get('/api/reports', async (req, res) => {
    const report = await Report.find();
    res.json(report)
})

//Get a specific report
app.get('/api/reports/:reportID', async (req, res) => {
    try {
        const report = await Report.findById(req.params.reportID);
        res.json(report)
    } catch (err) {
        console.log(err);
    }

})

//Delete a specific report
app.delete("/api/reports/:reportID", async (req, res) => {
    try {
        const removeReport = await Report.remove({ reportID: req.params.reportID })
        res.json(removeReport)
    } catch (err) {
        console.log(err);
    }
})

//Update a specific report
app.patch("/api/reports/:reportID", async (req, res) => {
    try {
        const updateReport = await Report.updateOne(
            { reportID: req.params.reportID },
            { $set: { cause: req.body.cause, type: req.body.type } }
        )
        res.json(updateReport)
    } catch (err) {
        console.log(err);
    }
})

//Change Reports collection's decision value into approved
app.patch("/api/reports/:reportID", async (req, res) => {
    try {
        const updateReport = await Report.updateOne(
            { reportID: req.params.reportID },
            { $set: { decision: req.body.decision } }
        )
        res.json(updateReport)
    } catch (err) {
        console.log(err);
    }
})

//Change Reports collection's decision value into denied
app.patch("/api/reports/:reportID", async (req, res) => {
    try {
        const updateReport = await Report.updateOne(
            { reportID: req.params.reportID },
            { $set: { decision: req.body.decision } }
        )
        res.json(updateReport)
    } catch (err) {
        console.log(err);
    }
})



app.listen(5000, () => {
    console.log(`Listening to port:${PORT}`);
})