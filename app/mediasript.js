function loading() {
    var tl = gsap.timeline()
    tl.to("#yellow1", {
        top: "-100%",
        delay: 0.1,
        duration: 1.5,
        ease: "expo.out"
    });
    tl.from("#yellow2", {
        top: "100%",
        delay: 0.8,
        duration: 0.8,
        ease: "7s expo.out",
        opacity: 0.05
    }, "anim");
    tl.to("#loader h1", {
        delay: 0.6,
        duration: 1,
        color: "black"
    }, "anim");
    tl.to("#loader", {
        opacity: 0
    });
    tl.to("#loader", {
        display: "none"
    });
}
loading()

const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true,
    lerp: 0.02
});
