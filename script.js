let currentPageIndex = 1;
let currentSearchTerm = '';
let currentPageSize = 10;
const saveButton = document.querySelector('#btnSave');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const notesContainer = document.querySelector('#notes__container');
const deleteButton = document.querySelector('#btnDelete');
const clearTheForm = document.querySelector('#btnClear');
const pageNumberDisplay = document.querySelector('#pageNumber');
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');
const prevPageButton = document.querySelector('#prevPage');
const nextPageButton = document.querySelector('#nextPage');
const pageSizeSelect = document.querySelector('#pageSizeSelect');


function clearForm() {
    titleInput.value = '';
    descriptionInput.value = '';
    deleteButton.classList.add('hidden');
    //deleteButton.removeAttribute('data-id');
    saveButton.removeAttribute('data-id');
}

function displayNoteInForm(note) {
    titleInput.value = note.title;
    descriptionInput.value = note.description;
    deleteButton.classList.remove('hidden');
    deleteButton.setAttribute('data-id',note.id);
    saveButton.setAttribute('data-id',note.id);
}

function getNoteById(id) {
    fetch(`https://localhost:7015/api/Notes/${id}`)
    .then(data => data.json())
    .then(response => displayNoteInForm(response));
}

function populateForm(id){
    getNoteById(id);

}

function addNote(title, description){

    const body = {
        title : title,
        description : description,
        isVisible : true
    };
    fetch('https://localhost:7015/api/Notes',{
        method : 'POST',
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    })
    .then(data => data.json())
    .then(response => {
        clearForm();
        getAllNotes();
    });

}

function displayNotes(notes) {

    let allNotes = ''; 

    console.log('Notes data:', notes);  // Log the data to see what is returned

    // notes.items.forEach(note => {
    notes.items.forEach(note => {

       const noteElement =  `
                    <div class="note" data-id="${note.id}">
                        <h3>${note.title}</h3>
                        <p>${note.description}</p>
                    </div>
                    `;
         allNotes+=noteElement;
        });
        notesContainer.innerHTML =  allNotes;

        document.querySelectorAll('.note').forEach(item => {item.addEventListener('click', function(){
            // catch each item with the event listner
                //alert();
                //alert(item.dataset.id);
                populateForm(item.dataset.id);

            });
        });
}

// getPaginationNotes(currentPage);

// Function to fetch notes with search and pagination
function getAllNotes() {
    const queryString = `?search=${encodeURIComponent(currentSearchTerm)}&pageIndex=${currentPageIndex}&pageSize=${currentPageSize}`;
    
    fetch(`https://localhost:7015/api/Notes${queryString}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching notes: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // console.log('Is data an object:', typeof data === 'object'); // Check if data is an object
             console.log('Items:', data.items.length);  // Check if items exist
            // console.log('Total Count:', data.totalCount);
            displayNotes(data);  // Pass data directly if it's already an array// Assuming data.notes contains the notes array
            console.log(data.countItem);
            handlePaginationButtons(data.countItem);  // Update pagination controls based on total count
        })
        .catch(error => {
            console.error('Error fetching the data:', error);
        });
}

// Function to update pagination buttons (e.g., disable previous on the first page)
function handlePaginationButtons(totalCount) {
    console.log("totalCOunt: ",totalCount);
    let totalPages = Math.ceil(totalCount / currentPageSize);
    console.log("curr page size: ",currentPageSize);


    console.log("totalPage",totalPages);
    // Disable previous button on the first page
    prevPageButton.disabled = currentPageIndex === 1;
    
    // Disable next button if there are no more pages
    nextPageButton.disabled = currentPageIndex >= totalPages;
}

// Event listener for the search button
searchButton.addEventListener('click', () => {
    currentSearchTerm = searchInput.value;  // Get the search term from the input
    currentPageIndex = 1;  // Reset to the first page when a new search is made
    getAllNotes();  // Fetch notes based on search term and reset page
});

// Event listener for the previous page button
prevPageButton.addEventListener('click', () => {
    if (currentPageIndex > 1) {
        currentPageIndex--;  // Decrement the page index
        getAllNotes();  // Fetch the previous page of notes
    }
});

// Event listener for the next page button
nextPageButton.addEventListener('click', () => {
    currentPageIndex++;  // Increment the page index
    getAllNotes();  // Fetch the next page of notes
});

// Event listener for the page size dropdown
pageSizeSelect.addEventListener('change', () => {
    currentPageSize = parseInt(pageSizeSelect.value);  // Get the new page size
    currentPageIndex = 1;  // Reset to the first page when the page size changes
    getAllNotes();  // Fetch notes based on the new page size
});

// Initial fetch of notes
getAllNotes();
function updateNote (id, title, description) {
    const body = {
        title : title,
        description : description,
        isVisible : true
    };
    fetch(`https://localhost:7015/api/Notes/${id}`,{
        method : 'PUT',
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    })
    .then(data => data.json())
    .then(response => {
        clearForm();
        getAllNotes();
    });
}


