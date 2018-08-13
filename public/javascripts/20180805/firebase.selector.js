const config = {
  apiKey: "AIzaSyBNs90adQZLJ6ehQWpts4hstuic5a5DtFE",
  authDomain: "drivesystem-c205d.firebaseapp.com",
  databaseURL: "https://drivesystem-c205d.firebaseio.com",
  projectId: "drivesystem-c205d",
  storageBucket: "drivesystem-c205d.appspot.com",
  messagingSenderId: "1095354217297"
};

firebase.initializeApp(config);


const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const store = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref();


const settings = {timestampsInSnapshots: true};
store.settings(settings);


const FirebaseDB = {
  
  createUser: async (user) => {
    const data = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date().getTime(),
      signAt: new Date().getTime(),
    };
    return await store.collection('users').doc(user.uid).set(data);
  },
  
  
  signUser: async (user) => {
    const data = {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      signAt: new Date().getTime(),
      
    };
    
    return await store.collection("users").doc(user.uid).update(data);
    
  },
  
  readUser: async (uid) => {
    const refUser = store.collection("users").doc(uid);
    
    const doc = await refUser.get();
    if (doc.exists) return doc.data();
    else return null;
  },
  
  getUsers: async () => {
    
    const userList = [];
    
    await store.collection("users").get().then(function (querySnapshot) {
      
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        userList.push(doc.data());
      });
      
    });
    
    return userList;
    
  },
  
  
  // 한 개짜리
  uploadFile: async (uid, file) => {
    const fileId = new Date().getTime().toString();
    
    const data = {
      uid: uid,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModifiedDate: file.lastModifiedDate,
      uploadDate: fileId
      
    };
    
    return await store.collection("files").doc(fileId).set(data);
    
  },
  
  readFile: async (id) => {
    
    const files = [];
    // return await store.collection("files").where("uid", "==", id).get()
    await store.collection("files").where("uid", "==", id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          files.push(doc.data());
          // console.log(doc.id, " => ", doc.data());
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
    
    return files;
  },
  
  downloadFile: async (filename) => {
    // await storageRef.child(filename).getDownloadURL();
    
    // await storageRef.child(filename).getDownloadURL().then(function (url) {
    //   // `url` is the download URL for 'images/stars.jpg'
    //
    //   // This can be downloaded directly:
    //   var xhr = new XMLHttpRequest();
    //   xhr.responseType = 'blob';
    //   xhr.onload = function (event) {
    //     var blob = xhr.response;
    //   };
    //   console.log(url);
    //
    //   xhr.open('GET', url);
    //   xhr.send();
    //   // Or inserted into an <img> element:
    //   var img = document.getElementById('myimg');
    //   img.src = url;
    // }).catch(function (error) {
    //   console.log(error);
    // });
    const url = await storageRef.child(filename).getDownloadURL();
    window.open(url);
  },
  
  deleteFile: async (key) => {
    
    store.collection("files").doc(key).delete().then(function () {
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
    
    //
    
  }
  
};

const FirebaseApi = new function () {
  
  let listener = null;
  let progressListener = null;
  let readListener = null;
  let updateCardListener = null;
  
  function setOnUpdateCardListener(callback) {
    updateCardListener = callback;
  }
  
  function setOnReadListener(callback) {
    readListener = callback;
  }
  
  function setOnProgressListener(callback) {
    progressListener = callback;
  }
  
  function setOnAuthStateChanged(callback) {
    listener = callback;
  }
  
  auth.onAuthStateChanged(async (user) => {
    
    if (_.isNil(user)) {
      if (!_.isNil(listener)) listener(null);
      return;
    }
    
    let u = await FirebaseDB.readUser(user.uid);
    if (_.isNil(u)) {
      await FirebaseDB.createUser(user);
      u = await FirebaseDB.readUser(user.uid);
    }
    else {
      await FirebaseDB.signUser(user);
      u = await FirebaseDB.readUser(user.uid);
    }
    
    if (!_.isNil(listener)) listener(u);
    
  });
  
  async function uploadFileData(files) {
    
    const user = auth.currentUser;
    for (let i = 0; i < files.length; i++) {
      
      const ref = storageRef.child(files[i].name).put(files[i]);
      
      // const ref = storageRef.child(files[i].name).put(files[i], metadata);
      
      
      await ref.on('state_changed', function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, function (error) {
        console.log(error);
      }, await function () {
        ref.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log('File available at', downloadURL);
          progressListener(files.length - i);
        });
        
      });
      
      await FirebaseDB.uploadFile(user.uid, files[i]);
      updateCardListener(files[i]);
    }
    
    
  }
  
  function deleteFileData(filename) {
    const desertRef = storageRef.child(filename);
    
    desertRef.delete().then(function () {
    
    }).catch(function (error) {
    
    });
  }
  
  
  async function readFileData() {
    
    const user = auth.currentUser;
    const files = await FirebaseDB.readFile(user.uid);
    console.log(files);
    readListener(files);
    
  }
  
  return {
    signIn: async () => await auth.signInWithPopup(provider),
    signOut: async () => await auth.signOut(),
    setOnAuthStateChanged,
    setOnProgressListener,
    uploadFileData,
    readFileData,
    setOnReadListener,
    setOnUpdateCardListener,
    deleteFileData
  };
  
  
};