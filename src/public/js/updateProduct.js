const form = document.getElementById('updateProductForm');
const urlParams = new Proxy(new URLSearchParams(window.location.search),{
  get: (searchParams,prop) => searchParams.get(prop)
})

form.addEventListener('submit',async (event)=>{
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value,key)=>(obj[key] = value));
  const response = await fetch(`api/products/${urlParams.pid}`,{
    method:'PUT',
    body:JSON.stringify(obj),
    headers:{
      "Content-Type":"application/json"
    }
  })
  const responseData = await response.json();
  if(responseData.status==="success"){
    form.reset()
    swal.fire("Producto modificado con exito");
    window.addEventListener("click", ()=>{
      window.location.replace(`/products`);
  })
  }else{
    swal.fire("Error al actualizar el producto, modifique el formuario");
  }
})