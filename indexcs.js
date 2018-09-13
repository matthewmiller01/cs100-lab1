const myAPIKey = '6a6275c0-b77e-11e8-a4d1-69890776a30b'
document.addEventListener("DOMContentLoaded", () => {
  const url = `https://api.harvardartmuseums.org/gallery?apikey=${myAPIKey}`;
  fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
}); //used the API key given to me by Harvard art museums
