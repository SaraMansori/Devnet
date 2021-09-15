module.exports = {
    capitalize: (text) => text.charAt(0).toUpperCase() + text.substring(1),
    formatDate: (date) => {
        let month = "" + (date.getMonth() + 1);
        let day = "" + date.getDate();
        let year = date.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
    },

    formatTime: (date) => {
        let hour = date.getHours().toString().padStart(2, "0");
        let minutes = date.getMinutes().toString().padStart(2, "0");
        return [hour, minutes].join(":");
    },

    checkOwner: (eventOwnerId, currUserId) => eventOwnerId === currUserId,

    checkParticipant: (eventParticipantsArr, currUserId) => eventParticipantsArr.some(id => id.equals(currUserId))
    
};
