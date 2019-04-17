//book class: represent a book
class Book {
    constructor(title, author, isbn ){
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}

//UI class: handes UI tasks
class UI {
    static displayBooks() {

        const books = Store.getBook();

        books.map((book) => UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.querySelector('#book-list')

        const row = document.createElement('tr')

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger" btn-sm >delete</a></td>


        `;

        list.appendChild(row);

    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message))
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form)
        //Vanish in 3 sec
        setTimeout(() => document.querySelector(".alert").remove(),
        3000);
    }

    static clearFields(){
        document.querySelector('#title').value = "";
        document.querySelector('#author').value = "";
        document.querySelector('#isbn').value = "";


    }
    static deleteBook(el){
        if(el.classList.contains('btn')){
            el.parentElement.parentElement.remove()
        }
    }
}

//store class: handles storage
class Store {
    static getBook(){
        let books;
        if(localStorage.getItem("books") === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem("books"))
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBook()
        books.push(book)
        console.log(books)
        localStorage.setItem("books", JSON.stringify(books))
    }
    static removeBook(isbn){
        const books = Store.getBook()

        books.map((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1)
            }
        })

        localStorage.setItem("books", JSON.stringify(books))
    }
}


//Event: Display books
document.addEventListener('DomContentLoaded', UI.displayBooks)

//Event: add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //Prevent actual submit
    e.preventDefault();

    //Get form value
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    //validate

    if(title=== "" || author === "" || isbn === ""){
        UI.showAlert("please fill in all fields", 'danger')
    }else {
        //instatiate book
        const book = new Book(title, author, isbn)
        console.log(book)

        //add book to store
        Store.addBook(book);

        //add book to UI
        UI.addBookToList(book);
        


        //show success message
        UI.showAlert("Book added successfully", "success")


        //clear field
        UI.clearFields()
    }


})

//Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {

    //Remove book from UI
    UI.deleteBook(e.target );

    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //show success message
    UI.showAlert("Book removed successfully", "success");
})
