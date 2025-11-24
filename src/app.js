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
  <div class="bg-gray-950 p-6 rounded-2xl shadow border-[crimson] border-2 flex flex-col justify-center items-center">
    <h2 class="text-2xl font-bold mb-3 text-center text-white">Login</h2>

    <input id="email" class="w-4/5 border p-2 mb-3 bg-[#0f172a] text-gray-300/50 rounded-lg" placeholder="Email">
    <input id="pass" type="password" class="w-4/5 border p-2 mb-3 bg-[#0f172a] text-gray-300/50 rounded-lg" placeholder="Password">

    <button onclick="login()" class="w-4/5 bg-[crimson] text-white p-2 rounded-lg">Login</button>

    <p class="mt-4 text-sm text-center text-white">
      No account?
      <button onclick="renderSignup()" class="text-[crimson]">Sign up</button>
    </p>
  </div>`;
}

/* --------------------------------------------
   SIGNUP PAGE
--------------------------------------------- */
function renderSignup() {
  $("app").innerHTML = `
  <div class="bg-gray-950 p-6 rounded-2xl shadow border-[crimson] border-2 flex flex-col justify-center items-center">
    <h2 class="text-2xl font-bold mb-3 text-center text-white">Sign Up</h2>
    
    <input id="regEmail" type="email" class="w-4/5 border p-2 mb-3 bg-[#0f172a] text-gray-300/50 rounded-lg focus:outline-none focus:border-[crimson]" placeholder="Email">
    <input id="regPass" type="password" class="w-4/5 border p-2 mb-3 bg-[#0f172a] text-gray-300/50 rounded-lg focus:outline-none focus:border-[crimson]" placeholder="Password">

    <button onclick="signup()" class="w-4/5 bg-[crimson] text-white p-2 rounded-lg">Create Account</button>

    <p class="mt-4 text-sm text-center text-white">
      Already registered?
      <button onclick="renderLogin()" class="text-[crimson] ">Login</button>
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

  localStorage.setItem("user",[email, pass]);
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
  <div class="flex justify-between items-center mb-4 ">
    <h2 class="text-2xl font-bold text-white">Welcome ${loggedUser}</h2>
    <button onclick="logout()" class="text-white bg-[crimson] px-4 py-2 rounded-lg">Logout</button>
  </div>

  <!-- Create Post -->
  <div class="bg-gray-950 p-4 rounded-2xl shadow-white shadow-2xl mb-4 flex flex-col justify-center items-center">
    <textarea id="postText" class="w-4/5 bg-[#0f172a] border-[crimson] border-2 rounded-lg p-2" rows="3" placeholder="Write something..."></textarea>
    <input id="postImage" type="file" class="mt-2 text-[crimson]" accept="image/*">
    <button onclick="addPost()" class="w-4/5 bg-[crimson] text-white p-2 rounded-lg">Post</button>
  </div>

  <h3 class="font-bold mb-2 text-white text-2xl">Posts</h3>
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
    <div class="bg-gray-950 p-4 rounded-2xl shadow-white shadow-2xl mb-4 flex flex-col justify-center items-center border-[crimson] border-2">
      <p class="mb-2 text-white">${p.text}</p>
      ${p.image ? `<img src="${p.image}" class="w-full mb-2 rounded">` : ""}
      
      <div class="flex gap-3 text-sm">
        <button onclick="likePost('${p.id}')" class="text-[crimson]">❤️ ${p.likes}</button>

        ${p.user === loggedUser ?
         `<button class="text-green-600" onclick="editPost('${p.id}')">Edit</button>
          <button class="text-red-600" onclick="deletePost('${p.id}')">Delete</button>`
         : ""}
      </div>

      <!-- Comments -->
      <div class="mt-3">
        ${p.comments.map(c => `<p class="text-sm ">💬 <b>${c.user}</b>: ${c.text}</p>`).join("")}
      </div>

      <input id="c-${p.id}" class="w-full rounded-md p-1 text-sm mt-2 border-[crimson]/50 border-2 bg-[#0f172a]" placeholder="Comment...">
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