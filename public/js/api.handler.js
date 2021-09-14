class EventsApiHandler {

    constructor() {

        this.app = axios.create({
            baseURL: 'https://www.eventbriteapi.com/v3'
        })
    }

    getAllEvents = () => {
        // window.location.replace(
        //     "https://www.eventbrite.com/oauth/authorize?response_type=token&client_id=CCDGFBEKISI5AYIRYG&redirect_uri=https://www.eventbrite.com/oauth/authorize?response_type=token&client_id=CCDGFBEKISI5AYIRYG&redirect_uri=http://localhost:3000/events"
        //     );
        // this.app.get('/categories/102?token=JFAMGGIPHW2GU7AG7HPY')
    }
    //getOneCharacter = id => this.app.get(`/characters/${id}`)
    //saveCharacter = characterInfo => this.app.post('/characters', characterInfo)
    //editCharacter = (id, characterInfo) => this.app.put(`/characters/${id}`, characterInfo)
}