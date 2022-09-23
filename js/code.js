const urlBase = 'http://cop43316.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = []

function doLogin() {

    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    var hash = md5( password );

    document.getElementById("loginResult").innerHTML = "";

    let tmp = {
        login: login,
        password: hash 
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) {

                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "contacts.html";
            }
        };
		
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function valid_username(username) {// ? jan

    // {3,18} : assert password is between 3-18 chars  
    // user must have at least one letter
    // user can use only NUMBER, LATIN CHARACTERS, UNDERSCORE, HYPENS
    var valid_username_reg = /^(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;
    return valid_username_reg.test(username);
}

function valid_password(password) {// ? jan

    // (?=.*[0-9])      : assert one NUMBER
    // (?=.*[!@#$%^&*]) : assert one SPECIAL CHAR
    // {8,32}           : assert password is between 8-32 chars
    // can contain any number of LATIN characters 
    var valid_password_reg = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
    return valid_password_reg.test(password);
}

function checkUsername(username) {

    let tmp = {
        login: username
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchUsers.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    //var jsonObject;

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }

    // return jsonObject.Error;
}

function doSignup() {

    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if(!valid_password(password)) {// ? jan
        /*
        * idea:
        ! display red warning message with an explanation of what went wrong
        */
        document.getElementById("signupResult").innerHTML = "invalid password";
        console.log("invalid password");
        return;
    }

    if(!valid_username(username)) {// ? jan
        /*
        * idea:
        ! display red warning message with an explanation of what went wrong
        */
        document.getElementById("signupResult").innerHTML = "invalid username";
        console.log("invalid username");
        return;
    }

    if(checkUsername(username)) {
        console.log("Duplicate username!");
        return;
    }

    console.log("valid password and username");

    var hash = md5( password );

    document.getElementById("signupResult").innerHTML = "";

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: hash
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SignUp.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) {

                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
                document.getElementById("signupResult").innerHTML = "User added, please LOGIN";
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                saveCookie();
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("signupResult").innerHTML = err.message;
    }
}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    
	for (var i = 0; i < splits.length; i++) {

        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");

        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        } 
		
		else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        } 
		
		else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    } 
	
	else {
        document.getElementById("userName").innerHTML = "Welcome, " + firstName + " " + lastName + "!";
    }
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";

    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function showTable() {
    var x = document.getElementById("addMe");
    var contacts = document.getElementById("contactsTable")
    if (x.style.display === "none") {
         x.style.display = "block";
         contacts.style.display = "none"; 
    } else { 
        x.style.display = "none";
        contacts.style.display = "block";  
    }
}

