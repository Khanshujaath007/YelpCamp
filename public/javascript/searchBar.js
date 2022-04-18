

const searchBar = document.getElementById('searchBar');
// console.log(searchBar);
const CampObj = JSON.parse(Campgrounds);
// console.log(searchcamp.features);
const searchcamp = CampObj.features
console.log(searchcamp)
const list = document.getElementById('list');


function setList(filteredCamps) {
    clearList();
    for (const camp of filteredCamps) {
        const item = document.createElement('li');
        item.classList.add('list-group-item');

        let anchortag = document.createElement('a');
        let link = document.createTextNode(camp.title);
        anchortag.appendChild(link);
        anchortag.title = 'Check Details'
        anchortag.href = "/campgrounds/" + camp._id;
        document.body.appendChild(anchortag);
        item.appendChild(anchortag);
        list.appendChild(item);
    }
    if (filteredCamps.length === 0) {
        setNoResults();
    }

}

function clearList() {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

function setNoResults() {
    const item = document.createElement('li');
    item.classList.add('list-group-item');
    const text = document.createTextNode("No results found");
    item.appendChild(text);
    list.appendChild(item);
}

function getRelevency(searchString, searchTerm) {
    if (searchString === searchTerm) {
        return 2;
    }
    else if (searchString.startsWith(searchTerm)) {
        return 1;
    }
    else {
        return 0;
    }
}



searchBar.addEventListener('keyup', (e) => {
    let searchString = e.target.value.toLowerCase().trim();
    // console.log(searchString)
    if (searchString && searchString.trim().length > 0) {
        setList(searchcamp.filter((camp) => {
            return (
                camp.title.toLowerCase().includes(searchString) || camp.location.toLowerCase().includes(searchString)
            );
        }).sort((camp1, camp2) => {
            return getRelevency(camp2.title, searchString) - getRelevency(camp1.title, searchString)
        }));
    } else {
        clearList();
    }
});















