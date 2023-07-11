import { simpleNoteFactory } from "./noteFactory.js";
import { repository } from "./repository.js";
import { homePage, notePage } from "./main.js";

////////////////////////
//// Event handlers ////
////////////////////////

export function saveNote (noteName) {
    let titleInput = document.getElementById("title");
    let contentInput = document.getElementById("content");
    // Checks title validity //
    if (titleInput.value) {
        let availableTitle = true;
        // Checks title availability (for new notes) //
        if (!noteName) {
            for (let note in repository) {
                if (note === titleInput.value) {
                    availableTitle = false;
                }
            };
        };
        // Saves note //
        if (availableTitle) {
            // IIFE: Save Note At repository //
            (function () {
                let noteTitle = titleInput.value;
                let noteContent = contentInput.value;
                // Store At repository //
                repository[noteTitle] = simpleNoteFactory.writeNote(noteTitle,noteContent);
                repository.storeAtRepo(repository);
                // Store at repo list just for new notes //
                if (!noteName) {
                    repository.storeAtList(noteTitle);
                }
            })();

            let creationDate = document.getElementById("creationcreationDate");
            let lastModified = document.getElementById("lastModified");
            let noteTitle = document.getElementById("title").value;
            creationDate.innerHTML = "Creation date: " + repository[noteTitle]["creationDate"];
            lastModified.innerHTML = "Last modified: " + repository[noteTitle]["lastModified"];

            if (!noteName) {
                notePage(noteTitle);
            }

            spanAlert(" Saved");
        }
        else {
            spanAlert(" This title has already been asigned to another noteBook","red");
        };
    }
    else {
        spanAlert(" Title required","red");
    };

    document.getElementById("title").addEventListener("input",function() {
        if (document.getElementById("spanAlert").innerText) spanAlert("");
    })
    document.getElementById("content").addEventListener("input",function() {
        if (document.getElementById("spanAlert").innerText) spanAlert("");
    })
};

export function deleteNote(noteName) {
    // Delete From repository //
    delete repository[noteName];
    repository.storeAtRepo(repository);
    repository.removeFromList(noteName);
    homePage();
};

export function search () {
    let noteListNode = document.getElementById("note_list_container");
    let value = document.getElementById("search").value;
    if (value) {
        let filteredList = [];
        let regex = new RegExp(value,"gi");
        for (let i = 0; i < repository["list"].length; i++) {
            if (repository["list"][i].match(regex)) {
                filteredList.push(repository["list"][i]);
            }
        };
        if (filteredList.length > 0) {
            repository.displayList(filteredList,noteListNode);
        }
        else {
            repository.displayList([],noteListNode,true);
        }
    }
    else {
        // Display full note list //
        repository.displayList(repository["list"],noteListNode);
    }
};

export function drag (e) {
    let node = e.target;
    let nodeHeight = node.offsetHeight;
    let initialY = e.clientY;
    let displacement;
    let initialOffSetTop = node.offsetTop;
    let parent = node.parentNode;
    let grandFather = parent.parentNode;
    let lastChildDept = grandFather.lastChild.offsetTop;

    node.onmousemove = function (event) {
        parent.style.height = nodeHeight + "px";
        displacement = event.clientY - initialY;
        let finalOffSetTop = node.offsetTop;
        if ((finalOffSetTop >= grandFather.children[0].offsetTop) && (finalOffSetTop <= lastChildDept)) {
            node.style.position = "absolute";
            node.style.top = initialOffSetTop + displacement + "px";
        }
        node.onmouseup = function () {
            node.onmousemove = null;
            node.onmouseleave = null;
            let jump = (displacement > 0)?Math.ceil(displacement/nodeHeight):Math.floor(displacement/nodeHeight);
            repository.moveListElement(node.innerHTML,jump);
            repository.displayList(repository["list"],grandFather);
        }

        node.onmouseleave = function () {
            node.onmousemove = null;
            node.onmouseup = null;
            repository.displayList(repository["list"],grandFather);
        }
}
};


export function preventCtrlZ (event,handler) {
    if (event.key == "Control") {
        event.preventDefault();
        window.onkeydown = function (e) {
            if (e.key == "z") {
                e.preventDefault();
                handler();
            }
        };
        window.onkeyup = function (e) {
            if (e.key == "Control") {
                // Restore default behavior for keydown event
                window.onkeydown = null
            }
        }
    }
};


export function searchNoteState (state) {
    let newState = state;
    document.getElementById("title").value = newState[0];
    document.getElementById("content").value = newState[1];
};

////////////////////////
////// Span Alert //////
////////////////////////

function spanAlert (message,color = "blue") {
    let spanAlert = document.getElementById("spanAlert");
    spanAlert.style.color = color;
    spanAlert.innerText = message;
};
