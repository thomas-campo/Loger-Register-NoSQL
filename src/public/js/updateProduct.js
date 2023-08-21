const form = document.getElementById('updateProductForm');
const text = document.getElementById('message');

form.addEventListener('submit',async (event)=>{
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};
  console.log(obj,"aca esta el objeto")
  data.forEach((value,key)=>(obj[key] = value));
  const response = await fetch(`/api/products/`,{
    method:'PUT',
    body:JSON.stringify(obj),
    headers:{
      "Content-Type":"application/json"
    }
  })
  const responseData = await response.json();
  if(responseData.status==="success"){
    text.innerHTML = "Producto modificado con exito"
  }else{
    text.innerHTML = "Error al modificar el producto"
  }
})