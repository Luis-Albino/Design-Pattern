import { repositorium } from "./repositorium.js";
import { saveNote, deleteNote, search, drag, preventCtrlZ,searchNoteState } from "./eventHandlers.js";

//////////////////////////////
// Utility: remove template //
//////////////////////////////

function renderTemplate (templateID) {
    // Remove current template //
    while (document.body.children[2]) {
        document.body.children[2].remove();
    };

    // Render new template //
    let newTemplate = document.getElementById(templateID);
    document.body.appendChild(newTemplate.content.cloneNode(true));
};


//////////////////////////////
///////// Home Page //////////
//////////////////////////////

export function homePage () {
    renderTemplate("homePageTemplate");

    // Display note list //
    let noteListNode = document.getElementById("note_list_container");
    repositorium.displayList(repositorium["list"],noteListNode);
    noteListNode.addEventListener("dblclick",function (event) {
        let target = event.target;
        if (target.className === "saved_note") {
            notePage(target.innerHTML)
        }
    });
    noteListNode.addEventListener("mousedown",function (event) { drag(event) });

    /* Button Events */
    document.getElementById("new_note").addEventListener("click",function () { notePage() });

    /* undo/redo */
    document.getElementById("undo").addEventListener("click",function () {
        repositorium.searchRepoState("previousState");
        repositorium.displayList(repositorium["list"],noteListNode);
    });
    document.getElementById("redo").addEventListener("click",function () {
        repositorium.searchRepoState("nextState");
        repositorium.displayList(repositorium["list"],noteListNode);
    });

    /* search input event */
    let searchNode =  document.getElementById("search");
    searchNode.addEventListener("input",function () { search() });

    /* prevent default behavior for ctrl+z */
    window.addEventListener("keydown",function (event) {
        preventCtrlZ(event,function () {
            if (searchNode.value) {
                searchNode.value = null;
                search();
            }
            else {
                repositorium.searchRepoState("previousState");
                repositorium.displayList(repositorium["list"],noteListNode);
            }
        });
    });
};

// Initialize Home Page //
homePage();


//////////////////////////////
////////// Note Page /////////
//////////////////////////////

export function notePage (noteName) {
    renderTemplate("notePageTemplate");

    // Fill note information //
    if (repositorium[noteName]) {
        document.getElementById("title").value = noteName;
        document.getElementById("content").value = repositorium[noteName]["info"];
        document.getElementById("creationcreationDate").innerHTML = !!repositorium[noteName]?"Creation date: " + repositorium[noteName]["creationDate"]:"";
        document.getElementById("lastModified").innerHTML = (!!repositorium[noteName])?"Last modified: " + repositorium[noteName]["lastModified"]:"";
    };

    /* Button Events */
    document.getElementById("go_back").addEventListener("click",function () { homePage() });
    document.getElementById("save").addEventListener("click",function () { saveNote(noteName) });
    document.getElementById("delete").addEventListener("click",function () { deleteNote(noteName) });

    /* undo/redo */
    let noteState = [];
    noteState[0] = document.getElementById("title").value;
    noteState[1] = document.getElementById("content").value;
    let noteStack = new Stack([noteState[0],noteState[1]]);
    document.getElementById("title").addEventListener("input",function () {
        noteState[0] = document.getElementById("title").value;
        noteStack.appendState([noteState[0],noteState[1]]);
    });
    document.getElementById("content").addEventListener("input",function () {
        noteState[1] = document.getElementById("content").value;
        noteStack.appendState([noteState[0],noteState[1]]);
    });
    document.getElementById("undoNote").addEventListener("click",function () {
        searchNoteState(noteStack.previousState);
    });
    document.getElementById("redoNote").addEventListener("click",function () {
        searchNoteState(noteStack.nextState);
    });

    /* prevent default behavior for ctrl+z */
    window.addEventListener("keydown",function (event) {
        preventCtrlZ(event,function () { noteStack.previousState });
        // Update info //
        document.getElementById("title").value = noteStack.currentState[0];
        document.getElementById("content").value = noteStack.currentState[1];
    });

    /* prevent default behavior for Tab key */
    function changeDefaultTAB (inputTagID) {
        let inputTag = document.getElementById(inputTagID);
        inputTag.addEventListener("keydown",function (event) {
            if (event.key == "Tab") { 
                event.preventDefault();
                document.getElementById("title").value = inputTag.value;
                inputTag.value = inputTag.value + "        ";
            }
        })
    };

    changeDefaultTAB("title");
    changeDefaultTAB("content");
    document.getElementById("title").value =  "NOM"

};
