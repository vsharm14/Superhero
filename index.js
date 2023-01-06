import { fetchAllHeroes } from "./services.js";
let publicKey = '18fda8a2edfed1b2a1c46f84eb14b719';
let privateKey = 'a3266943d5f1c3924d58aa2e7dbae70b0d2b24da';
let ts = new Date().getTime();
let message = ts+privateKey+publicKey;
var a = CryptoJS.MD5(message);
let allHeroUrl = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${a.toString()}`;
console.log("this is the url:", allHeroUrl);
let allHeroes = await fetchAllHeroes(allHeroUrl);
let heroesList = document.getElementById("superHeroesList");
let favouriteHeroList = document.getElementById("favouriteHeroList");
let body = document.getElementsByTagName('body');
let main = document.getElementById('main');
let heroPage = document.getElementById('heroPage');
let heroName = document.getElementById('heroName');
let heroDesc = document.getElementById('heroDesc');
let heroImg = document.getElementById('heroImg');
let heroComics = document.getElementById('heroComics');
let heroStories = document.getElementById('heroStories');
let heroMainDetails = document.getElementById('heroMainDetails');
let heroSecDetails = document.getElementById('heroSecDetails');
let home = document.getElementById("Home");
let favouriteHero = document.getElementById("favouriteHero");
let favourite = document.getElementById("favourite");
let searchBox = document.getElementById("searchBox");
let heroSearchList = '';
let searchList = document.getElementById("searchList");

searchBox.oninput = async function sarchFunction(event){
    heroSearchList = '';
    searchList.style.display = "none";
    searchList.innerHTML = '';
    console.log("value of the input id being changed here",event.target.value);
    let characterUrl = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${event.target.value}&ts=${ts}&apikey=${publicKey}&hash=${a.toString()}`;
    heroSearchList = await fetchAllHeroes(characterUrl);
    let results = heroSearchList.data.results;
    if(results.length > 0){
        searchList.style.display = "block";
    }
    results.forEach(function (hero) {
    console.log("allHeroes.data.results.id",hero.id);
    console.log("allHeroes.data.results.id",hero.name);
    let ul = document.createElement("ul");
    ul.innerHTML ='';
    ul.setAttribute("class","searchList");
    let li = document.createElement("li");
    li.setAttribute("id",hero.id);
    let btn = document.createElement('span');
    btn.setAttribute("class","searchBtn");
    btn.setAttribute("id",hero.id);
    btn.className = "searchBtn";
    btn.innerHTML = '<i class="fa fa-heart-o" aria-hidden="true"></i>';
    li.innerHTML = hero.name + '&nbsp' + '&nbsp';
    li.appendChild(btn);
    ul.appendChild(li);
    searchList.appendChild(ul);    
});
}

body.onload = function(){
heroPage.style.display = 'none';
favourite.style.display = 'none';
}();

home.addEventListener('click',()=>{
    heroPage.style.display = 'none';
    favourite.style.display = 'none';
    main.style.display = 'block';
});

favouriteHero.addEventListener('click',()=>{
    heroPage.style.display = 'none';
    main.style.display = 'none';
    favourite.style.display = 'block';
});

let results = allHeroes.data.results;
let favHeroList = results.slice(7,14);
results.forEach(function (hero) {
    console.log("allHeroes.data.results.id",hero.id);
    let link = document.createElement("a");
    let img = document.createElement("img");
    img.src = hero.thumbnail.path + "/" + "portrait_xlarge" + "." + hero.thumbnail.extension;
    let list = document.createElement("li");
    img.setAttribute("id",hero.id);
    img.setAttribute("class","heroItem");
    list.appendChild(img);
    list.appendChild(link);
    heroesList.appendChild(list);
});

