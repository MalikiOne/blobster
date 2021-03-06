(function(localhost) {
    
    var pushScript = function(src, override) {
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.override = override;
        script.src = src;
        document.head.appendChild(script);
    };
    
    var github = function (name) { 
        pushScript("https://rawgit.com/antain/blobster/master/" + name + "?_=" + new Date().getTime(), 0);
    };
    var local = function (name) {
        pushScript("http://" + localhost + "/" + name + "?_=" + new Date().getTime(), 1);
    };

    github("mods/ontando/bonusTabs.js");
    github("mods/ontando/configAutoSave.js");
    github("mods/ontando/renderTestSlow.js");
    github("mods/ontando/autoFire.js");
    github("mods/ontando/autoRespawn.js");
    github("mods/DiaLight/testBot.js");
    
})(window.ontando_mainLoader_localhost);