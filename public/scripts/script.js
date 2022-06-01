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
const paginator = document.querySelector('#paginator');

////////////////////////////////////////////////////////////////////////////////
// Globals


////////////////////////////////////////////////////////////////////////////////
// Classes


////////////////////////////////////////////////////////////////////////////////
// Utils
function putInReq(method, txt) {
    reqBox.innerHTML = `${method}
${txt}`;
}
function putInRes(txt) {
    resBox.innerHTML = txt;
}

////////////////////////////////////////////////////////////////////////////////
// Functions
async function goHome() {
    pageTitle.innerHTML = 'Hello SocialMongo';
    showPosts();
}

async function getPosts(page=1) {
    try {
        const txt = '/posts/page/' + page;
        putInReq('GET', txt);
        const result = await axios('http://localhost:8080' + txt);
        putInRes(JSON.stringify(result.data, null, 2));
        return result.data;
    } catch (error) {
        console.log(error);
    }
}

async function showPosts(page=1) {
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
        inn += `    <div class="w-50">`;
        inn += `      <h4>${p.title}</h4>`;
        inn += `      <p>${p.body}</p>`;
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
        inn += `    </div>`;
        inn += `    <div class="w-25 text-end">`;
        inn += `      <img src="${p.author.avatar}" width="100">`;
        inn += `      <div>`;
        inn += `        ${p.author.username}`;
        inn += `      </div>`;
        inn += `    </div>`;
        inn += `  </div>`;
        inn += `</div>`;

    });
    content.innerHTML = inn;

    inn = '<ul class="pagination justify-content-center">';
    for (let i=1; i<=postsData.maxPages; i++) {
        inn += `<li class="page-item${i===postsData.page?' active':''}"><a class="page-link" href="#" onclick="showPosts(${i})">${i}</a></li>`;
    }
    inn += '</ul>';
    paginator.innerHTML = inn;
}

////////////////////////////////////////////////////////////////////////////////
// Listeners


////////////////////////////////////////////////////////////////////////////////
// Init
goHome();