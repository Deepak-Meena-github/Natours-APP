/*eslint-disable */

const login =async (email, password) => {
    console.log(email,password);
    try{
        const res= await axios({
            method :'POST',
            url:'http://127.0.0.1:8000/api/v1/users/login',
            data:{
               email,
               password
        
            }
           });
           console.log(res);
           if(res.data.status=='sucess'){
            alert('loggend in succesfuly');
            window.setTimeout(()=>{
                location.assign('/');

            },1500);
           }
    }
    catch(err){
       alert(err.response.data.message);
    }
 
  

};

// Add an event listener to the form submit
document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Get the email and password values from the form inputs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Call the login function with the email and password
    login(email, password);
});
