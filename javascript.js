const storeData = [];
const token = '  INPUT TOKEN GITHUP   ';
const url = 'https://api.github.com/search/repositories?q=';
const inputRepo = document.getElementById('repoInput');
const suggestionsDiv = document.getElementById('suggestions');
const repoListDiv = document.getElementById('repoList');


//រងចាំឈប់វាយបញ្ចូល
function debounce(fn,delay = 500){
    let timer;
    return (...arg)=>{
        if(timer) clearTimeout(timer);
        timer = setTimeout(()=>{fn(...arg)},delay);
    }
}

// past ការវាយបញ្ចូលទៅកាន fn ថ្មី
const fetchRepo = debounce( async (query)=>{
    //ផ្ទុយពីមាន
    if(!query){
        suggestionsDiv.innerHTML = ""
        return 
    }
    // ករណីស្វែងរក c program
    if(query.length< 3 && query.toLowerCase() !== 'c'){
        suggestionsDiv.innerHTML = ""
        return 
    }


    try {
        const seachQuery = query.toLowerCase() === 'c'? `language  ${query}`: query;

        // fetch API github
        const response = await fetch(url + seachQuery, {
            headers: { "Authorization": `token ${token}` }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        //ផ្ទាំងដែលបានស្វែងរក
        suggestionsDiv.innerHTML = "";
        data.items.slice(0, 5).forEach((d) => {
            let suggestion = document.createElement('div');
            suggestion.innerHTML = `<span>${d.name}</span>,<span> Owner: ${d.owner.login}</span>`;
        
            //បោះទិន្ន័យទៅឲ្យ fn addRepo តាមរយចុចលើផ្ទាំងស្វែងរកនីមួយៗ
            suggestion.addEventListener('click', () => {
                addRepo(d);
                inputRepo.value = ""; // សម្អាត input
                suggestionsDiv.innerHTML = ""; // សម្អាត suggestions
            });

            //កំណត់ទទេ suggestionsDiv
            (inputRepo.value === "")?suggestionsDiv.innerHTML = "":  suggestionsDiv.appendChild(suggestion);

        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }

})


// Autocomplete នៅពេលវាយ
inputRepo.addEventListener('input', async function() {
    const query = this.value;
    fetchRepo(query)

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
                    <div>Stars: ${data.stargazers_count}</div>
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
