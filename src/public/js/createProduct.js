const form = document.getElementById('createProductForm');
const text = document.getElementById('message');

form.addEventListener('submit',async (event)=>{
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value,key)=>(obj[key] = value));
  const response = await fetch('/api/products',{
    method:'POST',
    body:JSON.stringify(obj),
    headers:{
        "Content-Type":"application/json"
    }
  })
  const responseData = await response.json();
  if(responseData.status==="success"){
    form.reset()
    text.innerHTML = "Producto creado"
  }else{
    text.innerHTML = "Error al crear el product"
  }
})