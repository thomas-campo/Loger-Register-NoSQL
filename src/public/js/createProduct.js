const form = document.getElementById('createProductForm');
const userMail = document.getElementById("userMail").textContent;
const userId = document.getElementById("userId").textContent;

form.addEventListener('submit',async (event)=>{
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value,key)=>(obj[key] = value));
  obj.owner = userMail;
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
    swal.fire("Producto creado")
  }else{
    swal.fire("Error al crear el product")
  }
})