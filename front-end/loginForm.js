//form container
let form = document.querySelector("form");
//container for errors
let error_container = document.querySelector('.errContainer');
//check if password contains at least one number and one letter
const checkPassForNumsAndLetters = (str)=> {
  let letterExists = false;
  let numberExists = false;
  for (let i = 0; i < str.length; i++) {
    let char = str.charAt(i);
    if (isNaN(char) && !letterExists) {
      letterExists = true;
    } else if (!isNaN(char) && !numberExists) {
      numberExists = true;
    }
  }
  return letterExists && numberExists;
}
//check if user name is valid
const checkUserName = (user)=>{
  return user === "" || user.length < 2 || !(user.match(/^[a-zA-Z]+$/));
}
//check if password is valid
const checkPassword = (pwd)=>{
  return pwd === "" || pwd.length < 8 || !checkPassForNumsAndLetters(pwd);
}
//listener for submit button
form.addEventListener("submit", (event) => {
    event.preventDefault();
    error_container.innerHTML = ``;
    let user = form.username.value;
    let pwd = form.password.value;
    //if there is a problem with username or password, display an error in error container
    if(checkUserName(user)||checkPassword(pwd)){
      error_container.innerHTML += `<h4>user name must contain 2 or more characters, and only letters</h4>`;
      error_container.innerHTML += `<h4>password must contain 8 or more characters, letters and numbers</h4>`;
    }
    //else post data to server with fetch
    else{
      //create an object of a user
    let data = {
        user: user,
        password: pwd
    }
    fetch('/login', {
      method: 'POST', // or 'PUT'
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    //get response from server
    .then(response => {
      //status 201: incorrect username or password
      if(response.status === 201){
        error_container.innerHTML = ``
        error_container.innerHTML += `
          <h4>wrong username or password</h4>
        `
        return "";
      }
        //status 200: login successfully
        return response.text();
      
      })
      //if login successfully, move to home page
      .then(resp=> {
        if(resp != ""){
          window.location.href = resp
        }
      })


        } 

});

  