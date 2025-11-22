/* --------------------------------------------
   BASIC UTILITIES
--------------------------------------------- */
const $ = (id) => document.getElementById(id);
const uid = () => Date.now().toString();

/* --------------------------------------------
   LOCAL STORAGE HELPERS
--------------------------------------------- */
function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function load(key, def) {
  return JSON.parse(localStorage.getItem(key)) || def;
}

/* --------------------------------------------
   STATE
--------------------------------------------- */
let loggedUser = localStorage.getItem("loggedUser");
let posts = load("posts", []);

/* --------------------------------------------
   RENDER APP
--------------------------------------------- */
function render() {
  if (!loggedUser) return renderLogin();
  return renderHome();
}

/* --------------------------------------------
   LOGIN PAGE
--------------------------------------------- */
function renderLogin() {
  $("app").innerHTML = `
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-3 text-center">Login</h2>

    <input id="email" class="w-full border p-2 mb-3" placeholder="Email">
    <input id="pass" type="password" class="w-full border p-2 mb-3" placeholder="Password">

    <button onclick="login()" class="w-full bg-blue-600 text-white p-2 rounded">Login</button>

    <p class="mt-4 text-sm text-center">
      No account?
      <button onclick="renderSignup()" class="text-blue-500">Sign up</button>
    </p>
  </div>`;
}

/* --------------------------------------------
   SIGNUP PAGE
--------------------------------------------- */
function renderSignup() {
  $("app").innerHTML = `
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-3 text-center">Sign Up</h2>

    <input id="regEmail" class="w-full border p-2 mb-3" placeholder="Email">
    <input id="regPass" type="password" class="w-full border p-2 mb-3" placeholder="Password">

    <button onclick="signup()" class="w-full bg-green-600 text-white p-2 rounded">Create Account</button>

    <p class="mt-4 text-sm text-center">
      Already registered?
      <button onclick="renderLogin()" class="text-blue-500">Login</button>
    </p>
  </div>`;
}

/* --------------------------------------------
   LOGIN & SIGNUP FUNCTIONS
--------------------------------------------- */
function login() {
  let email = $("email").value;
  let pass = $("pass").value;

  if (localStorage.getItem(email) === pass) {
    localStorage.setItem("loggedUser", email);
    loggedUser = email;
    render();
  } else {
    alert("Wrong email or password");
  }
}

function signup() {
  let email = $("regEmail").value;
  let pass = $("regPass").value;

  if (!email || !pass) return alert("All fields required!");

  localStorage.setItem(email, pass);
  alert("Account created!");
  renderLogin();
}

/* --------------------------------------------
   LOGOUT
--------------------------------------------- */
function logout() {
  localStorage.removeItem("loggedUser");
  loggedUser = null;
  render();
}

/* --------------------------------------------
   HOME PAGE
--------------------------------------------- */
function renderHome() {
  $("app").innerHTML = `
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-bold">Welcome ${loggedUser}</h2>
    <button onclick="logout()" class="text-red-500">Logout</button>
  </div>

  <!-- Create Post -->
  <div class="bg-white p-4 rounded shadow mb-4">
    <textarea id="postText" class="w-full border p-2" rows="3" placeholder="Write something..."></textarea>
    <input id="postImage" type="file" class="mt-2" accept="image/*">
    <button onclick="addPost()" class="w-full bg-blue-600 text-white p-2 rounded mt-2">Post</button>
  </div>

  <h3 class="font-bold mb-2">Posts</h3>
  <div id="posts"></div>
  `;

  renderPosts();
}

/* --------------------------------------------
   ADD POST
--------------------------------------------- */
function addPost() {
  let text = $("postText").value;
  let file = $("postImage").files[0];

  let imageData = "";

  if (file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      imageData = e.target.result;
      savePost(text, imageData);
    };
    reader.readAsDataURL(file);
  } else {
    savePost(text, "");
  }
}

function savePost(text, imageData) {
  posts.push({
    id: uid(),
    user: loggedUser,
    text,
    image: imageData,
    likes: 0,
    comments: [],
  });

  save("posts", posts);
  render();
}

/* --------------------------------------------
   RENDER POSTS
--------------------------------------------- */
function renderPosts() {
  let container = $("posts");
  container.innerHTML = "";

  posts.slice().reverse().forEach((p) => {
    container.innerHTML += `
    <div class="bg-white p-4 rounded shadow mb-4">
      <p class="mb-2">${p.text}</p>
      ${p.image ? `<img src="${p.image}" class="w-full mb-2 rounded">` : ""}
      
      <div class="flex gap-3 text-sm">
        <button onclick="likePost('${p.id}')" class="text-blue-600">❤️ ${p.likes}</button>

        ${p.user === loggedUser ?
         `<button class="text-green-600" onclick="editPost('${p.id}')">Edit</button>
          <button class="text-red-600" onclick="deletePost('${p.id}')">Delete</button>`
         : ""}
      </div>

      <!-- Comments -->
      <div class="mt-3">
        ${p.comments.map(c => `<p class="text-sm">💬 <b>${c.user}</b>: ${c.text}</p>`).join("")}
      </div>

      <input id="c-${p.id}" class="w-full border p-1 text-sm mt-2" placeholder="Comment...">
      <button onclick="addComment('${p.id}')" class="text-sm text-blue-600 mt-1">Send</button>
    </div>
    `;
  });
}

/* --------------------------------------------
   LIKE
--------------------------------------------- */
function likePost(id) {
  let post = posts.find(p => p.id === id);
  post.likes++;
  save("posts", posts);
  render();
}

/* --------------------------------------------
   DELETE
--------------------------------------------- */
function deletePost(id) {
  posts = posts.filter(p => p.id !== id);
  save("posts", posts);
  render();
}

/* --------------------------------------------
   EDIT
--------------------------------------------- */
function editPost(id) {
  let post = posts.find(p => p.id === id);
  let newText = prompt("Edit your post:", post.text);
  if (newText !== "") post.text = newText;
  save("posts", posts);
  render();
}

/* --------------------------------------------
   COMMENTS
--------------------------------------------- */
function addComment(id) {
  let txt = $(`c-${id}`).value;
  let post = posts.find(p => p.id === id);
  post.comments.push({ user: loggedUser, text: txt });
  save("posts", posts);
  render();
}

/* --------------------------------------------
   START APP
--------------------------------------------- */
render();