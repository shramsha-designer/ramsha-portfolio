const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true
});


gsap.registerPlugin(ScrollTrigger);
gsap.to(".loader h1",{
    y:-20,
    opacity:0,
    duration:0.8,
    delay:1
});

gsap.to(".loader p",{
    y:20,
    opacity:0,
    duration:0.8,
    delay:1.1
});

gsap.to(".loader",{
    y:"-100%",
    duration:1,
    delay:1.8,
    ease:"power4.inOut"
});
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
gsap.from("nav",{
    y:-80,
    opacity:0,
    duration:1
});

gsap.from("h1",{
    y:100,
    opacity:0,
    duration:1,
    delay:0.3
});

gsap.from("h2",{
    y:50,
    opacity:0,
    duration:1,
    delay:0.6
});

gsap.from("p",{
    y:50,
    opacity:0,
    duration:1,
    delay:0.9
});

gsap.from("button",{
    scale:0,
    duration:0.8,
    delay:1.2
});

gsap.to(".shape1",{
    y:-40,
    duration:4,
    repeat:-1,
    yoyo:true,
    ease:"sine.inOut"
});

gsap.to(".shape2",{
    y:40,
    duration:5,
    repeat:-1,
    yoyo:true,
    ease:"sine.inOut"
});


gsap.from(".skills span", {
  scrollTrigger: {
    trigger: ".skills",
    start: "top 85%"
  },
  y: 30,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1
});

const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {
  let target = +counter.getAttribute("data-target");

  ScrollTrigger.create({
    trigger: counter,
    start: "top 85%",
    once: true,
    onEnter: () => {
      gsap.to(counter, {
        innerText: target,
        duration: 2,
        snap: { innerText: 1 },
        ease: "power2.out"
      });
    }
  });
});
gsap.from(".projects-heading", {
  scrollTrigger: {
    trigger: ".projects",
    start: "top 75%"
  },
  y: 80,
  opacity: 0,
  duration: 1
});

gsap.from(".project-card", {
  scrollTrigger: {
    trigger: ".project-grid",
    start: "top 80%"
  },
  y: 120,
  opacity: 0,
  duration: 1,
  stagger: 0.25,
  ease: "power3.out"
});


document.querySelectorAll(".project-card").forEach(card => {

    const shine = card.querySelector(".shine");

  card.addEventListener("mousemove", (e) => {

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 15;
    const rotateX = ((y / rect.height) - 0.5) * -15;

    gsap.to(card,{
        rotateX:rotateX,
        rotateY:rotateY,
        duration:0.3
    });

    gsap.to(shine,{
        opacity:0.6,
        x:(x / rect.width) * 300,
        y:(y / rect.height) * 100,
        duration:0.3
    });

});

  card.addEventListener("mouseleave", () => {

    gsap.to(card,{
        rotateX:0,
        rotateY:0,
        duration:0.5
    });

    gsap.to(shine,{
        x:-800,
        opacity:0,
        duration:0.4
    });

});

});
gsap.from(".services-header",{
    scrollTrigger:{
        trigger:".services",
        start:"top 75%"
    },
    y:80,
    opacity:0,
    duration:1
});

gsap.fromTo(".service-card",
    {
        y:120,
        opacity:0
    },
    {
        scrollTrigger:{
            trigger:".services-grid",
            start:"top 85%",
            once:true
        },
        y:0,
        opacity:1,
        duration:1,
        stagger:0.15,
        ease:"power3.out"
    }
);
document.querySelectorAll(".service-card").forEach(card => {
    const glow = card.querySelector(".service-glow");
    if (!glow) return;

    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(glow, {
            left: x,
            top: y,
            opacity: 1,
            duration: 0.2
        });
    });

    card.addEventListener("mouseleave", () => {
        gsap.to(glow, {
            opacity: 0,
            duration: 0.3
        });
    });
});
gsap.from(".process-header",{
    scrollTrigger:{
        trigger:".process",
        start:"top 80%"
    },
    y:80,
    opacity:0,
    duration:1
});

gsap.from(".step",{
    scrollTrigger:{
        trigger:".timeline",
        start:"top 80%"
    },
    x:-100,
    opacity:0,
    duration:1,
    stagger:0.3
});
gsap.from(".testimonials-header",{
    scrollTrigger:{
        trigger:".testimonials",
        start:"top 80%"
    },
    y:80,
    opacity:0,
    duration:1
});

