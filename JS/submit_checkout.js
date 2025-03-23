const scriptURL = "https://script.google.com/macros/s/AKfycbxJgEIAszL-cBrGuC3ikzvRcVwFGtQHgcX8mZ-QKAbV7bR4eHH5azfk03MIx6_-MDVS/exec"

let form = document.getElementById("form_contact");


form.addEventListener("submit" , (e) => {
    e.preventDefault()

    fetch(scriptURL , {
        method: "POST",
        body: new FormData(form),
    })
    .then((response) => {
        setTimeout(() => {
            localStorage.removeItem("cart")
            window.location.reload()
        },3000)
    })
    .catch((error) => console.error("eroor!" , error.message))
})