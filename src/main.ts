import Hammer from "hammerjs";

const sectionsContainer = document.getElementById("container");
const sections = document.getElementById("sections");
const sectionNames = ['Home', 'Education', 'Work Experience', 'Recent Work', 'Contact']
const numPages = sections.childElementCount;
let currentPage = 0;

// override default listeers
sectionsContainer.ondragstart = (e: Event) => {
  e.preventDefault();
};
sectionsContainer.onclick = (e: Event) => {
  if (!(e.target instanceof HTMLAnchorElement)) {
    e.preventDefault();
  }
  e.stopPropagation();
};

let panning = false;
let lastDeltaY = 0;
let pageAtPanStart = -1;
let swiped = false;

// set up swipe and drag
//let pageHeight = sectionsContainer.getBoundingClientRect().height;
let pageHeight = window.innerHeight;


const scrollToPosition = (scrollPosition: number, animate = false) => {
  if (animate) {
    sectionsContainer.scrollTo({ top: scrollPosition, behavior: "smooth" });
  } else {
    sectionsContainer.scrollTop = scrollPosition;
  }
};

sectionsContainer.onscroll = sectionsContainer.onwheel = () => {
  const newCurrentPage = Math.round(sectionsContainer.scrollTop / pageHeight);
  if (currentPage !== newCurrentPage) {
    currentPage = newCurrentPage;

    pageDots.forEach((pageDotParent, i) => {
      pageDotParent.children[1].classList.toggle("active", i===currentPage)
    });
    navbarHrefs.forEach((navbarHref, i) => {
      navbarHref.classList.toggle("active", i === currentPage);
    });
  }
};

const snapToPage = (pageNumber: number) => {
  if (pageNumber >= numPages) {
    pageNumber = numPages - 1;
  }
  scrollToPosition(pageNumber * pageHeight, true);
};
snapToPage(0);

// set up Hammer.js
const hammer = new Hammer(sectionsContainer);
hammer.on("panend pan swipe", (ev) => {
  ev.preventDefault();
  ev.srcEvent.preventDefault();
  let bottom = ev.deltaY < 0;

  // weird Hammer.js behavior sometimes when scrolling vertically
  if (ev.type === "pan" && ev.isFinal) {
    return;
  }

  switch (ev.type) {
    case "pan":
      if (!swiped) {
        const deltaY = ev.deltaY - lastDeltaY;
        panning = true;
        if (pageAtPanStart < 0) {
          pageAtPanStart = currentPage;
        }
        sectionsContainer.classList.add("panning");
        scrollToPosition(sectionsContainer.scrollTop - deltaY);
        lastDeltaY = ev.deltaY;
      }
      break;

    case "swipe":
      swiped = true;
      lastDeltaY = 0;
      // eslint-disable-next-line no-bitwise
      bottom = (ev.direction & Hammer.DIRECTION_DOWN) === 0;
      snapToPage(pageAtPanStart + (bottom ? 1 : -1));
      setTimeout(() => {
        panning = false;
        pageAtPanStart = -1;
        sectionsContainer.classList.remove("panning");
      }, 0);
      ev.srcEvent.stopPropagation();
      break;

    case "panend":
      if (!swiped) {
        lastDeltaY = 0;
        snapToPage(currentPage);
        setTimeout(() => {
          panning = false;
          pageAtPanStart = -1;
          sectionsContainer.classList.remove("panning");
        }, 0);
      }
      swiped = false;
      break;

    default:
      break;
  }
});

// add page dots
const pageDotsElement = document.getElementById("page-dots");
const pageDots: HTMLElement[] = [];
if (pageDotsElement) {
  for (let i = 0; i < numPages; i += 1) {
    const pageDotParent = document.createElement("div");
    const pageDot = document.createElement("div");
    const label = document.createElement("div");
    label.textContent = sectionNames[i];
    pageDotParent.appendChild(label)
    pageDotParent.appendChild(pageDot)
    pageDotParent.classList.add("page-dot-parent");
    pageDot.classList.add("page-dot");
    pageDot.addEventListener("mouseover", () => {
      label.classList.toggle("active")
    })
    pageDot.addEventListener("mouseout", () => {
      label.classList.toggle("active")
    })
    label.classList.add("page-dot-label")
    if (i === 0) {
      pageDot.classList.add("active");
    }

    pageDotsElement.appendChild(pageDotParent);
    pageDotParent.onclick = () => {
      snapToPage(i);
    };
    pageDots.push(pageDotParent);
  }
}

//navbar entries
const navbarElement = document.getElementById("navbar");
const navbarHrefs: HTMLElement[] = [];
console.log(navbarElement)
if (navbarElement) {
  for (let i = 0; i < numPages; i += 1) {
    const navbarHref = document.createElement("div");
    navbarHref.textContent = sectionNames[i];
    navbarHref.classList.add("navbar-button");
    if (i === 0) {
      navbarHref.classList.add("active");
    }
    console.log(i);

    navbarElement.appendChild(navbarHref);
    navbarHref.onclick = () => {
      console.log(i);
      snapToPage(i);
    };
    navbarHrefs.push(navbarHref);
  }
}
console.log(navbarHrefs)


let lastWheelTime = new Date(0);
window.onwheel = (e: WheelEvent) => {
  if (new Date().getTime() - lastWheelTime.getTime() < 500) return;
  lastWheelTime = new Date();

  if (e.deltaY > 0) {
    // down
    if (currentPage >= numPages - 1) return;
    currentPage += 1;
    snapToPage(currentPage);
  } else {
    // up
    if (currentPage <= 0) return;
    currentPage -= 1;
    snapToPage(currentPage);
  }
};

document.getElementById('aboutbutton').addEventListener('click', () => snapToPage(1));

/* document.getElementById('homebutton').addEventListener("click", scrollToContent)
document.getElementById('aboutbutton').addEventListener('click', scrollToAbout);
document.getElementById('aboutbutton2').addEventListener("click", scrollToAbout);
document.getElementById('contactbutton').addEventListener('click', scrollToContacts); */
//parallax.addEventListener('scroll', throttle(scrollCallback, 200));
//parallax.addEventListener('scroll', debounce(scrollCallback, 500));
