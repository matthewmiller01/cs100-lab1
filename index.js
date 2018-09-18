const API_KEY = "6a6275c0-b77e-11e8-a4d1-69890776a30b";

document.addEventListener("DOMContentLoaded", () => {
  const url = `https://api.harvardartmuseums.org/gallery?apikey=${API_KEY}`;
  showGalleries(url);
});

function showGalleries(url) {
  fetch(url)
  .then(response => response.json())
  .then(data => {
    data.records.forEach(gallery => {
      document.querySelector("#galleries").innerHTML += `
        <li>
          <a href="#${gallery.id}" onclick="showObjectsTable(${gallery.id})">
            Gallery #${gallery.id}: ${gallery.name} (Floor ${gallery.floor})
          <p></p>
          </a>
        </li>
      `;
    });
    if (data.info.next) {
      showGalleries(data.info.next);
    }
  })
}

function showObjectsTable(id) {
  const ids = `https://api.harvardartmuseums.org/object?gallery=${id}&apikey=${API_KEY}`;
  console.log(ids);
  fetch(ids)
  .then(response => response.json())
  .then(data => {
    document.querySelector('#suh').innerHTML += `
    <a href="#suh" onclick="showGalleries(url)"></a>
    `
    data.records.forEach(object => {
      console.log(object);
      var names = "";
      if (object.people != null)
      {
        object.people.forEach(people =>{
          names+= people.name + " ";
          console.log(names);
        })
      }
      document.querySelector("#objects").innerHTML += `
        <li>
          <a href="#${object.exact_title}" onclick="showObjectDescription(${object.objectid})">
            Work Title: ${object.title}
          </li>
          <li> Author(s): ${names}
          </li>
          <li>
            <a href = "${object.url}">URL to Main Page</a> </li> `

        if(object.primaryimageurl)
        {
            document.querySelector("#objects").innerHTML += `
            <img id = "newImage" src = "${object.primaryimageurl}"></img>)
        `;
      }
    document.querySelector("#objects").innerHTML += `</a>`
    });
})
  document.querySelector("#all-objects").style.display = "block";
  document.querySelector("#all-galleries").style.display = "none";
}

function showObjectDescription(idg) {
  const objurl = `https://api.harvardartmuseums.org/object/${idg}&apikey=${API_KEY}`;
  console.log(objurl);
  fetch(objurl)
  .then(response => response.json())
  .then(data => {
      document.querySelector("#singleobject").innerHTML += `
        Work Title: ${object.title}`
      console.log("#singleobject");
  });
  document.querySelector("#all-objects").style.display = "block";
  document.querySelector("#all-galleries").style.display = "none";
}
