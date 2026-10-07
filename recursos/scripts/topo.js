document.addEventListener("DOMContentLoaded", function () {

    const botaoTopo = document.getElementById("voltarTopo");

    if (!botaoTopo) {
        return;
    }

    window.addEventListener("scroll", function () {

        if (window.scrollY > 300) {
            botaoTopo.style.opacity = "1";
            botaoTopo.style.visibility = "visible";
            botaoTopo.style.transform = "translateY(0)";
        } else {
            botaoTopo.style.opacity = "0";
            botaoTopo.style.visibility = "hidden";
            botaoTopo.style.transform = "translateY(8px)";
        }

    });

    botaoTopo.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});