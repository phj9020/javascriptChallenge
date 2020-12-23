const addBtn = document.querySelector("#add");
const notes = JSON.parse(localStorage.getItem("notes"));


if(notes){
    for(const item of notes){
        addNewNote(item);
    }
}

addBtn.addEventListener("click", ()=>{
    addNewNote();
})

function addNewNote(text = ''){
    const note = document.createElement("div");
    note.classList.add("note"); 

    note.innerHTML = 
    `
        <div class="tools">
            <button class="edit"><i class="fas fa-edit"></i></button>
            <button class="delete"><i class="fas fa-trash-alt"></i></button>
        </div>
        <div class="main ${text ? '':'hidden'}">
        </div>
        <textarea class="${text ? 'hidden' : ''}"></textarea>
    `;

    const editBtn = note.querySelector(".edit");
    const deleteBtn = note.querySelector(".delete");
    const main = note.querySelector(".main")
    const textarea = note.querySelector("textarea");

    // 기존 local storage의 텍스트를 넣어줌 
    textarea.value = text;
    main.innerHTML = marked(text);

    editBtn.addEventListener("click", ()=>{
        main.classList.toggle("hidden");
        textarea.classList.toggle("hidden");
    });

    textarea.addEventListener("input", ()=>{
        const value = textarea.value;
        main.innerHTML = marked(value);
        updateLocalStroage();
    })

    deleteBtn.addEventListener("click", ()=>{
        note.remove();
        updateLocalStroage();
    })

    document.body.appendChild(note)
}


function updateLocalStroage(){
    const noteText = document.querySelectorAll("textarea");
    
    const notes = [];

    for(const item of noteText) {
        notes.push(item.value)
    }

    localStorage.setItem("notes", JSON.stringify(notes))
    console.log(notes)
}