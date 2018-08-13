// const $inout = $('.in-out-button-part');
// $inout.on('click', function () {
//   console.log('apple');
//   console.log(this);
//   console.log($(this).parent());
//   this.parent().append('.type');
// })


//


$(document).on('click', 'i.fas.fa-chevron-left', function () {
  const $this = $(this);
  const $grid = $('.travellers-grid');
  const gridtype = $grid.attr('type');
  const lefttype = $this.attr('type');
  $this.attr('type', lefttype === 'in' ? 'out' : 'in');
  $grid.attr('type', gridtype === 'in' ? 'out' : 'in');
})


const $square = $('i.fas.fa-th-large');
$square.on('click', function () {
  console.warn('what?????')
  let $card = $('.card-part');
  $card.removeClass('list');
})

const $lines = $('i.fas.fa-th-list');
$lines.on('click', function () {
  console.warn('BAAAM')
  let $card = $('.card-part');
  $card.addClass('list');
  // $card.attr('type', 'lines');
})

const $this = this;
// console.log($($this))
// const $squares = $();


// console.log($this.attr('type'));



const template =
  `<div class="sights-menu-part flex align-center">
    <div class="subject-cell flex flex-1">
        <div class="subject">Newest</div>
        <div class="subject">Popular</div>
    </div><i class="fas fa-th-large" type="squares"></i><i class="fas fa-th-list" type="lines"></i></div>`

const $temp = $(template);

const type = $temp.attr('type');
// console.log(type);