gsap.from(".testimonial-card",{
    scrollTrigger:{
        trigger:".testimonial-marquee",
        start:"top 85%"
    },
    y:80,
    opacity:0,
    duration:1,
    stagger:0.15
});
gsap.from(".tools-header",{
    scrollTrigger:{
        trigger:".tools",
        start:"top 80%"
    },
    y:80,
    opacity:0,
    duration:1
});

gsap.fromTo(".tool-card",
    {
        y:100,
        opacity:0
    },
    {
        scrollTrigger:{
            trigger:".tools-grid",
            start:"top 85%",
            once:true
        },
        y:0,
        opacity:1,
        duration:1,
        stagger:0.08,
        ease:"power3.out"
    }
);
const showcaseData = [
    {
        title: "MOES Group",
        text: "Skincare brand creatives, display ads, and premium product visuals."
    },
    {
        title: "Ecclesiastical Sewing",
        text: "Social media graphics, web banners, and clean brand visuals."
    },
    {
        title: "Kindershake",
        text: "Supplement brand creatives, product ads, and marketing visuals."
    }
];

const showcaseImages = document.querySelectorAll(".showcase-img");
const showcaseTitle = document.querySelector(".showcase-title");
const showcaseText = document.querySelector(".showcase-text");

showcaseImages[0].classList.add("active");

ScrollTrigger.create({
    trigger: ".showcase",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
        let index = Math.floor(self.progress * showcaseData.length);

        if(index >= showcaseData.length){
            index = showcaseData.length - 1;
        }

        showcaseTitle.textContent = showcaseData[index].title;
        showcaseText.textContent = showcaseData[index].text;

        showcaseImages.forEach((img, i) => {
            gsap.to(img, {
                opacity: i === index ? 1 : 0,
                scale: i === index ? 1 : 0.9,
                duration: 0.5
            });
        });
    }
});
gsap.from(".contact-content",{
    scrollTrigger:{
        trigger:".contact",
        start:"top 80%"
    },
    y:100,
    opacity:0,
    duration:1,
    ease:"power3.out"
});

document.querySelectorAll(".magnetic-btn").forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();

        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn,{
            x:x * 0.3,
            y:y * 0.3,
            duration:0.3
        });
    });

    btn.addEventListener("mouseleave", () => {
        gsap.to(btn,{
            x:0,
            y:0,
            duration:0.4
        });
    });
});
const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");

window.addEventListener("mousemove",(e)=>{

    gsap.to(dot,{
        x:e.clientX,
        y:e.clientY,
        duration:0
    });

    gsap.to(outline,{
        x:e.clientX,
        y:e.clientY,
        duration:0.3
    });

});
const hoverItems = document.querySelectorAll(
    "a, button, .project-card, .service-card, .tool-card"
);

hoverItems.forEach(item=>{

    item.addEventListener("mouseenter",()=>{

        gsap.to(".cursor-outline",{
            scale:2,
            duration:0.3
        });

    });

    item.addEventListener("mouseleave",()=>{

        gsap.to(".cursor-outline",{
            scale:1,
            duration:0.3
        });

    });

});
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");

    if(mobileMenu.classList.contains("active")){
        menuToggle.textContent = "×";
    } else {
        menuToggle.textContent = "☰";
    }
});

document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        menuToggle.textContent = "☰";
    });
});
gsap.from(".hero-badge",{

opacity:0,
y:50,
duration:1

});

gsap.from(".hero-title",{

opacity:0,
y:80,
duration:1,
delay:.2

});

gsap.from(".hero-subtitle",{

opacity:0,
y:60,
duration:1,
delay:.4

});

gsap.from(".hero-description",{

opacity:0,
y:60,
duration:1,
delay:.6

});

gsap.from(".hero-buttons",{

opacity:0,
y:60,
duration:1,
delay:.8

});

gsap.to(".hero-bg-text",{

x:-300,

scrollTrigger:{

trigger:".hero",

start:"top top",

end:"bottom top",

scrub:true

}

});
const hero = document.querySelector(".hero");

hero.addEventListener("mousemove",(e)=>{

const x=(e.clientX/window.innerWidth-.5)*30;
const y=(e.clientY/window.innerHeight-.5)*30;

gsap.to(".hero-content",{

x,
y,
duration:.6

});

});
gsap.from(".about-left",{
    x:-250,
    opacity:0,
    duration:1.2,
    ease:"power4.out",
    scrollTrigger:{
        trigger:".about",
        start:"top 70%"
    }
});

gsap.from(".about-right",{
    x:250,
    opacity:0,
    duration:1.2,
    ease:"power4.out",
    scrollTrigger:{
        trigger:".about",
        start:"top 70%"
    }
});
