'use strict';
////////////////////////////////////////////////////////////////////////////////
// SocialMongo
// for The Bridge
// by  xavimat
// 2022-06-01
//
////////////////////////////////////////////////////////////////////////////////
// Constants


////////////////////////////////////////////////////////////////////////////////
// DOM
const content = document.querySelector('#content');
const pageTitle = document.querySelector('#page-title');
const reqBox = document.querySelector('#req');
const resBox = document.querySelector('#res');
const paginator1 = document.querySelector('#paginator1');
const paginator2 = document.querySelector('#paginator2');
const navbtnUser = document.querySelector('#navbtn-user');
const navBtnPosts = document.querySelector('#navbtn-posts');
const postsBox = document.querySelector('#posts-box');
const postBox = document.querySelector('#post-box');
const profileBox = document.querySelector('#profile-box');
const loginBox = document.querySelector('#login-box');
const submitLogin = document.querySelector('#submit-login');
const loginAlert = document.querySelector('#login-alert');

////////////////////////////////////////////////////////////////////////////////
// Globals
let jwt;
let user;

////////////////////////////////////////////////////////////////////////////////
// Classes


////////////////////////////////////////////////////////////////////////////////
// Utils
function putInReq(method, url, auth, body) {
    reqBox.innerHTML = `${method}
${url}
${auth ?? ''}
${body ? JSON.stringify(body, null, 2) : ''}`;
}
function putInRes(data) {
    resBox.innerHTML = JSON.stringify(data, null, 2);
}

////////////////////////////////////////////////////////////////////////////////
// Functions
async function goHome() {
    pageTitle.innerHTML = 'Hello SocialMongo';
    await showPosts();
}

async function getPosts(page = 1) {
    try {
        const txt = '/posts?page=' + page;
        putInReq('GET', txt);
        const result = await axios('http://localhost:8080' + txt);
        putInRes(result.data);
        return result.data;
    } catch (error) {
        console.log(error);
    }
}

async function showPosts(page = 1) {
    postBox.classList.add('d-none');
    profileBox.classList.add('d-none');
    loginBox.classList.add('d-none');
    postsBox.classList.remove('d-none');
    const postsData = await getPosts(page);
    let inn = '';

    inn = '';
    postsData.posts.forEach(p => {
        const date = new Date(p.updatedAt);
        inn += `<div class="card my-3">`;
        inn += `  <div class="d-flex">`;
        inn += `    <div class="w-25">`;
        inn += `      <img src="${p.image}" style="width:100%;">`;
        inn += `    </div>`;
        inn += `    <div class="w-50 d-flex flex-column justify-content-between p-2">`;
        inn += `     <div>`;
        inn += `      <div class="btn" onclick="goPost('${p._id}')"><h4>${p.title}</h4></div>`;
        inn += `      <p>${p.body}</p>`;
        inn += `     </div>`;
        inn += `     <div>`;
        inn += `      <div class="text-end">`;
        inn += `        <span>`;
        inn += `          ${date.toLocaleString('en-GB')}`;
        inn += `        </span>`;
        inn += `        <span class="badge rounded-pill bg-primary">`;
        inn += `          <i class="bi bi-chat-dots-fill"></i> `;
        inn += `          ${p.comments.length}`;
        inn += `        </span>`;
        inn += `        <span class="badge rounded-pill bg-success">`;
        inn += `          <i class="bi bi-hand-thumbs-up-fill"></i> `;
        inn += `          ${p.likes.length}`;
        inn += `        </span>`;
        inn += `      </div>`;
        inn += `     </div>`;
        inn += `    </div>`;
        inn += `    <div class="w-25 text-end">`;
        inn += `      <img class="btn" src="${p.author.avatar}" width="100" onclick="goUser('${p.author._id}')">`;
        inn += `      <div>`;
        inn += `        ${p.author.username}`;
        inn += `      </div>`;
        inn += `    </div>`;
        inn += `  </div>`;
        inn += `</div>`;

    });
    content.innerHTML = inn;

    inn = '<ul class="pagination justify-content-center">';
    for (let i = 1; i <= postsData.maxPages; i++) {
        inn += `<li class="page-item${i === postsData.page ? ' active' : ''}"><a class="page-link" href="#" onclick="showPosts(${i})">${i}</a></li>`;
    }
    inn += '</ul>';
    paginator1.innerHTML = inn;
    paginator2.innerHTML = inn;
}

function goUserData(ev) {
    if (ev) {
        ev.preventDefault();
    }
    showUserData(user);
}

async function goUser(userId) {
    try {
        const txt = '/users/id/' + userId;
        putInReq('GET', txt);
        const resp = await axios('http://localhost:8080' + txt);
        putInRes(resp.data);
        showUserData(resp.data.user);
    } catch (error) {
        console.log(error);
    }
}

