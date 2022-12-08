/// OBSERVATION: Both html files reference this Javascript file 

let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

console.log(window.location.pathname) /// '/notes"

/// QUESTOIN: Why make these conditional? Does it save memory? 
if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title'); /// verified
  noteText = document.querySelector('.note-textarea'); /// verified
  saveNoteBtn = document.querySelector('.save-note'); /// verified
  newNoteBtn = document.querySelector('.new-note'); /// verified
  noteList = document.querySelectorAll('.list-container .list-group'); 
  /// Finds all elements that have the class
  /// With two class elements, does it find the first then the second? In this instance, there's only one .list-group
}

// Show an element
/// These are used in the handleRenderSaveBtn function
/// QUESTION: How does this hide and show features?
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

/// Allows you to pull data from a different url source
const getNotes = () =>
  fetch('/api/notes', { 
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    /// Added. Not necessary
    // .then((response) => (response).json())
    // .then((data) => {
    //   console.log('data:', data)
    // })
    // .catch((error) => {
    //   console.error('Error:', error)
    // })

/// Save Note: Step 3
/// Reference: 11-Express > 08-Stu_GET-Fetch, 20-Stu_Data-Persistence
const saveNote = (note) =>
  fetch('/api/notes', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  })
    /// console.log(body) -- body is not defined. If uncommented, it pauses the code
    /// console.log(note.body) -- body is not defined. If uncommented, it pauses the code
    // .then((res) => res.json()) /// Is this necessary?
    // .then((data) => {
    //   console.log(data)
    //   emptyForm() 
    //   return data /// Is this necessary?
    // })
    
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);
  console.log('Hello from renderActiveNote function') /// verified
  console.log('activeNote', activeNote) /// verified -- When handleNewNoteView function is triggered, this console logs as an empty array

  /// Previously activeNote.id. Changed to activeNote and it functions properly
  console.log('empty string:', activeNote == "")
  console.log('empty string (not):', !activeNote == "")
  console.log('object length is 0:', Object.keys(activeNote).length === 0)
  console.log('object length is 0 (not w/o ()):', !Object.keys(activeNote).length === 0)
  console.log('object length is 0 (not w/ ()):', !(Object.keys(activeNote).length === 0))
  /// An object with value and an object without values, return the same reuslts for the console logs above. Need to find an argument that creates different results. 
  // if (!activeNote == "") {
  if (!(Object.keys(activeNote).length === 0)) {
    /// Change element features
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    /// Assigning values
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
    /// Where is this being called that it would choose this instead? 
    /// When handleNewNoteView function is triggered
  } else {
    // noteTitle.setAttribute('readonly', false); --- This did not work. Why?
    noteTitle.removeAttribute('readonly')
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
    /// Validated the removeattribute method works. Hard-coded readonly=true into the noteText.    
  }
};

/// Save Note: Step 2 & Step 4 (render notes)
const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes(); /// this works
    renderActiveNote();
  });
};

/// Attribute added when the card was rendered
// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

/// An event listener is added to each note when it's rendered
// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to an empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  /// Option 1
  activeNote = {} 
  /// Option 2
  /// activteNote = ""
  /// Changed this to an empty string from an empty object for condition in the renderActiveNote function
  renderActiveNote();
};

/// Save Note: Step 1 -- Shows the Save Button & Function Explanation
/// There are two event listeners (noteTitle and noteText keyup) that trigger this function
/// If either do not hold a value, the save button stays hidden. If both hold values, then the save button appears.
/// Clicking the save button calls the function handleNoteSave
/// hide() and show() are functions with the parameter saveNoteBtn passed in
const handleRenderSaveBtn = () => {
  /// console.log(noteTitle.value)
  /// console.log(noteText.value)
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
/// Above --- noteList = document.querySelectorAll('.list-container .list-group');
const renderNoteList = async (notes) => {
  console.log('Hello') /// verified in console
  let jsonNotes = await notes.json();
  console.log('jsonNotes:', jsonNotes) /// verified in console

  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = '')); /// Deletes the HTML content for all the elements in noteList (ref: https://www.w3schools.com/jsref/prop_html_innerhtml.asp)
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => { /// Where is the delete btn?
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);
    /// EventListener isn't in the DOM. It can be seen in the event listener tab in the console

    liEl.append(spanEl); /// Add spanEl to liEl

    if (delBtn) { /// Won't this also be true, since delBtn = true is defined above. Below defines delBtn as false when there are no notes
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl); /// Add delBtnEl to liEl
    }

    return liEl; /// return the entire liEl created
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
/// Two functions: (1) getNotes, (2) renderNoteList
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave); // saves the new note after save has been clicked
  newNoteBtn.addEventListener('click', handleNewNoteView); 
  noteTitle.addEventListener('keyup', handleRenderSaveBtn); // triggers the save button to appear
  noteText.addEventListener('keyup', handleRenderSaveBtn); // triggers the save button to appear
}

getAndRenderNotes();

/// handleNewNoteView is dependent on newNoteBtn. The initial field forms exist. Would it bypass the need to click on the new note button