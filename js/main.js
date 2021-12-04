//

let currentColor = null;
let currentDate;

(function () {
    loadColor()
    showDialogNote()
    converterToMarkDown()
})();

function loadColor() {
    const divColors = document.getElementById('colors');
    let fragment = document.createDocumentFragment();
    //Render
    let colors = generateColor(10)
    colors.forEach(element => {
        var div = document.createElement("span");
        div.className = "dot";
        div.setAttribute('style', 'background-color:' + element);
        div.setAttribute('color', element);
        fragment.appendChild(div);
    });
    divColors.appendChild(fragment);

    let elmentsColors = document.querySelectorAll('.dot');
    for (let index = 0; index < elmentsColors.length; index++) {
        elmentsColors[index].addEventListener('click', e => {
            removeAttribute(elmentsColors)
            currentColor = elmentsColors[index].getAttribute('color');
            elmentsColors[index].setAttribute('style', 'border: 3px solid gold; background-color: ' + currentColor);
            elmentsColors[index].setAttribute("border", true);
            console.log(currentColor)
        });
    }
}

function removeAttribute(elements) {
    for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        if (element.getAttribute('border')) {
            var color = element.getAttribute('color');
            element.removeAttribute("style")
            element.setAttribute('style', 'background-color: ' + color);
        }
    }
}

function generateColor(size) {
    var simbolos, color;
    simbolos = "0123456789ABCDEF";
    color = "#";
    arr = []

    for (var j = 0; j < size; j++) {
        for (var i = 0; i < 6; i++) {
            color = color + simbolos[Math.floor(Math.random() * 16)];
        }
        arr.push(color)
        color = "#"
    }
    return arr;

}

function showDialogNote() {

    const openEls = document.querySelectorAll("[data-open]");
    const closeEls = document.querySelectorAll("[data-close]");
    const markupArea = document.getElementById('markup');
    const isVisible = "is-visible";

    for (const el of openEls) {
        el.addEventListener("click", function () {
            if (currentColor === null) {
                alert("Por favor seleccione un color")
                return
            }
            markupArea.value = ""
            showDate()
            const modalId = this.dataset.open;
            document.getElementById(modalId).classList.add(isVisible);
        });
    }

    for (const el of closeEls) {
        el.addEventListener("click", function () {
            this.parentElement.parentElement.parentElement.classList.remove(isVisible);
        });
    }

    document.addEventListener("click", e => {
        if (e.target == document.querySelector(".modal.is-visible")) {
            document.querySelector(".modal.is-visible").classList.remove(isVisible);
        }
    });

    document.addEventListener("keyup", e => {
        // if we press the ESC
        if (e.key == "Escape" && document.querySelector(".modal.is-visible")) {
            document.querySelector(".modal.is-visible").classList.remove(isVisible);
        }
    });

}

function showDate() {
    var date = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    currentDate = date.toLocaleDateString('es-ES', options) + " " + time
    document.getElementById('date').innerHTML = currentDate
}

function loadMarkDownInput(markdownData) {
    // Provide variables for the main interface
    const contentHere = document.getElementById('contentMarkDown');
    console.log(markdownData)
    //let clean = DOMPurify.sanitize(markdownData);
    const newText = marked.parse(markdownData);
    console.log(newText)
    return newText

    //const newText = marked(markdownData);
    //contentHere.innerHTML = newText;
}

function converterToMarkDown() {
    const isVisible = "is-visible";
    let btnNoteApp = document.getElementById("addNote");
    btnNoteApp.addEventListener("click", e => {
        if (e.target !== document.querySelector(".modal.is-visible")) {
            let markupArea = document.getElementById('markup');
            let data = markupArea.value
            /*var converter = marked(data)
            markupArea.innerHTML = converter*/
            document.querySelector(".modal").classList.remove(isVisible);
            addCard(data)

        }
    })
}

function addCard(obj) {
    const divColors = document.getElementById('listCard').innerHTML +=
        `
    <div class="card" id='card' style="background-color: ${currentColor} ">
        <span class="card_actions">
            <a href="#" id="edit" class="btnEdit"><img class="edit" src="./img/edit.svg"></img></a>
            <a href="#" id="delete" class="btnDelete"><img class="delete" src="./img/delete.svg"></img></a>
        </span>
        <div class="contentMarkDown" id="contentMarkDown">
        ${loadMarkDownInput(obj)}
        </div>
        <p class="pFotter">${currentDate}</p>
    </div>
    `
    //loadMarkDownInput(obj)
    //deleteNote()
}

/* queda pendiente indicar en que momento se llamara a la funcion ya que el evento de click para el delete solo funciona para el primero*/
function action(e) {
    //var btnDelete = document.getElementsByClassName("btnDelete");
    let btnDelete = document.getElementById("delete");
    

    /*var cards = [];
    console.info(btnDelete)
    for (var i = 0; i < btnDelete.length; i++) {
        btnDelete.addEventListener("click", e => {
            if (confirm('Esta seguro de eliminar la nota?')) {
                btnDelete.parentNode.parentNode.parentNode.removeChild(btnDelete.parentNode.parentNode)
            } else {
                return
            }
        })
    }*/

    if (e.target.classList.contains('edit')) {
        console.log("btnEdit")
    }

    if (e.target.classList.contains('delete')) {
        console.log("btnDelete")
        btnDelete.parentNode.parentNode.parentNode.removeChild(btnDelete.parentNode.parentNode)
        //e.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode)
        //e.removeChild('div')
    }

}

var remove = function () {
    this.parentNode.remove();
};

/*
var lis = document.querySelectorAll('span');
var button = document.querySelectorAll('a');

for (var i = 0, len = lis.length; i < len; i++) {
    button[i].addEventListener('click', remove, false);
}*/


var listado = document.getElementById("listCard");

//selecciono todas las tareas y realizamos algo de acuerdo al icono que hacemos click
listado.addEventListener('click', e => {
    action(e);
});

