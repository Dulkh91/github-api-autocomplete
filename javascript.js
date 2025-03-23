const storeData = [];
const token = '-token-';
const url = 'https://api.github.com/search/repositories?q=';
const inputRepo = document.getElementById('repoInput');
const suggestionsDiv = document.getElementById('suggestions');
const repoListDiv = document.getElementById('repoList');

// Autocomplete នៅពេលវាយ
inputRepo.addEventListener('input', async function() {
    const query = this.value;

    if (query.length <= 0) {
        suggestionsDiv.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(url + query, {
            headers: { "Authorization": `token ${token}` }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        suggestionsDiv.innerHTML = "";
        data.items.slice(0, 5).forEach((d) => {
            let suggestion = document.createElement('div');
            suggestion.textContent = `${d.name}, Owner: ${d.owner.login}`;
            suggestion.style.padding = "5px";
            suggestion.style.cursor = 'pointer';

            suggestion.addEventListener('click', () => {
                addRepo(d);
                inputRepo.value = ""; // សម្អាត input
                suggestionsDiv.innerHTML = ""; // សម្អាត suggestions
            });

            suggestionsDiv.appendChild(suggestion);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

// បន្ថែម repository ទៅ storeData
function addRepo(repo) {
    if (!storeData.some((s) => s.id === repo.id)) {
        storeData.push(repo);
       renderRepo();
    }
}

function renderRepo(){
    let doList = ""
    storeData.forEach((data,index)=>{
        doList += `<div class="list__text">
                <div>Name: ${data.name}</div>
                <div>
                    <div>Owner: ${data.owner.login}</div>
                    <div>Star: ${data.stargazers_count}</div>
                    <button onclick="deleteRepo(${index})">x</button>
                </div>
            </div>`
    })
    
    repoListDiv.innerHTML = doList
    
}

function deleteRepo(index){
   storeData.splice(index,1)
   renderRepo()
}
