
let modal = false; 
let modalSuccess = false;

const eventTypes = [ // categories dictionary
  { id: "all", "title": "All", "icon": "fas fa-layer-group" },
  { id: "meetup", "title": "MeetUp", "icon": "fas fa-handshake" },
  { id: "leap", "title": "Leap", "icon": "fas fa-running" },
  { id: "recruiting-mission", "title": "Recruiting Mission", "icon": "fas fa-search" },
  { id: "vanhackaton", "title": "VanHackathon", "icon": "fas fa-laptop-code" },
  { id: "premium-only", "title": "Premium-only Webinar", "icon": "fas fa-dollar-sign" },
  { id: "open-webinar", "title": "Open Webinar", "icon": "fas fa-door-open" },
];

const events = [ // This mocked data is just in case that for some reason mockapi would not work nor the data is null.
  { id: "1", "title": "C++ vs C", "image": "https://michellepircher.com/wp-content/uploads/2015/09/Messe_Luzern_Corporate_Event.jpg", date: '01/05/2020' },
  { id: "2", "title": "Mac OS with Swift", "image": "https://i.pinimg.com/originals/ce/63/99/ce6399736ac9076e01ea0118415d23fd.png", date: '01/05/2020' },
  { id: "3", "title": "Flutter or React Native", "image": "https://michellepircher.com/wp-content/uploads/2015/09/Messe_Luzern_Corporate_Event.jpg", date: '01/05/2020' },
  { id: "4", "title": "Intro to Devops", "image": "https://i.pinimg.com/originals/ce/63/99/ce6399736ac9076e01ea0118415d23fd.png" , date: '01/05/2020'},
  { id: "5", "title": "Vanhack platform", "image": "https://michellepircher.com/wp-content/uploads/2015/09/Messe_Luzern_Corporate_Event.jpg", date: '01/05/2020' },
  { id: "6", "title": "Build the perfect Resume", "image": "https://i.pinimg.com/originals/ce/63/99/ce6399736ac9076e01ea0118415d23fd.png", date: '01/05/2020' },
];

function renderCards() {
  const url = 'https://5ea7234084f6290016ba7c3e.mockapi.io/hackerRank';
  fetch(url).then((resp) => resp.json())
  .then(data => {
    if(data) {
      localStorage.setItem("data", JSON.stringify(data));
    }
    else { 
      localStorage.setItem("data", events);
    }
  }).catch(err => {
    debugger;
    console.log(err);
  });

  $('#events-wrapper').empty();
  let typeIndex = 0;
  const selectedCategory = localStorage.getItem("selectedCategory");
  const eventsData = JSON.parse(localStorage.getItem("data"));

  eventsData.forEach((item) => {
    if (typeIndex > 6)
      typeIndex = 1;
    if(selectedCategory === eventTypes[typeIndex].id || selectedCategory === "all"  ) {
      var card =
      `<div id=${item.id} name=${eventTypes[typeIndex].id} class="${eventTypes[typeIndex].id} card" style="width: 18rem;">
        <div class="card-image-container">
          <span class="icon flex-center floating-icon">
            <i class="${eventTypes[typeIndex].icon}"></i>
          </span>
          <img src="${item.image}" class="card-image" alt="...">
        </div>
        <div class="card-body unselectable">
            <h5 class="card-title">${item.title}</h5>
            <a class="card-date">${item.date.substr(0,10)}</a>
            <p class="card-text">${item.description}</p>
        </div>
      </div>`;  
      $('#events-wrapper').append(card);
    }
    typeIndex += 1; 
  });  
}

function renderEventTypeCards() {
  const selectedEventType = localStorage.getItem("selectedCategory");

  eventTypes.forEach((item, i) => {
    var card =
    `<div id="${item.id}" class="card event-card ${selectedEventType === item.id ? 'event-card-selected' : ''}" style="width: 18rem;">
        <span class="icon flex-center"><i class="${item.icon}"></i></span>
        <span class="card-title-container">
          <h5 class="card-title event-card-title">${item.title}</h5>
        </span>
      </div>`;  
    $('#event-categories-wrapper').append(card);
  });
}


$(function(){

  $('#event-categories-wrapper').on('click', 'div.event-card', (item) => {
    const selectedCardId = item.currentTarget.id;
    $(".event-card").removeClass("event-card-selected");
    $(`#${selectedCardId}`).addClass('event-card-selected');
    localStorage.setItem('selectedCategory', item.currentTarget.id);
    renderCards()
  });

  $('.fa-times-circle').on('click', (item) => {
    if(modal){
      $(`#main-container`).removeClass('blurred-background'); 
      $(`#modal`).addClass('modal-hidden'); 
      $(`#applied-modal`).addClass('modal-hidden'); 
      modal = false;
      modalSuccess = false;
    }
    else {
      $(`#main-container`).addClass('blurred-background'); 
      $(`#applied-modal`).removeClass('modal-hidden'); 
      $("#modal").removeClass("modal-hidden");
      modal = true;
      modalSuccess = true;
    }
  });

  $('#modal-button').on('click', (item) => {
    const appliedEvent = localStorage.getItem("appliedEvent");
    const selectedCategory = localStorage.getItem("appliedEventName");

    $(`#applied-modal`).removeClass('modal-hidden'); 
    modalSuccess = true;
    if(selectedCategory === "premium-only"){
      $("#success-icon").removeClass("fa-check-circle");
      $("#success-icon").addClass("fa-sad-tear");
      $(`#success-title`).html('This is a premium only event'); 
      $(`#success-message`).html('Why don`t you join us? Contact us to become part of the premium team!'); 
      $(`#success-location`).html(''); 
      $(`#success-date`).html(''); 
    }
    else{ 
      $("#success-icon").removeClass("fa-sad-tear");
      $("#success-icon").addClass("fa-check-circle");
      $(`#success-title`).html('You applied successfully!'); 
      $(`#success-message`).html('Everything went well in your application.'); 
      $(`#success-location`).html(''); 
      $(`#success-date`).html(''); 
      $(`#success-location`).html('Location: ' + JSON.parse(appliedEvent).location); 
      $(`#success-date`).html('Date: ' + JSON.parse(appliedEvent).date.substr(0,10)); 
    }
  });

  $('#events-wrapper').on('click', 'div.card', (item, other) => {
    const selectedCardId = item.currentTarget.id;
    const localData = JSON.parse(localStorage.getItem("data"));
    const selectedEvent = localData[selectedCardId - 1];

    localStorage.setItem("appliedEvent", JSON.stringify(selectedEvent));
    localStorage.setItem("appliedEventName", item.currentTarget.classList[0]);

    if(modal){ // hide the modal
      $(`#main-container`).removeClass('blurred-background'); 
      $(`#modal`).addClass('modal-hidden'); 
      modal = false;
    }
    else { // show the modal
      $(`#main-container`).addClass('blurred-background'); 
      $("#modal").removeClass("modal-hidden");
      modal = true;
      $("#modal-image").attr("src", selectedEvent.image);
      $("#modal-title").html(selectedEvent.title);
      $("#modal-date").html(selectedEvent.date.substr(0,10));
      $("#modal-location").html(selectedEvent.location);
      $("#modal-description").html(selectedEvent.description);
    }
  });

});

$(window).ready(() => {  
  localStorage.setItem('selectedCategory', 'all');
  renderEventTypeCards();
  $('#events-wrapper').empty();
  $('#events-wrapper').append(`<i class="fas fa-server"></i><span style="margin-left:10px">Loading...</span>`);
  renderCards();
});
