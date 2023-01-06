export async function fetchAllHeroes(url){
    let response = await fetch(url);
    let data = await response.json();
    // setTimeout(function(){
    // console.log(data)},3000);
    console.log(data);
    return data;
};