document.body.addEventListener('click',function(evt){
    console.log("an item is being clicked here",evt.target.className);   
    if(evt.target.className =='heroItem'){
    let idArray = evt.composedPath()[0].id;
    console.log("idArray",idArray);
    showHeroPage(idArray);
}

if(evt.target.className =='fa fa-heart-o'){
    let idArray = +evt.composedPath()[2].id;
    console.log("idArray",idArray,typeof(idArray));
    console.log("this is array",heroSearchList.data.results);
    heroSearchList.data.results.forEach((hero)=>{
        console.log(hero.id,typeof(hero.id));
    })
    let favouriteHero = heroSearchList.data.results.filter((hero)=>{
        return hero.id == idArray;
    });
    if(favouriteHero.length >0){
    console.log(favouriteHero[0]);
    console.log("favHeroList",favHeroList);
    let alreadyPresent = favHeroList.filter((hero) => {
        return hero.id == idArray;
    });
    console.log("ans",alreadyPresent);
    if(alreadyPresent.length == 0){
    favHeroList.unshift(favouriteHero[0]);
    console.log("favHeroList",favHeroList);
    heroPage.style.display = 'none';
    main.style.display = 'none';
    favourite.style.display = 'block';
    showFavouriteHeroPage(favHeroList);
}else{
    alert("Superhero already in your favourite list");
}
    }
}
});

async function showHeroPage(id){
    let characterUrl = `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${ts}&apikey=${publicKey}&hash=${a.toString()}`;
    main.style.display = 'none';
    favourite.style.display = 'none';
    heroPage.style.display = 'block';
    let hero = await fetchAllHeroes(characterUrl);
    let name = document.createElement("h1");
    let description = document.createElement("h3");
    name.innerText = hero.data.results[0].name;
    description.innerText = hero.data.results[0].description;
    let img = document.createElement("img");
    img.src = hero.data.results[0].thumbnail.path + "/" + "portrait_incredible" + "." + hero.data.results[0].thumbnail.extension;
    heroName.appendChild(name);
    heroDesc.appendChild(description);
    heroImg.appendChild(img);
    let comicsList = document.createElement("ul");
    let comicsText = document.createElement("h2");
    comicsText.innerText = "Comics Till Today:";
    comicsList.appendChild(comicsText);
    hero.data.results[0].comics.items.forEach(function (hero) {
        let list = document.createElement("li");
        list.innerText = hero.name;
        comicsList.appendChild(list);
        heroComics.appendChild(comicsList);
    });
    
    let storiesList = document.createElement("ul");
    let storiesText = document.createElement("h2");
    storiesText.innerText = "Stories Till Today:";
    storiesList.appendChild(storiesText);
    hero.data.results[0].stories.items.forEach(function (hero) {
        let list = document.createElement("li");
        list.innerText = hero.name;
        storiesList.appendChild(list);
        heroStories.appendChild(storiesList);
    });

    let seriesList = document.createElement("ul");
    let seriesText = document.createElement("h2");
    seriesText.innerText = "Series Till Today:";
    seriesList.appendChild(seriesText);
    hero.data.results[0].series.items.forEach(function (hero) {
        let list = document.createElement("li");
        list.innerText = hero.name;
        seriesList.appendChild(list);
        heroSecDetails.appendChild(seriesList);
    });
    console.log("hero",hero.data.results[0].name);
}


favouriteHero.addEventListener('click',()=>{
    heroPage.style.display = 'none';
    main.style.display = 'none';
    favourite.style.display = 'block';
    showFavouriteHeroPage(favHeroList);

});

function showFavouriteHeroPage(list){
        list.forEach(function (hero) {
        let link = document.createElement("a");
        let img = document.createElement("img");
        let name = document.createElement("h2");
        name.innerText= hero.name;
        let description = document.createElement("h3");
        description.innerText= hero.description;
        if(hero.description == ''){
            description.innerText = "There is no desceiption available for this seperhero!!";
        }
        img.src = hero.thumbnail.path + "/" + "portrait_incredible" + "." + hero.thumbnail.extension;
        let list = document.createElement("li");
        img.setAttribute("id",hero.id);
        img.setAttribute("class","heroItem");
        list.appendChild(name);
        list.appendChild(img);
        list.appendChild(description);
        list.appendChild(link);
        favouriteHeroList.appendChild(list);
    });
}