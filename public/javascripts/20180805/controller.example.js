const UIController = new function () {
  
  const $signIn = $('.nav-profile-field.flex.align-center[type="logout"]');
  const $signOut = $('.login-logout-cover.flex');
  
  const $login = $('.nav-profile-field.flex.align-center');
  
  const $progress = $('.progress');
  const $drop = $('.upload-condition-zone');
  const $cardPart = $('.card-part');
  const $search = $('#search');
  const $inputZone = $('#fileUploader');
  const $category = $('.category-card-outer');
  const $reset = $('.reset-button');
  const $leftBar = $('.left-side-bar');
  const $travellerPart = $('.travellers-part');
  
  
  let currentUser;
  
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
  $signOut.on('click', (e) => {
    e.stopPropagation();
    FirebaseApi.signOut();
  });
  
  
  $category.on('click', function () {
    const $this = $(this);
    const type = $this.find('.name').text().toLowerCase().trim();
    
    $category.attr('type', 'deselected');
    $(this).attr('type', '');
    
    
    const list = $cardPart.find('.card-cover-cell');
    
    console.log('type: ', type);
    
    for (let i = 0; i < list.length; i++) {
      
      // console.log($(list[i]).find(`.${type}`));
      if ($(list[i]).find('.type-icon').hasClass(`${type}`)) {
        $(list[i]).css('display', 'block');
      }
      else {
        $(list[i]).css('display', 'none');
      }
    }
    
    $('.side-bar-cover').attr('type', 'false');
    
  });
  
  $reset.on('click', function () {
    const list = $cardPart.find('.card-cover-cell');
    $(list).css('display', 'block');
    $category.attr('type', '');
    $('.side-bar-cover').attr('type', 'false');
  });
  
  
  $search.on('keyup', () => {
    
    const val = $search.val();
    const list = $cardPart.find('.card-cover-cell');
    
    for (let i = 0; i < list.length; i++) {
      
      if ($(list[i]).find('.text.bold').text().indexOf(val) < 0) {
        $(list[i]).css('display', 'none');
      }
      else {
        $(list[i]).css('display', 'block');
      }
    }
    
  });
  
  
  FirebaseApi.setOnAuthStateChanged(async (u) => {
    $travellerPart.empty();
    $cardPart.empty();
    
    if (!_.isNil(u)) {
      // $signIn.css('display', 'none');
      // $signOut.css('display', 'block');
      
      $login.attr('type', 'login');
      $('.name-nick').text(u.displayName);
      $('.e-mail').text(u.email);
      $('.profile-photo-grid').css('background-image', `url(${u.photoURL})`);
      setUsers(await FirebaseDB.getUsers());
      let files = await FirebaseApi.readFileData(u.uid);
      updateProfile(u, fileJSON(files));
      
      
    }
    else {
      // $signIn.css('display', 'block');
      // $signOut.css('display', 'none');
      
      $login.attr('type', 'logout');
      
      
    }
    
    console.log(u);
    
    // $('.name-nick').text(u.displayName);
    // $('.e-mail').text(u.email);
    // $('.profile-photo-grid').css('background-image', `url(${u.photoURL})`);
    // setUsers(await FirebaseDB.getUsers());
    // await FirebaseApi.readFileData();
    
    
  });
  
  function setUsers(users) {
    
    const template1 = `<div class="travellers-cell flex align-center">
    <div class="photo-div">
        <div class="travellers-photo"></div>
    </div>
    <div class="travellers-name-div flex-1"></div>
    <div class="online-div"></div>
</div>`;
    
    const template = `<div class="travellers-cell flex align-center">
    <div class="photo-div">
        <div class="travellers-photo"></div>
    </div>
    <div class="travellers-name-div flex-1"></div>
    <div class="radio-box flex align-center">
        <div class="circle"></div>
    </div>
</div>`;
    const $travellerRoot = $('.travellers-part');
    
    for (let i = 0; i < users.length; i++) {
      const $ele = $(template);
      $ele.find('.travellers-name-div').text(users[i].displayName);
      $ele.find('.travellers-photo').css('background', `url(${users[i].photoURL})`);
      $travellerRoot.append($ele);
      
      $ele.on('click', async function () {
        
        $cardPart.empty();
        const files = await FirebaseApi.readFileData(users[i].uid);
        console.log("click name" + users[i].displayName);
        console.log('click files, ', files);
        updateProfile(users[i], fileJSON(files));
        currentUser = users[i].uid;
        if(auth.currentUser.uid !== users[i].uid){
          $('.upload-button').addClass('display-none');
          $('.upload-field').addClass('display-none');
          $cardPart.removeClass('display-none');
        }
        else {
          $('.upload-button').removeClass('display-none');
        }
        $category.attr('type', '');
      })
      
      
    }
  }
  
  function fileJSON(files) {
    const data = {};
    
    console.log('json', files);
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      
      let category = file.type.split("/")[0];
      if (category === "") category = "etc";
      
      if (!data.hasOwnProperty(category)) {
        data[category] = {
          category: category,
          size: 0,
          number: 0
        }
      }
      data[category].size += file.size;
      data[category].number++;
    }
    console.log(data);
    
    return data;
  }
  
  function updateProfile(user, json) {
    console.log(user, json);
    
    const $eyes = $('.storage-description-part > .category > .text > i');
    
    $eyes.text('    0');
    
    const $storage_part = $('.storage-part');
    
    const $category_part = $('.category-card');
    
    $category_part.find('.count').text(' 0');
    $category_part.find('.capacity').text(' / 0');
    
    
    // count, capacity
    
    $leftBar.find('.left-name').text(user.displayName);
    $leftBar.find('.left-email').text(user.email);
    $leftBar.find('.left-photo').css('background-image', `url(${user.photoURL})`);
    console.log('for 전');
    let total = 0;
    for (let i = 0; i < Object.keys(json).length; i++) {
      let keys = Object.keys(json)[i];
      let size = json[keys].size;
      total += size;
      let number = json[keys].number;
      let category = json[keys].category;
      console.log(category);
      console.log($leftBar.find(`#category-${category}`));
      $leftBar.find(`#category-${category}`)
        .text(`    ${convertByteUnitToString(size)}`);
      
      let $categoryInfo = $(`.category-card > .text-group[type=${category}]`);
      
      $categoryInfo.find('.count').text(number);
      $categoryInfo.find('.capacity').text(`/ ${convertByteUnitToString(size)}`);
      
      let storageElement = $storage_part.find(`#storage-${category}`);
      storageElement.attr('style', getStoragePercentage(size, 1.0737e+10));

    }
    
    $('.used-storage-part').text(`${convertByteUnitToString(total)} / 10GB`)
  }
  
  function getStoragePercentage(byte, totalbyte){
    return Math.floor(byte / totalbyte).toFixed(2) * 100;
  }
  
  function convertByteUnitToString(size){
    
    if(size < Math.pow(2, 10)){
      return size + 'B';
    }
    else if(size < Math.pow(2, 20)){
      return (size / Math.pow(2, 10)).toFixed(2) + 'KB';
    
    }
    else if(size < Math.pow(2, 30)){
      return (size / Math.pow(2, 20)).toFixed(2) + 'MB';
    }
    else if(size < Math.pow(2, 40)){
      return (size / Math.pow(2, 30)).toFixed(2) + 'GB';
    }
    else if(size < Math.pow(2, 50)){
      return (size / Math.pow(2, 40)).toFixed(2) + 'TB';
    }
    else
      return (size / Math.pow(2, 50)).toFixed(2) + 'PB';
    
  }
  
  FirebaseApi.setOnProgressListener((o) => {
    
    const length = 200 / o;
    console.log('sss', length);
    $progress.css('width', length);
  });
  
  FirebaseApi.setOnReadListener((files) => {
    
    console.log('file', files.length);
    if (files.length > 0) {
      $('.upload-field').addClass('display-none');
      $('.card-part').removeClass('display-none');
    }
    else {
      $('.upload-field').removeClass('display-none');
      $('.card-part').addClass('display-none');
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
        <div class="sights-photo-div flex align-center">
            <div class="hover-dark-background"></div>
            <div class="type-icon"></div>
        </div>
        <div class="sights-content-div flex align-center">
            <div class="content flex-1">
                <div class="text bold"></div>
                <div class="text desc"></div>
            </div>
            <div class="download-icon">
              <i class="i fas fa-download"></i>
            </div>
        </div>
    </div>
</div>`;
    
    
    const $ele = $(template);
    $ele.find('.text.bold').text(file.name);
    $ele.find('.text.desc').text(convertByteUnitToString(file.size));
    $ele.attr('id', file.uploadDate);
    
    if (auth.currentUser.uid === file.uid) {
      const deleteButton = `<div class="i fas fa-trash-alt"></div>`;
      $ele.find('.sights-card-cell').append(deleteButton);
    }
    
    $ele.find('.download-icon').on('click', function () {
      FirebaseDB.downloadFile(file.name);
    });
    
    if (!_.isNil(file.type)) {
      const type = file.type.split('/')[0];
      
      switch (type) {
        case 'image':
          $ele.find('.type-icon').addClass('i fas fa-image image');
          $ele.find('.sights-photo-div').addClass('type-image-color');
          break;
        
        case 'audio':
          $ele.find('.type-icon').addClass('i fas fa-music audio');
          $ele.find('.sights-photo-div').addClass('type-sound-color');
          break;
        case 'application':
          $ele.find('.type-icon').addClass('i fas fa-code application');
          $ele.find('.sights-photo-div').addClass('type-code-color');
          break;
        case 'video':
          $ele.find('.type-icon').addClass('i fas fa-video video');
          $ele.find('.sights-photo-div').addClass('type-video-color');
          
          break;
        case 'text':
          $ele.find('.type-icon').addClass('i fas fa-font text');
          $ele.find('.sights-photo-div').addClass('type-text-color');
          
          break;
        default :
          $ele.find('.type-icon').addClass('i fas fa-file etc');
          $ele.find('.sights-photo-div').addClass('type-etc-color');
          break;
      }
    } else {
      $ele.find('.type-icon').addClass('i fas fa-file etc');
      $ele.find('.sights-photo-div').addClass('type-etc-color');
      
    }
    
    $cardPart.append($ele);
    
    $ele.on('click', '.fa-trash-alt', async function () {
      console.log('hi', file.uploadDate);
      FirebaseDB.deleteFile(file.uploadDate);
      FirebaseApi.deleteFileData(file.name);
      $ele.remove();
      FirebaseApi.setOnUpdateCardListener(null);
      const files = await FirebaseApi.readFileData(auth.currentUser.uid);
      updateProfile(auth.currentUser, fileJSON(files));
      
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
    console.log('over');
    e.stopPropagation();
    e.preventDefault();
  });
  
  $drop.on('drop', function (e) {
    if(!_.isNil(currentUser) && auth.currentUser.uid !== currentUser) return;
    e.preventDefault();
    const files = e.originalEvent.dataTransfer.files;
    FirebaseApi.uploadFileData(files);
  });
  
  
};