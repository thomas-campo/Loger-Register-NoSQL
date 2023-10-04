const form = document.getElementById('restoreForm');
const text = document.getElementById('message');
const urlParams = new Proxy(new URLSearchParams(window.location.search),{
  get: (searchParams,prop) => searchParams.get(prop)
})

form.addEventListener('submit',async (event)=>{
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value,key)=>(obj[key] = value));
  obj.token = urlParams.token;
  const response = await fetch('/api/sessions/restorePassword',{
    method:'POST',
    body:JSON.stringify(obj),
    headers:{
        "Content-Type":"application/json"
    }
  })
  const responseData = await response.json();
  if(responseData.status==="success"){
    swal.fire("Contraseña modificada");
    window.addEventListener("click", ()=>{
      window.location.replace(`/products`);
  })
  }else{
    swal.fire("Error al actualizar la contraseña, modifique la contraseña");
  }
})