const router = require("express").Router();
const axios = require("axios");
const { Model } = require("mongoose");
const CDNupload = require("../config/upload.config");
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const { formatDate, formatTime, checkOwner, checkParticipant } = require("../utils");
const { checkId, isLoggedIn, checkRoles } = require("../middleware")

router.get("/auth", (req, res) => {
    res.redirect(
        "https://www.eventbrite.com/oauth/authorize?response_type=code&client_id=CCDGFBEKISI5AYIRYG&redirect_uri=&redirect_uri=http://localhost:3000/events/list"
    );
});

router.get("/list", (req, res, next) => {

    Event
        .find()
        .lean()
        .then((events) => {
            events.forEach((event) =>{ 
                event.time = formatTime(event.date)
                event.date = formatDate(event.date)
            })
            res.render("events/list", { events });
    });
});

router.get("/new", isLoggedIn, (req, res) => {
    res.render("events/new");
});

router.post("/new", CDNupload.single("image"), (req, res) => {

    const owner = req.session.currentUser._id
    const { name, description, date, address, lat, lng, time, country, city } = req.body;

    const location = {
        type: "Point",
        coordinates: [lng, lat],
    };

    const fullDate = `${date}T${time}`;

    Event.create({
        name,
        description,
        date: fullDate,
        address,
        location,
        owner,
        country,
        city,
        image: req.file?.path,
    })
        .then(() => {
            res.redirect("/events/list");
        })
        .catch((err) => console.log(err));
});

router.get("/details",isLoggedIn, (req, res) => {
    const { id } = req.query;

    Event
        .findById(id)
        .populate("owner")
        .populate("participants")
        .then((event) => {
            let isOwner = checkOwner(event.owner.id.toString(), req.session.currentUser._id.toString())
            let isParticipant = checkParticipant(event.participants, req.session.currentUser._id)
            let canJoin = !isOwner && !isParticipant
            res.render("events/details", {event, isOwner, isParticipant, canJoin});
        })
        .catch((err) => console.log(err));
});

router.get("/edit", isLoggedIn, (req, res) => {
    const { id } = req.query;
    console.log('Objeto file de Multer:', req.file)

    Event
        .findById(id)
        .lean()
        .then((event) => {
            event.date.fullDate = formatDate(event.date);
            event.date.time = formatTime(event.date);
            res.render("events/edit", event);
        })
        .catch((err) => console.log(err));
});

router.post("/edit", isLoggedIn, CDNupload.single("new-image"), (req, res) => {
    const { id } = req.query;
    const { name, description, date, location, address } = req.body;
    let image = ""

    if (req.file) {
        image = req.file.path
    } else {
        image = req.body.image
    }

    Event
        .findByIdAndUpdate(id, { name, description, date, location, image, address })
        .then(() => res.redirect(`/events/details?id=${id}`))
        .catch((err) => console.log(err));
});

router.post("/delete", isLoggedIn, (req, res) => {
    const {id} = req.body

    Event
        .findByIdAndDelete(id)
        .then(()=>res.redirect("/events/list"))
        .catch((err) => console.log(err));

});

router.get("/join", isLoggedIn,(req, res) => {
    
    const {id} = req.query
    const participant = req.session.currentUser._id

    Event
        .findById(id)
        .then((event) => {
            //to prevent the user from joining multiple times through the url
            if (checkParticipant(event.participants, req.session.currentUser._id)) {
                res.redirect(`/events/details?id=${id}`)
                return
            }
            return Event
            .findByIdAndUpdate(id, {$push: { participants: participant }})
            .populate()
        })
        .then((event) => res.redirect(`/events/details?id=${id}`))
        .catch((err) => console.log(err));
})

router.get("/delete", isLoggedIn, (req, res) => {
    
    const {id} = req.query
    const participant = req.session.currentUser._id

    Event
        .findById(id)
        .then((event) => {
            //to prevent the user from removing himself from an event which has not joined
            if (!checkParticipant(event.participants, req.session.currentUser._id)) {
                res.redirect(`/events/details?id=${id}`)
                return
            }
            
            return Event
            .findByIdAndUpdate(id, {$pull: { participants: participant }})
            .populate()
        })
        .then(() => res.redirect(`/events/details?id=${id}`))
        .catch((err) => console.log(err));
})

module.exports = router;
