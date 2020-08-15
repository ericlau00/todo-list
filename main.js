let $ = (id) => document.getElementById(id);

window.onload = () => {
    $('submit-todo').addEventListener('click', (e) => {
        e.preventDefault();

        let content = $('todo-to-add').value.trim();
        if (content.length > 0) {
            console.log(content);
        }
        $('todo-to-add').value = '';
    });
}