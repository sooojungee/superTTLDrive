const UIController = new function () {
  
  const $signIn = $('#loginButton');
  const $signOut = $('#logoutButton');
  const $progress = $('.progress');
  const $drop = $('.upload-field');
  const $cardPart = $('.card-part');
  
  const $inputZone = $('#fileUploader');
  $inputZone.on('change', (e) => {
    console.log(e.target.files);
    FirebaseApi.uploadFileData(e.target.files);
  });
  
  $('.upload-button').on('click', () => {
    $inputZone.trigger('click');
  });
  
  
  $signIn.on('click', FirebaseApi.signIn);
  $signOut.on('click', FirebaseApi.signOut);
  
  FirebaseApi.setOnAuthStateChanged((u) => {
    if (!_.isNil(u)) {
      $signIn.css('display', 'none');
      $signOut.css('display', 'block');
    }
    else {
      $signIn.css('display', 'block');
      $signOut.css('display', 'none');
    }
    $('.name-nick').text(u.displayName);
    $('.e-mail').text(u.email);
    
    FirebaseApi.readFileData();
    
    
  });
  
  FirebaseApi.setOnProgressListener((o) => {
    
    const length = 200 / o;
    console.log('sss', length);
    $progress.css('width', length);
  });
  
  FirebaseApi.setOnReadListener((files) => {
    
    if (files.length > 0) {
      console.log('ss');
      $('.upload-field').addClass('display-none');
      $('.card-part').removeClass('display-none');
    }
    
    addCard(files);
  });
  
  FirebaseApi.setOnUpdateCardListener(addCard);
  
  function addCard(files) {
    console.log('hh', files);
    const template = `<div class="card-cover-cell">
    <div class="sights-card-cell">
        <div class="sights-photo-div">
            <div class="hover-dark-background"></div>
            <div class="i fas fa-music"></div>
        </div>
        <div class="sights-content-div flex align-center">
            <div class="content flex-1">
                <div class="text bold">FILE NAME HERE</div>
                <div class="text desc">SOUND / 30KB</div>
            </div>
            <div class="download-icon"><i class="fas fa-download"></i></div>
        </div>
        <div class="i material-icons delete">delete</div>
    </div>
</div>`;
    
    // const filecontent = [];
    if (!_.isNil(files.length)) {
      for (let i = 0; i < files.length; i++) {
        const $ele = $(template);
        $ele.find('.text.bold').text(files[i].name);
        $ele.find('.text.desc').text(files[i].size);
        console.log('gg');
        
        $cardPart.append($ele);
        // filecontent.push(new AppendFile(files[i]));
        // const template = `<div class = "file">${files[i].name}</div>`;
        // $view.append(template);
      }
    }
    else {
      const $ele = $(template);
      $ele.find('.text.bold').text(files.name);
      $ele.find('.text.desc').text(files.size);
      console.log('gg');
      
      $cardPart.append($ele);
    }
  }
  
  
  $drop.on('dragenter', function (e) {
    e.stopPropagation();
    e.preventDefault();
  });
  
  $drop.on('dragleave', function (e) {
    e.stopPropagation();
    e.preventDefault();
  });
  
  $drop.on('dragover', function (e) {
    e.stopPropagation();
    e.preventDefault();
  });
  
  $drop.on('drop', function (e) {
    e.preventDefault();
    const files = e.originalEvent.dataTransfer.files;
    FirebaseApi.uploadFileData(files);
    
  });
  
  
};