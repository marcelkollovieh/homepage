import { throttle } from 'lodash'

const content = document.getElementById('content'); 
const navbar = document.getElementById('navbar'); 
let parallax = document.querySelector('.parallax') as HTMLElement

const scrollToAbout = () => {
    document.getElementById("about").scrollIntoView({behavior: "smooth"});
}
const scrollToContacts = () => {
    document.getElementById("contacts").scrollIntoView({behavior: "smooth"});
}
const scrollToContent = () => {
    parallax.scrollTo({top: 0,
        left: 0,
        behavior: 'smooth'})
}
const scrollCallback = () => {
    let relative = 1- 2* parallax.scrollTop/parallax.scrollHeight
    content.style.opacity=String(relative*0.6+0.4);
    //document.getElementById("navbar").style.top = String(-relative*60)+'px';
    //parallax.style.paddingTop = String((1-relative)*60)+'px'
    
  }; 

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


document.getElementById('homebutton').addEventListener("click", scrollToContent)
document.getElementById('aboutbutton').addEventListener('click', scrollToAbout);
document.getElementById('aboutbutton2').addEventListener("click", scrollToAbout);
document.getElementById('contactbutton').addEventListener('click', scrollToContacts);
parallax.addEventListener('scroll', throttle(scrollCallback, 50));
