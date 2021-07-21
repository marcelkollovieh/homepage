import { throttle } from 'lodash'


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
const scrollCallback = () => {
    let relative = 1- 2* parallax.scrollTop/parallax.scrollHeight
    content.style.opacity=String(relative);
    document.getElementById("navbar").style.top = String(-relative*50)+'px';
    parallax.style.paddingTop = String((1-relative)*50)+'px'
    
  };
parallax.addEventListener('scroll', throttle(scrollCallback, 100));
//document.getElementById('b').addEventListener('click', button)
document.getElementById('b').addEventListener('click', drawSquare);

  