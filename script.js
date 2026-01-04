const firebaseConfig = {
  apiKey: "AIzaSyBb9od4O8ShNfEVqOrFtgYGrZgzm8O29Gg",
  authDomain: "smart-campus-issue-repor-32d63.firebaseapp.com",
  projectId: "smart-campus-issue-repor-32d63",
  storageBucket: "smart-campus-issue-repor-32d63.firebasestorage.app",
  messagingSenderId: "658714128506",
  appId: "1:658714128506:web:a5dd767ca1dca34fbd4bc3"
};

window.onload = function () {

  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
  const db = firebase.firestore();

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const appDiv = document.getElementById("app");
  const submitBtn = document.getElementById("submitBtn");
  const issueList = document.getElementById("issueList");

  loginBtn.onclick = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithRedirect(provider);
  };

  logoutBtn.onclick = () => auth.signOut();

  auth.onAuthStateChanged((user) => {
    if (user) {
      alert("Login detected");
console.log("LOGIN USER:", user.email);

      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
      appDiv.style.display = "block";
      loadIssues();
    } else {
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
      appDiv.style.display = "none";
    }
  });

  submitBtn.onclick = () => {
    const title = issueTitle.value;
    const category = issueCategory.value;
    const desc = issueDesc.value;

    if (!title || !desc) {
      alert("Fill all fields");
      return;
    }

    db.collection("issues").add({
      title,
      category,
      description: desc,
      status: "Pending",
      time: new Date()
    });

    issueTitle.value = "";
    issueDesc.value = "";
  };

  function loadIssues() {
    db.collection("issues")
      .orderBy("time", "desc")
      .onSnapshot((snapshot) => {
        issueList.innerHTML = "";
        snapshot.forEach((doc) => {
          const li = document.createElement("li");
          li.innerText =
            doc.data().title + " (" + doc.data().category + ")";
          issueList.appendChild(li);
        });
      });
  }
};
