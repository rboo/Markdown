//

let currentColor = null;
let currentDate;
let operation = "N";
let elementMarkdown;
let idElement = null;

(function () {
    loadColor()
    showDialogNote()
    converterToMarkDown()
})();

function loadColor() {
    const divColors = document.getElementById('colors');
    let fragment = document.createDocumentFragment();
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
    return marked.parse(markdownData);  
}

function converterToMarkDown() {
    const isVisible = "is-visible";
    let btnNoteApp = document.getElementById("addNote");
    btnNoteApp.addEventListener("click", e => {
        if (e.target !== document.querySelector(".modal.is-visible")) {
            let markupArea = document.getElementById('markup');
            let data = markupArea.value
            document.querySelector(".modal").classList.remove(isVisible);
            if(operation === 'N'){
                addCard(data)
            }else{
                /*tomar el valor actualizado y convertirlo a markdown*/
                console.log("editar",loadMarkDownInput(markupArea.value.trim()))
                document.getElementById(idElement).innerHTML = loadMarkDownInput(markupArea.value.trim().replace(/['"]+/g, ''))
                operation = 'N'
            }           
        }
    })
}

function addCard(obj) {
    let id = new Date().getTime()
    document.getElementById('listCard').innerHTML +=
        `
    <div class="card" id='card' style="background-color: ${currentColor} ">
        <span class="card_actions">
            <a href="#" id="edit" class="btnEdit"><img class="edit" data-action="E" src="./img/edit.svg"></img></a>
            <a href="#" id="delete" class="btnDelete"><img class="delete" src="./img/delete.svg"></img></a>
        </span>
        <div class="contentMarkDown" id="${id}" data-id="${id}">
        ${loadMarkDownInput(obj)}
        </div>
        <p class="pFotter">${currentDate}</p>
    </div>
    `
}

/* convertir html to markdown */
function showDown(id){
    const turndownService = new TurndownService()
    const markdown = turndownService.turndown(document.getElementById(id))
    return markdown
}

//verificar en el momento que se desea editar el id del content para poder pasar la info correcta
function action(e) {
    const isVisible = "is-visible";

    if (e.target.classList.contains('edit')) { 
        //console.log("parentElement",e.target.parentElement.parentElement.parentElement) 
        //console.log("querySelector",document.getElementById('card').querySelectorAll('[id^="contentMarkDown"]'))
        operation = e.target.dataset.action
        document.getElementById("modal1").classList.add(isVisible);
        idElement = dataId(e)
        document.getElementById("markup").value = showDown(idElement)
        document.getElementById(idElement).innerText = ""
    }

    if (e.target.classList.contains('delete')) {
        e.target.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode)
    }
}

function dataId(e){
    var l = e.target.parentElement.parentElement.parentElement.querySelectorAll(".contentMarkDown")
    return l[0].dataset.id
}

var listado = document.getElementById("listCard");

listado.addEventListener('click', e => {
    action(e);
});

