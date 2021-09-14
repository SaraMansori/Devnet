document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("proyect2ironhack JS imported successfully!");
    const apiHandler = new EventsApiHandler()
    
    printEvents()
    
    function printEvents() {
    
      apiHandler
        .getAllEvents()
        .then((response) => console.log(response))
        .catch(err => console.log('ERROR', err))
    }
  },
  false
);

