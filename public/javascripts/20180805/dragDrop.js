const $input = $('.input-field');

$input.on('click', function (e) {
  const $this = $(this);
  const $search = $input.find('input');
  const $cover = $('.nav-cover-zone');
  const $logo = $('.logo-field');

  $cover.attr('type', 'input');
  $logo.attr('type', 'input');
  $this.attr('type', 'input');
  e.stopPropagation();

  $('body').on('click', function () {
    $cover.attr('type', '');
    $logo.attr('type', '');
    $this.attr('type', '');
  });
});


const $profile = $('.nav-profile-field');
const $profileCloser = $('.logout-field > .closer');
const $logoutField = $('.logout-field');

$profile.on('click', function () {
  $logoutField.attr('type', 'true');
});

$profileCloser.on('click', function () {
  $logoutField.attr('type', 'false');
});


const $th = $('.icon-button-field[command=grid]');
const $cardPart = $('.card-part');
$th.on('click', function () {
  const $this = $(this);
  const attr = $this.attr('type');
  if (attr === 'list' || attr === 'card') {
    $this.attr('type', attr === 'card' ? 'list' : 'card');
    $cardPart.attr('type', attr === 'card' ? 'list' : 'square');
  } else {
    $this.attr('type', attr === 'down' ? 'up' : 'down');
  }
});


// users

const $users = $('.icon-button-field[command=users]');

$users.on('click', function () {
  const $condition = $('.condition-bar-field');
  let attr = $condition.attr('type');
  $condition.attr('type', attr === 'true' ? 'false' : 'true');
  $('.changing-field').attr('type', attr === 'true' ? 'false' : 'true');
});

// users end


// side bar

const $cog = $('.icon-button-field[command=cog]');
const $sidebar = $('.side-bar-cover');
$cog.on('click', function () {
  const $sidebar = $('.side-bar-cover');
  $sidebar.attr('type', 'true');
});

$('.full-screen-blocker').on('click', function () {
  $sidebar.attr('type', 'false');
});

// side bar end

// let sidebar = document.getElementById('.left-side-bar');

// window.onclick = function (event) {
//   if(event.target === sidebar) {
//     // sidebar.style.display = "none";
//     console.log('sdfsefses')
//     sidebar.attr('type', 'false');
//   }
// }
//
// document.on('click', function (event) {
//   if(event.target === sidebar) {
//     console.log('sdfsdf')
//   }
//
// })