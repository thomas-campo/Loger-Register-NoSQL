const listUsers = document.getElementById("listUsers");
const card = document.getElementsByClassName("cardUser");//eliminar si no se usa

listUsers.addEventListener('click', (e) => {
    button(e)
})

const button = async(e) => {
    if(e.target.classList.contains('buttonDeleteUser')){
        deleteUser(e.target.parentElement)
    }
    if(e.target.classList.contains('buttonUpdateRole')){
        updateUser(e.target.parentElement)
    }
    e.stopPropagation();
}

const updateUser = async(obj)=>{
    const userId = obj.querySelector(".buttonUpdateRole").id;
    const email = obj.querySelector(".email").textContent;

    Swal.fire({
        title: `Seguro que quieres cambiarle el role al usuario con este mail: ${email}?`,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        customClass: {
            actions: 'my-actions',
            cancelButton: 'order-1 right-gap',
            confirmButton: 'order-2',
            denyButton: 'order-3',
        }
    }).then(async(result) => {
        if (result.isConfirmed) {
            swal.fire("Se cambio el rol del usuario")
            await fetch(`/api/users/premium/${userId}`,{
                method:'PUT',
                headers:{
                    "Content-Type":"application/json"
                }
            })
            setTimeout(()=>window.location.reload(),2000)
        }
    })
}

const deleteUser = async(obj) =>{
    const userId = obj.querySelector(".buttonDeleteUser").id;
    const email = obj.querySelector(".email").textContent;

    Swal.fire({
        title: `Seguro que quieres eliminar al usuario con este mail: ${email}?`,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        customClass: {
            actions: 'my-actions',
            cancelButton: 'order-1 right-gap',
            confirmButton: 'order-2',
            denyButton: 'order-3',
        }
    }).then(async(result) => {
        if (result.isConfirmed) {
            swal.fire("Se elimino el usuario")
            setTimeout(()=>window.location.reload(),2000);
            await fetch(`/api/users/${userId}`,{
                method:'DELETE',
                headers:{
                    "Content-Type":"application/json"
                }
            })
        }
    })
}