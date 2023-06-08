import { simpleNoteFactory } from "./noteFactory.js";
import { repositorium } from "./repositorium.js";
import { homePage, notePage } from "./main.js";

////////////////////////
//// Event handlers ////
////////////////////////

export function saveNote (noteName) {
    let titleInput = document.getElementById("title");
    // Checks title validity //
    if (titleInput.value) {
        let availableTitle = true;
        // Checks title availability (for new notes) //
        if (!noteName) {
            for (let note in repositorium) {
                if (note === titleInput.value) {
                    availableTitle = false;
                }
            };
        };
        // Saves note //
        if (availableTitle) {
            // IIFE: Save Note At Repositorium //
            (function () {
                let noteTitle = document.getElementById("title").value;
                let noteContent = document.getElementById("content").value;
                // Store At Repositorium //
                repositorium[noteTitle] = simpleNoteFactory.writeNote(noteTitle,noteContent);
                repositorium.storeAtRepo(repositorium);
                // Store at repo list just for new notes //
                if (!noteName) {
                    repositorium.storeAtList(noteTitle);
                }
            })();

            spanAlert(" Saved","blue");

            let creationDate = document.getElementById("creationcreationDate");
            let lastModified = document.getElementById("lastModified");
            let noteTitle = document.getElementById("title").value;
            creationDate.innerHTML = "Creation date: " + repositorium[noteTitle]["creationDate"];
            lastModified.innerHTML = "Last modified: " + repositorium[noteTitle]["lastModified"];

            if (!noteName) {
                notePage(noteTitle);
            }

            spanAlert(" Saved","blue");
            setTimeout(function () {spanAlert("","blue")},2000);
        }
        else {
            spanAlert(" This title has already been asigned to another noteBook","red");
        };
    }
    else {
        spanAlert(" Title required","red");
    };
};

export function deleteNote(noteName) {
    // Delete From Repositorium //
    delete repositorium[noteName];
    repositorium.storeAtRepo(repositorium);
    repositorium.removeFromList(noteName);
    homePage();
};

export function search () {
    let noteListNode = document.getElementById("note_list_container");
    let value = document.getElementById("search").value;
    if (value) {
        let filteredList = [];
        let regex = new RegExp(value,"gi");
        for (let i = 0; i < repositorium["list"].length; i++) {
            if (repositorium["list"][i].match(regex)) {
                filteredList.push(repositorium["list"][i]);
            }
        };
        if (filteredList.length > 0) {
            repositorium.displayList(filteredList,noteListNode);
        }
        else {
            repositorium.displayList([],noteListNode,true);
        }
    }
    else {
        // Display full note list //
        repositorium.displayList(repositorium["list"],noteListNode);
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
            repositorium.moveListElement(node.innerHTML,jump);
            repositorium.displayList(repositorium["list"],grandFather);
        }

        node.onmouseleave = function () {
            node.onmousemove = null;
            node.onmouseup = null;
            repositorium.displayList(repositorium["list"],grandFather);
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

function spanAlert (message,color) {
    let spanAlert = document.getElementById("spanAlert");
    spanAlert.style.color = color;
    spanAlert.innerHTML = message;
};