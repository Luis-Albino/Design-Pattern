    export var repositorium;
    
    //////////////////////////////
    //////// Repositorium ////////
    //////////////////////////////

    repositorium = (function () {

        const repoName = "notes_repositorium";
        // localStorage.clear();

        if (!localStorage.getItem(repoName)) {
            localStorage.setItem(repoName,JSON.stringify({}));
        };

        let repo = JSON.parse(localStorage.getItem(repoName));
        let proto = {};
        // Defining "storeAtRepo" Public Method
        proto.storeAtRepo = function (obj) {
            localStorage.setItem(repoName,JSON.stringify(obj));
        }

        Object.setPrototypeOf(repo,proto);

        return repo
        
    })();

    //////////////////////////////
    /// New Repo Functionality ///
    //////////////////////////////

    (function () {
        const repoListName = "list_repositorium";

        // Add Ordered List //
        repositorium["list"] = (function (repo) {
            let list;
            if (!localStorage.getItem(repoListName)) {
                list = [];
                for (let note in repo) {
                    if (repo.hasOwnProperty(note)) {
                        list.push(note);
                    }
                };
                localStorage.setItem(repoListName,JSON.stringify({"list":list}));
            }
            else {
                list = JSON.parse(localStorage.getItem(repoListName))["list"];
            };

            return list

        })(repositorium);

        // Copy Repo method //
        function copyRepo (repo) {
            let newRepo = {};
            for (let el in repo) {
                if (repo.hasOwnProperty(el)) {
                    newRepo[el] = repo[el]
                }
            }
            return newRepo
        };

        // Copy List array method //
        function copyList (list) {
            let newList = [];
            for (let i=0; i<list.length; i++) {
                newList.push(list[i])
            }
            return newList
        };

        // list Stack //
        let listStack = new Stack([copyRepo(repositorium),copyList(repositorium["list"])]);

        // repoStack methods //
        function appendToListStack (arr) {
            listStack.appendState(arr);
        };
        Object.getPrototypeOf(repositorium).searchRepoState = function (state) {
            let newStack = listStack[state];
            let newRepo = newStack[0];
            for (let el in newRepo) {
                if (!repositorium[el]) {
                    repositorium[el] = newRepo[el]
                }
            };
            for (let el in repositorium) {
                if (repositorium.hasOwnProperty(el) && !newRepo[el]) {
                    delete repositorium[el]
                }
            };
            repositorium["list"] = newStack[1];
            repositorium.storeAtRepo(repositorium);
            updateList();
            return listStack
        };

        // updateList() at closure //
        function updateList() {
            localStorage.setItem(repoListName,JSON.stringify({"list":repositorium["list"]}));
        };

        // Add functionality: storeAtList() //
        Object.getPrototypeOf(repositorium).storeAtList = function (noteName) {
            let newRepoList = copyList(repositorium["list"]);
            newRepoList.push(noteName);
            appendToListStack([copyRepo(repositorium),newRepoList]);
            repositorium["list"] = newRepoList;
            updateList();
        };

        Object.getPrototypeOf(repositorium).removeFromList = function (noteName) {
            let i = repositorium["list"].indexOf(noteName);
            let newRepoList = copyList(repositorium["list"]);
            newRepoList.splice(i,1);
            appendToListStack([copyRepo(repositorium),newRepoList]);
            repositorium["list"] = newRepoList;
            updateList();
        };

        Object.getPrototypeOf(repositorium).moveListElement = function (elementName,jumps) {
            let newRepoList;
            if (!!jumps) {
                newRepoList = copyList(repositorium["list"]);
                let i = newRepoList.indexOf(elementName);
                let j = i + jumps;
                j = (j < 0)?0:j;
                j = (j > newRepoList.length-1)?newRepoList.length-1:j;

                let increment = (i > j)?(-1):1;
                while (i != j) {
                    newRepoList[i] = newRepoList[i + increment];
                    i += increment;
                };
                newRepoList[j] = elementName;
            };
            appendToListStack([copyRepo(repositorium),newRepoList]);
            repositorium["list"] = newRepoList;
            updateList();
        };

        // Add functionality: displayList() //
        Object.getPrototypeOf(repositorium).displayList = function (list,node,noMatches = false) {
            // Delete current list //
            while (node.children[0]) {
                node.children[0].remove();
            };

            if (list.length > 0) {
                // Display new list //
                for (let note in list) {
                    let div = document.createElement("DIV");
                    div.className = "saved_note";
                    div.innerHTML = list[note];
                    // node.appendChild(div);
                    let div2 = document.createElement("DIV");
                    div2.appendChild(div)
                    node.appendChild(div2);        
                };
            }
            else {
                let div = document.createElement("DIV");
                div.className = "notification";
                div.innerHTML = noMatches?"No matches":"Empty repositorium";
                node.appendChild(div);
            };
        };

    })();