function addContact() {

    let firstname = document.getElementById("contactTextFirst").value;
	let lastname = document.getElementById("contactTextLast").value;
	let phonenumber = document.getElementById("contactTextNumber").value;
	let emailaddress = document.getElementById("contactTextEmail").value;

    let tmp = {
        firstName: firstname,
        lastName: lastname,
        phoneNumber: phonenumber,
		emailAddress: emailaddress,
		userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been added");
                // Clear input fields in form 
                document.getElementById("addMe").reset();
                // reload contacts table and switch view to show
                loadContacts(); 
                showTable();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function loadContacts() {
    let tmp = {
        search: "",
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
	try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if(jsonObject.error)
				{
					console.log(jsonObject.error);
					return;
				}
                let text = "<table border='1'>"
				for( let i=0; i<jsonObject.results.length; i++ )
				{
                    ids[i] = jsonObject.results[i].ID
                    text += "<tr id='row"+i+"'>"
					text += "<td id='first_Name"+i+"'>" + jsonObject.results[i].FirstName +"</td>";
                    text += "<td id='last_Name"+i+"'>" + jsonObject.results[i].LastName + "</td>";
                    text += "<td id='email"+i+"'>" + jsonObject.results[i].EmailAddress + "</td>";
                    text += "<td id='phone"+i+"'>" + jsonObject.results[i].PhoneNumber + "</td>";
                    text += "<td>"+
                    "<button type='button' id='edit_button"+i+"' class='w3-button w3-circle w3-lime' onclick='edit_row("+i+")'>" + "<span class='glyphicon glyphicon-edit'></span>" + "</button>" +
                    "<button type='button' id='save_button"+i+"' value='Save' class='save' onclick='save_row("+i+")' style='display: none'>"+ "<span class='glyphicon glyphicon-saved'></span>" + "</button>" +
                    "<button type='button' onclick='delete_row("+i+")' class='w3-button w3-circle w3-amber'>" + "<span class='glyphicon glyphicon-trash'></span> " + "</button>" + "</td>";
                    text += "<tr/>"	
				}
                text += "</table>"    
                document.getElementById("tbody").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function edit_row(id)
{
    document.getElementById("edit_button"+id).style.display="none";
    document.getElementById("save_button"+id).style.display="block";
    
    var firstNameI=document.getElementById("first_Name"+id);
    var lastNameI=document.getElementById("last_Name"+id);
    var email=document.getElementById("email"+id);
    var phone=document.getElementById("phone"+id);
    //var id_val=document.getElementById("idNum"+id);
    //console.log(id_val.innerHTML);

    var namef_data=firstNameI.innerHTML;
    var namel_data=lastNameI.innerHTML;
    var email_data=email.innerHTML;
    var phone_data=phone.innerHTML;
    
    firstNameI.innerHTML="<input type='text' id='namef_text"+id+"' value='"+namef_data+"'>";
    lastNameI.innerHTML="<input type='text' id='namel_text"+id+"' value='"+namel_data+"'>";
    email.innerHTML="<input type='text' id='email_text"+id+"' value='"+email_data+"'>";
    phone.innerHTML="<input type='text' id='phone_text"+id+"' value='"+phone_data+"'>"
}

function save_row(no)
{
    var namef_val=document.getElementById("namef_text"+no).value;
    var namel_val=document.getElementById("namel_text"+no).value; 
    var email_val=document.getElementById("email_text"+no).value;
    var phone_val=document.getElementById("phone_text"+no).value;
    var id_val=ids[no]

    document.getElementById("first_Name"+no).innerHTML=namef_val;
    document.getElementById("last_Name"+no).innerHTML=namel_val;
    document.getElementById("email"+no).innerHTML=email_val;
    document.getElementById("phone"+no).innerHTML=phone_val;

    document.getElementById("edit_button"+no).style.display="block";
    document.getElementById("save_button"+no).style.display="none";

    let tmp = {
        phoneNumber: phone_val,
        emailAddress: email_val,
        newFirstName: namef_val,
        newLastName: namel_val,
        id: id_val
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
                loadContacts(); 
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
} 

function delete_row(no)
{
 var namef_val=document.getElementById("first_Name"+no).innerHTML;
 var namel_val=document.getElementById("last_Name"+no).innerHTML; 
 let check = confirm('Confirm deletion of contact: ' + namef_val + ' ' + namel_val);
			if(check === true){
				document.getElementById("row"+no+"").outerHTML="";
                let tmp = {
                    firstName: namef_val,
                    lastName: namel_val,
                    userId: userId
                };

                let jsonPayload = JSON.stringify(tmp);

                let url = urlBase + '/DeleteContacts.' + extension;

                let xhr = new XMLHttpRequest();
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
                try {
                    xhr.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            console.log("Contact has been deleted");
                            loadContacts(); 
                        }
                    };
                    xhr.send(jsonPayload);
                } catch (err) {
                    console.log(err.message);
                }

			};
 
}

function searchContacts() {
    const content = document.getElementById("searchText");
    const selections = content.value.toUpperCase().split(' '); 
    const table = document.getElementById("contacts");
    const tr = table.getElementsByTagName("tr");
  
    for (let i = 0; i < tr.length; i++) {
      const td = tr[i].getElementsByTagName("td")[1];
  
      if (td) {
        const txtValue = td.textContent || td.innerText;
          tr[i].style.display = "none"; 
          
        for (selection of selections) { 
          if (txtValue.toUpperCase().indexOf(selection) > -1) {
            tr[i].style.display = "";        
          }
        }       
      }
    }
  }

  function clickLogin()
  {
    var log =document.getElementById("login");
    var reg =document.getElementById("signup");
    var but =document.getElementById("btn");
    log.style.left="-400px";
    reg.style.left="0px";
    but.style.left="130px";
    
  }

  function clickRegister()
  {
    var log =document.getElementById("login");
    var reg =document.getElementById("signup");
    var but =document.getElementById("btn");

    reg.style.left="-400px";
    log.style.left="0px";
    but.style.left="0px";

  }
