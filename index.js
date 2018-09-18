const API_KEY = "6a6275c0-b77e-11e8-a4d1-69890776a30b";
var currPage = 0;
//shows all the galleries if the page is loaded
document.addEventListener("DOMContentLoaded", () => {
  const url = `https://api.harvardartmuseums.org/gallery?apikey=${API_KEY}`;
  showGalleries(url);
});

function showGalleries(url) {
  currPage = 1;
  fetch(url)
  .then(response => response.json())
  //callbacks so that once it has the data it can display each gallery
  .then(data => {
    data.records.forEach(gallery => {
      //first sets a warning that a gallery has no objects so person doesn't click there (extra feature)
      var objectless = false;
      //way to warn user that a gallery empty to avoid waste of clicking
      if (gallery.objectcount == 0)
      {
        objectless = true;
      }
      //adds information on each gallery, including an object count
      document.querySelector("#galleries").innerHTML += `
        <li>
          <a href="#${gallery.id}" onclick="showObjectsTable(${gallery.id})">
            Gallery #${gallery.id}: ${gallery.name} (Floor ${gallery.floor})`
        if (objectless)
        {
          document.querySelector("#galleries").innerHTML += `
          <i>No objects in this space :(</i>
            <p></p>
            </a>
          </li><p></p>`
        }
        else {
          document.querySelector("#galleries").innerHTML += `
              Object Count: ${gallery.objectcount}
            <p></p>
            </a>
          </li><p></p>
        `;
        }
    });
    if (data.info.next) {
      showGalleries(data.info.next);
    }
  })
  //doesn't display other HTML elements on this page
  document.querySelector("#all-galleries").style.display = "block"; //new
  document.querySelector("#all-objects").style.display = "none";
  document.querySelector("#boton").style.display = "none";
  document.querySelector("#single-object").style.display = "none";
}

//back button but only on an individual object page since was funky for a single gallery
window.addEventListener("hashchange", () => {
  // the galleries have id lengths of four numbers
  //so checking the length of the previous page's hash can tell you if you have to go back to that gallery
  //this was a trick that Mohamed Ally helped me think through earlier today
  var hash = window.location.hash.slice(1);
  //going from an individual object to the gallery to which it belongs since previous page had hash length 4
  if(hash.length == 4 && currPage == 3)
  {
    showObjectsTable(hash);
  }
  //going back to the start page
  else if(hash.length== 0 && currPage!=3)
  {
    window.location.reload();
  }
});

//shows table of objects in a specific gallery
function showObjectsTable(id) {
  currPage = 2;
  //resets the HTML so that going back won't duplicate the page
  document.querySelector("#objects").innerHTML = ``;
  const ids = `https://api.harvardartmuseums.org/object?gallery=${id}&apikey=${API_KEY}`;
  fetch(ids)
  .then(response => response.json())
  .then(data => {
    //creates a list of people who contributed to the object to list as contributors
    data.records.forEach(object => {
      var names = "";
      if (object.people != null)
      {
        object.people.forEach(people =>{
          names+= people.name + " ";
        })
      }
       document.querySelector("#objects").innerHTML += `
        <li>
          <a href="#${object.id}" onclick="showObjectDescription(${object.id})">
            Work Title: ${object.title}
          </li>
          <li> Author(s): ${names}
          </li>
          <li>
            <a href = "${object.url}">URL to Main Page</a> </li> `
        //checks if object has an image and displays it if it does
        if(object.primaryimageurl)
        {
            document.querySelector("#objects").innerHTML += `
            <img id = "newImage" src = "${object.primaryimageurl}" height = 200 width = 200></img><p></p>
        `;
      }
      else {
        {
          document.querySelector("#objects").innerHTML+= `
            No image available. <p></p>
          `;
        }
      }
    document.querySelector("#objects").innerHTML += `</a>`
    });
})
  document.querySelector("#all-objects").style.display = "block";
  document.querySelector("#all-galleries").style.display = "none";
  document.querySelector("#single-object").style.display = "none";
  document.querySelector("#boton").style.display = "block";
}

//shows description of a single object
function showObjectDescription(idg) {
  currPage = 3;
  console.log(idg);
  const objurl = `https://api.harvardartmuseums.org/object/${idg}?apikey=${API_KEY}`;
  console.log(objurl);
  fetch(objurl)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    //many conditions so that if object missing an attribute, it displays none instead
    document.querySelector("#singleobject").innerHTML = `
      <li> Work Title: ${data.title} </li>`
    var description = "None";
    if(data.description)
    {
      description = data.description;
    }
    document.querySelector("#singleobject").innerHTML += `
      <li> Description: ${description} </li>`
    var prov = "None";
    if(data.provenance)
    {
      prov = data.provenance;
    }
    document.querySelector("#singleobject").innerHTML += `
      <li>Provenance: ${prov}</li>`
    var accessionyear = "Unknown";
    if(data.accessionyear)
    {
      accessionyear = data.accessionyear;
    }
    document.querySelector("#singleobject").innerHTML += `
      <li> Accession Year: ${accessionyear}</li>`
    if(data.primaryimageurl)
      {
          document.querySelector("#singleobject").innerHTML += `
          <img id = "newImage" src = "${data.primaryimageurl}" height = 400 width = 400></img>
      `;
    }
    //does not display other HTML elements here
  document.querySelector("#single-object").style.display = "block";
  document.querySelector("#all-objects").style.display = "none";
  document.querySelector("#boton").style.display = "block";
  document.querySelector("#all-galleries").style.display = "none";
})
}
