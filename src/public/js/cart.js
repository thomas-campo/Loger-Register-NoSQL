const idProduct = document.getElementById('loginForm');

form.addEventListener('submit',async (event)=>{
    event.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>(obj[key] = value));
    const response = await fetch('/api/sessions/login',{
      method:'POST',
      body:JSON.stringify(obj),
      headers:{
          "Content-Type":"application/json"
      }
    })
    const responseData = await response.json();
    if(responseData.status==="success"){
      window.location.replace('/products');//redirijo a los productos
    }
  })

  const productsToCart = document.getElementById('productsToCart');

  const btnEliminar = () => {
      const botones = document.getElementsByClassName('btn-danger')
      const arrayBtn = Array.from(botones)
  
      arrayBtn.forEach(element => {
          element.addEventListener('click', () => {
              console.log('click');
              Swal.fire({
                  title: 'Do you want to delete this product?',
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
              }).then((result) => {
                  if (result.isConfirmed) {
                      Swal.fire(`The product with ID: ${element.id} was deleted`, '', 'success')
                      socket.emit('delete', element.id)
  
                  }
              })
  
          })
  
      })
  }