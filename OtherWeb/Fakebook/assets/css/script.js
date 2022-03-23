var settingsmenu = document.querySelector(".settings-menu");
var darkButton = document.getElementById("dark-button");

function settingMenuToggle(){
    settingsmenu.classList.toggle("settings-menu-height");
}

darkButton.onclick = function(){
    darkButton.classList.toggle("dark-button-on");
    document.body.classList.toggle("dark-theme");

    if(localStorage.getItem("theme") == "light"){
        localStorage.setItem("theme", "dark");
    }
    else{
        localStorage.setItem("theme", "light");
    }

}

if(localStorage.getItem("theme") == "light"){
    darkButton.classList.remove("dark-button-on");
    document.body.classList.remove("dark-theme");
}
else if(localStorage.getItem("theme") == "dark"){
    darkButton.classList.add("dark-button-on");
    document.body.classList.add("dark-theme");
}
else{
    localStorage.setItem("theme", "light");
}
