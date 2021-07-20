import * as Tone from 'tone'

const button = () => {
    document.getElementById('hd12').textContent='Gedrueckt'
    const synth = new Tone.Synth().toDestination();
    
    const now = Tone.now();
    synth.triggerAttackRelease("C4", "8n", now);
    synth.triggerAttackRelease("E4", "8n", now + 0.5);
    synth.triggerAttackRelease("C4", "8n", now + 0.1);
    synth.triggerAttackRelease("E4", "8n", now + 0.21);
    synth.triggerAttackRelease("G4", "8n", now + 1);
};

const sq = document.getElementById('sq'); //as HTMLDivElement
const content = document.getElementById('content'); //as HTMLDivElement
const navbar = document.getElementById('navbar'); //as HTMLDivElement
let parallax = document.querySelector('.parallax') as HTMLElement
const drawSquare = () => {
    //sq.classList.toggle('pressed')
    content.classList.toggle('pressed')

    //document.getElementById("content").style.height = "50px";

    document.getElementById("about").scrollIntoView({behavior: "smooth"});
}


parallax.addEventListener('scroll', function() {
    let relative = 1- 2* parallax.scrollTop/parallax.scrollHeight
    console.log(relative)
    content.style.opacity=String(relative);
    document.getElementById("navbar").style.top = String(relative*50)+'px';
        parallax.style.paddingTop = String((1-relative)*50)+'px'
    
  });
//document.getElementById('b').addEventListener('click', button)
document.getElementById('b').addEventListener('click', drawSquare);
