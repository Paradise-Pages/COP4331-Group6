const urlBase = 'http://cop43316.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {

    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    //var hash = md5( password );

    document.getElementById("loginResult").innerHTML = "";

    let tmp = {
        login: login,
        password: password 
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

function doSignup() {

    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;

    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;

    var hash = md5( password );

    document.getElementById("signupResult").innerHTML = "";

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: login,
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
                document.getElementById("signupResult").innerHTML = "User added, head over to Login";
               

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "index.html";
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

function addContact() {

    let firstname = document.getElementById("contactTextFirst").value;
	let lastname = document.getElementById("contactTextLast").value;
	let phonenumber = document.getElementById("contactTextNumber").value;
	let emailaddress = document.getElementById("contactTextEmail").value;
    document.getElementById("contactAddResult").innerHTML = "";

	// $stmt->bind_param("ssssi", $firstName, $lastName, $phoneNumber, $emailAddress, $userId);
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
                document.getElementById("contactAddResult").innerHTML = "Contact has been added";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
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
                console.log(jsonObject)
                if(jsonObject.error)
				{
					console.log(jsonObject.error);
					return;
				}
                let text = "<table border='1'>"
				for( let i=0; i<jsonObject.results.length; i++ )
				{
                    text += "<tr>"
					text += "<td>" + jsonObject.results[i].FirstName +" "+ jsonObject.results[i].LastName +"</td>";
                    text += "<td>" + jsonObject.results[i].EmailAddress + "</td>";
                    text += "<td>" + jsonObject.results[i].PhoneNumber + "</td>";
                    text += "<tr/>"	
				}
                text += "</table>"    
                document.getElementById("tbody").innerHTML = text;
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}

function searchContacts() {
    const input = document.getElementById("searchText");
    const filters = input.value.toUpperCase().split(' '); // create several filters separated by space
    const table = document.getElementById("contacts");
    const tr = table.getElementsByTagName("tr");
  
    for (let i = 0; i < tr.length; i++) {
      const td = tr[i].getElementsByTagName("td")[0];
  
      if (td) {
        const txtValue = td.textContent || td.innerText;
          tr[i].style.display = "none"; // hide each row
          
        for (filter of filters) { // add the rows matching a filter
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";        
          }
        }       
      }
    }
  }
