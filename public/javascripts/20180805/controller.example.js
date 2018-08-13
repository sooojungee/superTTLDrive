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
    if (e.target.files.length > 0) {
      console.log('ss');
      $('.upload-field').addClass('display-none');
      $('.card-part').removeClass('display-none');
    }
  });
  
  $('.upload-button').on('click', () => {
    $inputZone.trigger('click');
  });
  
  
  $signIn.on('click', FirebaseApi.signIn);
  $signOut.on('click', FirebaseApi.signOut);
  
  FirebaseApi.setOnAuthStateChanged(async (u) => {
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
    $('.profile-photo-grid').css('background-image', `url(${u.photoURL})`);
    
    setUsers(await FirebaseDB.getUsers());
    FirebaseApi.readFileData();
    
    
  });
  
  function setUsers(users) {
    
    const template = `<div class="travellers-cell flex align-center">
    <div class="photo-div">
        <div class="travellers-photo"></div>
    </div>
    <div class="travellers-name-div flex-1"></div>
    <div class="online-div"></div>
</div>`;
    const $travellerRoot = $('.travellers-part');
    
    for (let i = 0; i < users.length; i++) {
      const $ele = $(template);
      $ele.find('.travellers-name-div').text(users[i].displayName);
      $ele.find('.travellers-photo').css('background', `url(${users[i].photoURL})`);
      $travellerRoot.append($ele);
    }
    
  }
  
  FirebaseApi.setOnProgressListener((o) => {
    
    const length = 200 / o;
    console.log('sss', length);
    $progress.css('width', length);
  });
  
  FirebaseApi.setOnReadListener((files) => {
    
    if (files.length > 0) {
      $('.upload-field').addClass('display-none');
      $('.card-part').removeClass('display-none');
    }
    
    addCards(files);
  });
  
  FirebaseApi.setOnUpdateCardListener(addCards);
  
  function addCards(files) {
    if (_.isNil(files.length)) {
      addCard(files);
    }
    else {
      for (let i = 0; i < files.length; i++) {
        addCard(files[i]);
      }
    }
    
  }
  
  function addCard(file) {
    
    
    const template = `<div class="card-cover-cell">
    <div class="sights-card-cell">
        <div class="sights-photo-div">
            <div class="hover-dark-background"></div>
            <div class="type-icon"></div>
        </div>
        <div class="sights-content-div flex align-center">
            <div class="content flex-1">
                <div class="text bold"></div>
                <div class="text desc"></div>
            </div>
            <div class="download-icon download-file"><i class="fas fa-download"></i></div>
        </div>
        
    </div>
</div>`;
    
    
    const $ele = $(template);
    $ele.find('.text.bold').text(file.name);
    $ele.find('.text.desc').text(file.size);
    $ele.attr('id', file.uploadDate);
    
    if(auth.currentUser.uid === file.uid){
      const deleteButton = `<div class="i material-icons delete">delete</div>`;
      $ele.find('.sights-card-cell').append(deleteButton);
    }
    
    $ele.find('.download-file').on('click', function () {
      FirebaseDB.downloadFile(file.name);
    });
    
    if (!_.isNil(file.type)) {
      const type = file.type.split('/')[0];
      
      switch (type) {
        case 'image':
          $ele.find('.type-icon').addClass('i fas fa-image');
          break;
        
        case 'audio':
          $ele.find('.type-icon').addClass('i fas fa-music');
          
          break;
        case 'application':
          $ele.find('.type-icon').addClass('i fas fa-code');
          
          break;
        case 'video':
          $ele.find('.type-icon').addClass('i fas fa-video');
          
          break;
        case 'text':
          $ele.find('.type-icon').addClass('i fas fa-font');
          
          break;
        default :
          $ele.find('.type-icon').addClass('i fas fa-file');
          break;
      }
    } else {
      $ele.find('.type-icon').addClass('i fas fa-file');
      
    }
    
    $cardPart.append($ele);
    
    $ele.on('click', '.delete',function(){
      console.log('hi', file.uploadDate);
      FirebaseDB.deleteFile(file.uploadDate);
      FirebaseApi.deleteFileData(file.name);
      $ele.remove();
    });
    
    
    // for (let i = 0; i < files.length; i++) {
    //   const file = files[i];
    //   const $ele = $(template);
    //   $ele.find('.text.bold').text(file.name);
    //   $ele.find('.text.desc').text(file.size);
    //   $ele.find('.download-file').on('click', function () {
    //     FirebaseDB.downloadFile(file.name);
    //   });
    //
    //   $ele.find('.delete').on('click', () => {
    //     // FirebaseApi.deleteFileData(file.name);
    //     FirebaseDB.deleteFile(file.name);
    //   });
    //
    //
    //   if (!_.isNil(file.type)) {
    //     const type = file.type.split('/')[0];
    //
    //     switch (type) {
    //       case 'image':
    //         $ele.find('.type-icon').addClass('i fas fa-image');
    //         break;
    //
    //       case 'audio':
    //         $ele.find('.type-icon').addClass('i fas fa-music');
    //
    //         break;
    //       case 'application':
    //         $ele.find('.type-icon').addClass('i fas fa-code');
    //
    //         break;
    //       case 'video':
    //         $ele.find('.type-icon').addClass('i fas fa-video');
    //
    //         break;
    //       case 'text':
    //         $ele.find('.type-icon').addClass('i fas fa-font');
    //
    //         break;
    //       default :
    //         $ele.find('.type-icon').addClass('i fas fa-file');
    //         break;
    //     }
    //   }
    //   else {
    //     $ele.find('.type-icon').addClass('i fas fa-file');
    //
    //   }
    //
    //   $cardPart.append($ele);
    // }
    //
    // const filecontent = [];
    // if (!_.isNil(files.length)) {
    //   for (let i = 0; i < files.length; i++) {
    //     const file = files[i];
    //     const $ele = $(template);
    //     $ele.find('.text.bold').text(file.name);
    //     $ele.find('.text.desc').text(file.size);
    //     $ele.find('.download-file').on('click', function () {
    //       FirebaseDB.downloadFile(file.name);
    //     });
    //
    //     $ele.find('.delete').on('click', () => {
    //       // FirebaseApi.deleteFileData(file.name);
    //       FirebaseDB.deleteFile(file.name);
    //     });
    //
    //
    //     if (!_.isNil(file.type)) {
    //       const type = file.type.split('/')[0];
    //
    //       switch (type) {
    //         case 'image':
    //           $ele.find('.type-icon').addClass('i fas fa-image');
    //           break;
    //
    //         case 'audio':
    //           $ele.find('.type-icon').addClass('i fas fa-music');
    //
    //           break;
    //         case 'application':
    //           $ele.find('.type-icon').addClass('i fas fa-code');
    //
    //           break;
    //         case 'video':
    //           $ele.find('.type-icon').addClass('i fas fa-video');
    //
    //           break;
    //         case 'text':
    //           $ele.find('.type-icon').addClass('i fas fa-font');
    //
    //           break;
    //         default :
    //           $ele.find('.type-icon').addClass('i fas fa-file');
    //           break;
    //       }
    //     }
    //     else {
    //       $ele.find('.type-icon').addClass('i fas fa-file');
    //
    //     }
    //
    //     $cardPart.append($ele);
    //   }
    // }
    // else {
    //   const $ele = $(template);
    //   $ele.find('.text.bold').text(files.name);
    //   $ele.find('.text.desc').text(files.size);
    //   $cardPart.append($ele);
    // }
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