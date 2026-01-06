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
  const issueTitle = document.getElementById("issueTitle");
  const issueCategory = document.getElementById("issueCategory");
  const issueDesc = document.getElementById("issueDesc");

  // Dark Mode Toggle (New Addition)
  const toggle = document.getElementById('theme-toggle');
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    toggle.innerHTML = document.body.classList.contains('dark') ? '<i class="fas fa-sun"></i> Light Mode' : '<i class="fas fa-moon"></i> Dark Mode';
  });

  loginBtn.onclick = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithRedirect(provider).catch((error) => {
      console.error("Login error:", error);
      alert("Login failed. Try again.");
    });
  };

  logoutBtn.onclick = () => auth.signOut().catch((error) => {
    console.error("Logout error:", error);
  });

  auth.onAuthStateChanged((user) => {
    if (user) {
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
    const title = issueTitle.value.trim();
    const category = issueCategory.value;
    const desc = issueDesc.value.trim();

    if (!title || !desc || !category) {
      alert("Please fill all fields!");
      return;
    }

    // Add loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    db.collection("issues").add({
      title,
      category,
      description: desc,
      status: "Pending",
      time: new Date(),
      user: auth.currentUser.email // Add user email for tracking
    }).then(() => {
      // Success feedback with animation
      const successMsg = document.createElement('p');
      successMsg.textContent = 'Issue Reported Successfully! 🎉';
      successMsg.style.color = 'green';
      successMsg.style.fontWeight = 'bold';
      successMsg.style.animation = 'fadeIn 0.5s';
      document.querySelector('.form-card').appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);

      // Reset form
      issueTitle.value = "";
      issueDesc.value = "";
      issueCategory.value = "";
    }).catch((error) => {
      console.error("Submit error:", error);
      alert("Failed to submit. Check connection.");
    }).finally(() => {
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Issue';
    });
  };

  function loadIssues() {
    db.collection("issues")
      .orderBy("time", "desc")
      .onSnapshot((snapshot) => {
        issueList.innerHTML = "";
        snapshot.forEach((doc) => {
          const li = document.createElement("li");
          li.innerText = doc.data().title + " (" + doc.data().category + ") - " + doc.data().status;
          li.style.animation = 'fadeIn 0.5s'; // Add fade-in animation
          issueList.appendChild(li);
        });
      }, (error) => {
        console.error("Load issues error:", error);
        alert("Failed to load issues.");
      });
  }
};