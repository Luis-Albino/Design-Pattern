import { repositorium } from "./repositorium.js";

///////////////////////////////
/// Simple Note Constructor ///
///////////////////////////////

function SimpleNote (myNoteName,myInfo) {
    let date = new Date();
    this["lastModified"] = 
        ((date.getMonth() < 10)?"0":"") + date.getMonth() + "/" 
        + date.getDate() + "/" 
        + date.getFullYear() + ", " 
        + ((date.getHours() < 10)?"0":"") + date.getHours() + ":" 
        + ((date.getMinutes() < 10)?"0":"") + date.getMinutes() + " hrs";
    if (!repositorium[myNoteName]) {
        // Assigns a creation date only to newly created notes
        this["creationDate"] = this["lastModified"];
    }
    else {
        // Uses the existing creation date
        this["creationDate"] = repositorium[myNoteName]["creationDate"];
    };
    this["info"] = myInfo;
};

///////////////////////////////
//////// Notes FACTORY ////////
///////////////////////////////

function NoteFactory () {};
NoteFactory.prototype.noteClass = SimpleNote;
NoteFactory.prototype.writeNote = function (noteName,noteContent) {
    return new this.noteClass(noteName,noteContent)
};

export var simpleNoteFactory = new NoteFactory();