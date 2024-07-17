const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const reposList = document.getElementById('reposList');

// Function to fetch GitHub users based on search input
async function searchUsers(username) {
    const response = await fetch(`https://api.github.com/search/users?q=${username}`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const data = await response.json();
    return data.items; // Return an array of users
}

// Function to fetch repositories of a specific GitHub user
async function getUserRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const data = await response.json();
    return data; // Return an array of repositories
}

// Event listener for form submission
searchForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        try {
            const users = await searchUsers(searchTerm);
            displayUsers(users);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    }
});

// Function to display search results (users)
function displayUsers(users) {
    searchResults.innerHTML = ''; // Clear previous results
    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');
        
        const avatar = `<img src="${user.avatar_url}" alt="${user.login}" class="avatar">`;
        const username = `<h2>${user.login}</h2>`;
        const profileLink = `<a href="${user.html_url}" target="_blank">Profile</a>`;
        
        userCard.innerHTML = avatar + username + profileLink;
        
        // Event listener to show repositories on user click
        userCard.addEventListener('click', async function() {
            try {
                const repos = await getUserRepos(user.login);
                displayRepos(repos);
            } catch (error) {
                console.error('Error fetching repositories:', error);
            }
        });
        
        searchResults.appendChild(userCard);
    });
}

// Function to display repositories
function displayRepos(repos) {
    reposList.innerHTML = ''; // Clear previous repositories
    
    repos.forEach(repo => {
        const repoItem = document.createElement('div');
        repoItem.classList.add('repo-item');
        
        const repoName = `<h3>${repo.name}</h3>`;
        const repoDescription = repo.description ? `<p>${repo.description}</p>` : '<p>No description.</p>';
        const repoLink = `<a href="${repo.html_url}" target="_blank">View Repo</a>`;
        
        repoItem.innerHTML = repoName + repoDescription + repoLink;
        
        reposList.appendChild(repoItem);
    });
}