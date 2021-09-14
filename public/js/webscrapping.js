const axios = require("axios");

const getEventsId = () => {
    let n = 1;
    while (n <= 5) {
        axios
            .get(`https://www.eventbrite.com/d/online/tech-event/?page=${n}`)
            .then((response) => {
                const html = response.data;
                const result = html
                    .match(/eid=(\d+)/gm)
                    .map((e) => e.replace(/eid=/, ""));
                console.log(result);
                n++;
            });
    }
};
