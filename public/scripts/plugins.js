$(document).ready(function(){

    var controller = new ScrollMagic.Controller();

    parallax();
    animateDevices();
    animateFeatures();

    function parallax(){
        var tl = new TimelineMax();
        tl.to($('#header-bcg'),1, {y:'-50%', ease:Power0.easeNone})
        var scene = new ScrollMagic.Scene({
            triggerElement:'header',
            triggerHook:.1,
            duration:'150%'
        })
        .setTween(tl)
        .addTo(controller);
    }

    function animateDevices(){
        if($(window).width()<650){
            var hook = .5;
        }
        else{
            var hook = .27;
        }
        var scene = new ScrollMagic.Scene({
            triggerElement:'#mac',
            reverse:false,
            triggerHook:hook
        })
        .setClassToggle('#mac, #iphone, #heading-wrapper','fade-in')
        .addIndicators()
        .addTo(controller);
    }

    function animateFeatures(){
        var scene = new ScrollMagic.Scene({
            triggerElement:'#features',
            reverse:false,
            triggerHook:.3
        })
        .setClassToggle('#features h1,#features section','fade-in')
        .addIndicators()
        .addTo(controller);
    }

});
