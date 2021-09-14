
const texts = [" developers", " designers", " coders", " tech enthusiasts", " you."]
const speed = 110   
const pause = 800

let letter = ""
let currentText = ""
let delay = 25

function typeWriter(i=0, index=1, direction=1) {

    let displayed = texts[i].slice(0, index);
    document.querySelector(".typewriter").textContent = displayed;

    if (displayed.length >= texts[i].length) { 
        setTimeout(() => typeWriter(i, index-1, -1), pause);
      } else if (displayed.length === 0) { 
        setTimeout(() => typeWriter((i+1) % texts.length), pause);
      } else {
        setTimeout(() => typeWriter(i, index+direction, direction), speed);
      }
}

typeWriter()

