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
const isMobile = () => {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
  return check;
};

let panning = false;
let lastDeltaY = 0;
let pageAtPanStart = -1;
let swiped = false;

// set up swipe and drag
//let pageHeight = sectionsContainer.getBoundingClientRect().height;
let pageHeight = isMobile() ? window.outerHeight : window.innerHeight;

window.onresize = () => {
  pageHeight = window.innerHeight;
  snapToPage(currentPage);
}

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

    pageDots.forEach((pageDot, i) => {
      pageDot.classList.toggle("active", i === currentPage);
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
  // if (ev.type === "pan" && ev.isFinal) {
  //   return;
  // }

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
    const pageDot = document.createElement("div");
    pageDot.classList.add("page-dot");
    
    if (i === 0) {
      pageDot.classList.add("active");
    }

    pageDotsElement.appendChild(pageDot);
    pageDot.onclick = () => {
      snapToPage(i);
    };
    pageDots.push(pageDot);
  }
}

//navbar entries
const navbarElement = document.getElementById("navbar");
const navbarHrefs: HTMLElement[] = [];
if (navbarElement) {
  for (let i = 0; i < numPages; i += 1) {
    const navbarHref = document.createElement("div");
    navbarHref.textContent = sectionNames[i];
    navbarHref.title = sectionNames[i];
    navbarHref.classList.add("navbar-button");
    if (i === 0) {
      navbarHref.classList.add("active");
    }

    navbarElement.appendChild(navbarHref);
    navbarHref.onclick = () => {
      snapToPage(i);
    };
    navbarHrefs.push(navbarHref);
  }
}


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
window.onkeydown = (e: KeyboardEvent) => {
  if (new Date().getTime() - lastWheelTime.getTime() < 500) return;
  lastWheelTime = new Date();

  if (e.key === 'ArrowDown'){
    if (currentPage >= numPages - 1) return;
    currentPage += 1;
    snapToPage(currentPage);
  }
  if (e.key === 'ArrowUp'){
    if (currentPage <= 0) return;
    currentPage -= 1;
    snapToPage(currentPage);
  }
}
document.getElementById('aboutbutton').onclick = () => snapToPage(1);
document.getElementById('scrolldown').onclick = () => snapToPage(1);