saveButton.addEventListener('click', function(){
    const id = saveButton.dataset.id;
    console.log(id);
    if(id)
    {
        updateNote(id,titleInput.value,descriptionInput.value);
    }
    else{
        //console.log('check');
        addNote(titleInput.value, descriptionInput.value);
    }
});

function deleteNote(id) {
    fetch(`https://localhost:7015/api/Notes/${id}`,{
        method : 'DELETE',
        headers: {
            "content-type": "application/json"
        }
    })
    .then(response => {
       //console.log(response);
       clearForm();
       getAllNotes();
    });

}

deleteButton.addEventListener('click', function(){
    
    const id = deleteButton.dataset.id;
    deleteNote(id);
});

clearTheForm.addEventListener('click', function(){
    clearForm();
});


 
// function searchNotes(query) {
//       fetch(`https://localhost:7015/api/Notes/search?query=${encodeURIComponent(query)}`)
//      .then (data => data.json())
//      .then (data => displayNotes(response))
//      .catch(error => console.error('Error',error));
// }

// function searchNotes(query) {
//     fetch(`https://localhost:7015/api/Notes/search?query=${encodeURIComponent(query)}`)
//         .then(response => {
//             // Check if the response is okay (status 200)
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             // Convert the raw response to JSON
//             return response.json();
//         })
//         .then(data => {
//             console.log("convert: ", data);
//             const convertToItems = {items: [...data]};
//             displayNotes(convertToItems);  // Pass the parsed data (notes) to displayNotes
//         })
//         .catch(error => {
//             console.error('Error:', error);  // Handle any errors
//         });
// }


// document.querySelector('#prevPage').addEventListener('click', function(){
//     if(currentPage>1)
//     {
//         currentPage--;    
//         getPaginationNotes(currentPage);
//     }

// });

// document.querySelector('#nextPage').addEventListener('click', function(){
//     currentPage++;
//     getPaginationNotes(currentPage);
// });

// function getPaginationNotes(pageNumber)
// {    console.log(`Fetching from: https://localhost:7015/api/Notes/GetPaginatedNotes?pageIndex=${pageNumber}&pageSize=${pageSize}`);

//             fetch(`https://localhost:7015/api/Notes/GetPaginatedNotes?pageIndex=${pageNumber}&pageSize=${pageSize}`)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`Error! Status: ${response.status} - ${response.statusText}`);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 displayNotes(data);
//             })
//             .catch(error => {
//                 console.error('Error fetching the data:', error);
//             });
        
// }

// function checkPageButtons(){
//     document.querySelector('#prevPage').disabled = (currentPage === 1);
// }

// document.querySelector('#nextPage').addEventListener('click', function(){
//     fetch(`https://localhost:7015/api/Notes/GetPaginationList?pageIndex=${currentPage+1}&pageSize=${pageSize}`)
//     .then (response => response.json())
//     .then (data => {
//         if(data.length() > 0){
//             currentPage++;
//             displayNotes(data)
//             pageNumberDisplay.textContent = currentPage;
//             checkPageButtons();
//         }
//         else
//         {
//             console.log('No more pages!');
//         }
//     })
    
// });

// getPaginationNotes(currentPage);

