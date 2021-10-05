// DOM pointers to the container for the posts,
//the css loader at the bottom of the page, and the input filter
const postsContainer = document.getElementById('posts-container');
const loading = document.querySelector('.loader');
const filter = document.getElementById('filter');

// limit is the amount of posts I am grabbing from the API everytime I call
// get posts. If you wanna get more posts per AJAX call just change limit var.
let limit = 5;

// page is the page number of the API call which contains a ceratin number of 
// dummy posts. I increment this after every show posts call to make sure
// I am not making an AJAX call to the same page every time i call get posts
let page = 1;

// fetch posts from API
async function getPosts() {
    // get data from fetch request
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`)

    // convert data into JSON 
    const data = await res.json();

    return data;
}

// Show posts in DOM
async function showPosts(){
    // async wait for AJAX call to get posts
    const posts = await getPosts();

    // for every post in our AJAX call we create a DOM element and insert
    // the post data to our created DOM element (DOM element = post)
    posts.forEach(post => {
        const postEl = document.createElement('div');
        postEl.classList.add('post');
        
        postEl.innerHTML = `
        <div class="number">${post.id}</div>
        <div class="post-info">
            <h2 class="post-title">${post.title}</h2>
            <p class="post-body">${post.body}</p>
        </div>`
        ;

        postsContainer.appendChild(postEl);
    })
}

// Show loader & fetch more posts
function showLoading() {
    loading.classList.add('show');

    // after .8 seconds remove the css loader and then show more posts
    setTimeout(() => {
        loading.classList.remove('show');
        
        // increments the page for the call to endpoint and calls show
        // posts to render 5 more posts after .3 seconds
        setTimeout(() => {
            page++;
            
            showPosts();
        }, 300);
    }, 800);
}

// Filter posts by input
function filterPosts(e) {
    // term is the typed in value of the input
    const term = e.target.value.toUpperCase();
    // all the posts currently in the DOM
    const posts = document.querySelectorAll('.post');

    // get the body and the title of every post on the page
    posts.forEach(post => {
        const title = post.querySelector('.post-title').innerText.toUpperCase();
        const body = post.querySelector('.post-body').innerText.toUpperCase();

        // if either the title or body text of any post matches the term
        // typed into the input those posts will stay and all other posts
        // get switched to display none to remove them from document flow
        if(title.indexOf(term) > -1 || body.indexOf(term) > -1){
            post.style.display = 'flex';
        } else {
            post.style.display = 'none';
        }
    });
}

// Show initial posts
showPosts();

// global listener for when user scrolls
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // code I got on stack overflow to measure how far a user has scrolled
    // from the top. When they are near the bottom of the page we call show loading
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        showLoading();
    }
});

// event listener to the filter input
filter.addEventListener('input', filterPosts);