'use strict';
/*SLIDERS*/
$(document).ready(function() {
  $('.slider-1').bxSlider({
    // auto: true,
    // pause: 8000,
    pager: false,
    infiniteLoop: true
  });
  $('.slider-2').bxSlider({
    pager: false,
    infiniteLoop: true,
    startSlide: 1
  });
  $('.slider-3').bxSlider({
    pager: false,
    infiniteLoop: true,
    startSlide: 2
  });
});

var actGrid = document.querySelector('.activities__grid');
var msnry = new Masonry(actGrid, {
   columnWidth: '.activities__sizer',
   itemSelector: '.activities__item',
   percentPosition: true
 });

var request = new XMLHttpRequest();
function getPixabayJson(word, counter) {

  request.open('GET', 'https://pixabay.com/api/?key=2506275-f30addddea12a14e13f6c6e1d&q=' + word + '&image_type=photo&per_page=' + counter);
  request.send();
  request.onreadystatechange = function() {
    actGrid.innerHTML = ''; // Clearing the content

    if (request.status === 200 && request.readyState === 4) {
      var responseText = JSON.parse(request.responseText);

      //checking for 0 result
      if (responseText.hits.length === 0) {
        addNewElement('p', 'Sorry no images found, try another search term.', actGrid);
      } else { //displaying results with Masonry
        var activitiesSizer = createElementWithClass('div', 'activities__sizer');
        actGrid.appendChild(activitiesSizer); // Adding a Masonry block for responsive layout

        var elems = []; // Array of Masonry blocks to be appended
        var fragment = document.createDocumentFragment();
        for ( var i = 0; i < counter; i++ ) { // Dynamicaly creating the content
          var activitiesItem; // Masonry block for the content
          if (i === 4 || i === 5) {
            activitiesItem = createElementWithClass('div', 'activities__item activities__item_width2');
          } else {
            activitiesItem = createElementWithClass('div', 'activities__item');
          }


          fragment.appendChild(activitiesItem);
          elems.push(activitiesItem);

          var imgText = responseText.hits[i].tags; // Text to be displayed over the background-image
          var imgSrc = responseText.hits[i].webformatURL; // Background-image to be added
          var activitiesItemBg = createElementWithClass('div', 'activities__item-bg'); // Block with underlay
          var activitiesLink = createElementWithClass('a', 'activities__link'); // Link-block for img and text
          var activitiesPhoto = createElementWithClass('div', 'activities__photo'); // Block for the background-image
          var activitiesText = createElementWithClass('span', 'activities__text'); // Block for the text
          elems[i].appendChild(activitiesItemBg);
          activitiesItemBg.appendChild(activitiesLink);
          activitiesLink.appendChild(activitiesPhoto);
          activitiesLink.appendChild(activitiesText);

          activitiesLink.href = responseText.hits[i].pageURL;
          activitiesLink.setAttribute('target', '_blank');
          activitiesPhoto.style.backgroundImage = "url(" + imgSrc + ")";
          activitiesText.innerHTML = imgText;
        }
        // append elements to container
        actGrid.appendChild( fragment );
        // add and lay out newly appended elements
        msnry.appended( elems );
        msnry.layout();
      }
    }
    else if (request.status != 200 && request.status != 0){
      //message for a bad request
      addNewElement('p', 'Sorry, not found...', actGrid);
    }
  }
}
// getPixabayJson('', 7);

// getPixabayJson('', 7);
document.querySelector('.search-btn_find-activities').addEventListener('click', function(ev) {
  ev.preventDefault();
  var elemsToDelete = msnry.getItemElements(); // getting previously added Masonry blocks
  msnry.remove(elemsToDelete); // and deleting them

  var searchWord = document.querySelector('.find-activities__input').value;
  getPixabayJson(searchWord, 7); // triggerring getPixabayJson(word, count);
});

// Creates and adds new elems
function addNewElement(tag, content, parent) {
  var newElement = document.createElement(tag);
  newElement.innerHTML = content;
  parent.appendChild(newElement);
}

// Creates new elems with class
function createElementWithClass(tag, className) {
  var newElement = document.createElement(tag);
  newElement.className = className;

  return newElement;
}
