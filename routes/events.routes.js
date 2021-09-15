const router = require("express").Router();
const axios = require("axios");
const { Model } = require("mongoose");
const CDNupload = require("../config/upload.config");
const Event = require("../models/Event.model");
const { formatDate, formatTime, capitalize } = require("../utils");

router.get("/auth", (req, res) => {
    res.redirect(
        "https://www.eventbrite.com/oauth/authorize?response_type=code&client_id=CCDGFBEKISI5AYIRYG&redirect_uri=&redirect_uri=http://localhost:3000/events/list"
    );
});

router.get("/list", (req, res, next) => {
    const eventBrite = () => {
        //let settings = {
        //    "url": "https://www.eventbriteapi.com/v3/categories/102/",
        //    "method": "GET",
        //    "timeout": 0,
        //    "headers": {
        //      "Authorization": "Bearer JFAMGGIPHW2GU7AG7HPY"
        //    },
        //  };

        axios
            .get("https://www.eventbriteapi.com/v3/categories/102/", {
                headers: {
                    Authorization: "Bearer JFAMGGIPHW2GU7AG7HPY",
                },
            })
            .then((response) => {
                console.log(response);
                res.render("events/list");
            });

        //const {code} = req.query
        //const code = "JFAMGGIPHW2GU7AG7HPY"
        //axios.get( `https://www.eventbriteapi.com/v3/categories/102?token=${code}`)

        //.then(response => {
        //    res.send(response)
        //})
        //.catch(err => console.log(err))

        //res.render("events/list");
    };

    Event.find().then((events) => {
        res.render("events/list", { events });
    });
});

router.get("/new", (req, res) => {
    res.render("events/new");
});

router.post("/new", CDNupload.single("image"), (req, res) => {
    const { name, description, date, address, lat, lng, time } = req.body;

    const location = {
        type: "Point",
        coordinates: [lat, lng],
    };

    const fullDate = `${date}T${time}`;

    Event.create({
        name,
        description,
        date: fullDate,
        address,
        location,
        image: req.file?.path,
    })
        .then(() => {
            res.redirect("/events/list");
        })
        .catch((err) => console.log(err));
});

router.get("/details", (req, res) => {
    const { id } = req.query;

    Event.findById(id)
        .then((event) => {
            res.render("events/details", event);
        })
        .catch((err) => console.log(err));
});

router.get("/edit", (req, res) => {
    const { id } = req.query;

    Event.findById(id)
        .lean()
        .then((event) => {
            event.date.fullDate = formatDate(event.date);
            event.date.time = formatTime(event.date);
            res.render("events/edit", event);
        })
        .catch((err) => console.log(err));
});

router.post("/edit");

module.exports = router;