function showUserData(who) {
    postsBox.classList.add('d-none');
    postBox.classList.add('d-none');
    loginBox.classList.add('d-none');
    profileBox.classList.remove('d-none');
    if (who) {
        pageTitle.innerHTML = 'Profile';
        let inn = '';
        inn += `<h2>${who.username}</h2>`;
        inn += `<img src="${who.avatar}" width="100">`;
        inn += '<ul>';
        inn += who.email ? `<li>Email: ${who.email}</li>` : '';
        inn += `<li>Role: ${who.role}</li>`;
        inn += `<li>Created at: ${new Date(who.createdAt).toLocaleString('en-GB')}</li>`;
        inn += `<li>Updated at: ${new Date(who.updatedAt).toLocaleString('en-GB')}</li>`;
        inn += '</ul>';

        inn += '<h4>My Posts</h4>';
        inn += '<ul>';
        who.posts.forEach((p) => {
            inn += `<li><span class="btn" onclick="goPost('${p._id}')">${p.title}</span></li>`;
        });
        inn += '</ul>';

        inn += '<h4>My Liked Posts</h4>';
        inn += '<ul>';
        who.likedPosts.forEach((p) => {
            inn += `<li><span class="btn" onclick="goPost('${p._id}')">${p.title}</span></li>`;
        });
        inn += '</ul>';

        inn += '<h4>Following</h4>';
        inn += '<ul>';
        who.following.forEach((u) => {
            inn += `<li><span class="btn" onclick="goUser('${p._id}')">${u.username}</span></li>`;
        });
        inn += '</ul>';

        inn += '<h4>Followers</h4>';
        inn += '<ul>';
        who.followers.forEach((u) => {
            inn += `<li><span class="btn" onclick="goUser('${p._id}')">${u.username}</span></li>`;
        });
        inn += '</ul>';

        profileBox.innerHTML = inn;
    } else {
        pageTitle.innerHTML = 'Login';
        profileBox.classList.add('d-none');
        loginBox.classList.remove('d-none');
    }
}

async function goLogin(ev) {
    try {
        ev.preventDefault();
        loginAlert.innerHTML = '';
        const pass = document.querySelector('#pass').value;
        const email = document.querySelector('#email').value;
        if (pass && email) {
            const config = {
                method: 'post',
                url: 'http://localhost:8080/users/login',
                data: {
                    email,
                    password: pass,
                },
            };
            putInReq('POST', '/users/login', null, config.data)
            const resp = await axios(config);
            putInRes(resp.data);
            if (resp.data.token) {
                jwt = resp.data.token;
                user = resp.data.user;
                navbtnUser.innerHTML = 'Profile';
                goUserData();
            } else {
                navbtnUser.innerHTML = 'Login';
                loginAlert.innerHTML = '<div class="alert alert-danger">Invalid credentials</div>';
            }
        }
    } catch (error) {
        console.log(error);
        navbtnUser.innerHTML = 'Login';
        loginAlert.innerHTML = '<div class="alert alert-danger">Invalid credentials</div>';
    }
}

function showPostsBox() {
    pageTitle.innerHTML = 'Posts';
    postBox.classList.add('d-none');
    loginBox.classList.add('d-none');
    profileBox.classList.add('d-none');
    postsBox.classList.remove('d-none');
}

async function goPost(postId) {
    try {
        const txt = '/posts/id/' + postId;
        putInReq('GET', txt);
        const result = await axios('http://localhost:8080' + txt);
        putInRes(result.data);
        showOnePost(result.data.post);
    } catch (error) {
        console.log(error);
    }
}

function showOnePost(post) {
    postsBox.classList.add('d-none');
    profileBox.classList.add('d-none');
    loginBox.classList.add('d-none');
    postBox.classList.remove('d-none');

    pageTitle.innerHTML = 'Post';

    let inn = '';

    inn += `<div class="d-flex">`;
    inn += `<h2>${post.title}</h2>`;
    inn += `<img src="${post.image}" width="200">`;
    inn += `</div>`;
    inn += '<ul>';
    inn += `<li>By: <span class="btn" onclick="goUser('${post.author._id}')"><img src="${post.author.avatar}" widht="100"> ${post.author.username}</span></li>`;
    inn += `<li>Created at: ${new Date(post.createdAt).toLocaleString('en-GB')}</li>`;
    inn += `<li>Updated at: ${new Date(post.updatedAt).toLocaleString('en-GB')}</li>`;
    inn += `<li>Likes: ${post.likes.length}</li>`;
    inn += '</ul>';
    inn += `<p>${post.body}</p>`;
    inn += '<h4>Comments</h4>';
    post.comments.forEach((c) => {
        inn += '<div class="card p-3 mb-2">';
        inn += '  <div class="d-flex">'
        inn += '    <div class="w-25">'
        inn += `      <span class="btn" onclick="goUser('${c.author._id}')">`;
        inn += `        <img src="${c.author.avatar}" widht="100">`;
        inn += `        <br>`;
        inn += `        ${c.author.username}`;
        inn += `      </span>`;
        inn += '    </div>';
        inn += '    <div>';
        inn += `      ${c.text}`;
        inn += '    </div>';
        inn += '  </div>';
        inn += '</div>';
    });

    postBox.innerHTML = inn;

}
////////////////////////////////////////////////////////////////////////////////
// Listeners
navbtnUser.addEventListener("click", goUserData);
navBtnPosts.addEventListener("click", showPostsBox);
submitLogin.addEventListener("click", goLogin);

////////////////////////////////////////////////////////////////////////////////
// Init
goHome();