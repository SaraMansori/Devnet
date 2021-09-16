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
    //WIP

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

    const owner = req.session.currentUser._id
    const { name, description, date, address, lat, lng, time } = req.body;

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
        image: req.file?.path,
    })
        .then(() => {
            res.redirect("/events/list");
        })
        .catch((err) => console.log(err));
});

router.get("/details", (req, res) => {
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

router.get("/edit", (req, res) => {
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

router.post("/edit", CDNupload.single("new-image"), (req, res) => {
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

router.post("/delete", (req, res) => {
    const {id} = req.body

    Event
        .findByIdAndDelete(id)
        .then(()=>res.redirect("/events/list"))
        .catch((err) => console.log(err));

});

router.get("/join", (req, res) => {
    
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

router.get("/delete", (req, res) => {
    
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
