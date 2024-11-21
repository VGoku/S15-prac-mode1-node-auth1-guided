/* eslint-disable no-debugger */ // Disable the eslint rule for debugger statements

// Select various DOM elements and assign them to variables
const usernameInput = document.querySelector('#usernameInput')
const passwordInput = document.querySelector('#passwordInput')
const registerBtn = document.querySelector('#registerBtn')
const loginBtn = document.querySelector('#loginBtn')
const logoutBtn = document.querySelector('#logoutBtn')
const message = document.querySelector('#message')
const fetchUsersBtn = document.querySelector('#fetchUsers')
const userListDOM = document.querySelector('#users')

// Log the document cookies to the console
console.log('document.cookie:', document.cookie)

// Function to handle registration and login actions
const handle = action => evt => {
  evt.preventDefault() // Prevent the default form submission behavior
  message.textContent = '' // Clear any existing messages
  userListDOM.textContent = '' // Clear the user list DOM element

  // Gather the username and password from the input fields
  const credentials = {
    username: usernameInput.value,
    password: passwordInput.value,
  }

  // Make a POST request to the appropriate authentication endpoint
  fetch(`/api/auth/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
    .then(res => res.json()) // Parse the response JSON
    .then(data => { 
      console.log(data) // Log the data to the console
      message.textContent = data.message // Display the response message
    })
    .catch(err => { 
      message.textContent = err.message // Display the error message
      debugger // Pause in the debugger if an error occurs
    })
}

// Function to handle logout action
const logout = evt => {
  evt.preventDefault() // Prevent the default form submission behavior
  message.textContent = '' // Clear any existing messages
  userListDOM.textContent = '' // Clear the user list DOM element

  // Make a GET request to the logout endpoint
  fetch(`/api/auth/logout`)
    .then(res => res.json()) // Parse the response JSON
    .then(data => { 
      console.log(data) // Log the data to the console
      message.textContent = data.message // Display the response message
    })
    .catch(err => { 
      message.textContent = err.message // Display the error message
      debugger // Pause in the debugger if an error occurs
    })
}

// Function to fetch and display users
const fetchUsers = evt => {
  evt.preventDefault() // Prevent the default form submission behavior
  message.textContent = '' // Clear any existing messages
  userListDOM.textContent = '' // Clear the user list DOM element
  let status // Variable to store the response status

  // Make a GET request to the users endpoint
  fetch(`/api/users`)
    .then(res => {
      status = res.status // Store the response status
      return res.json() // Parse the response JSON
    })
    .then(body => {
      if (status == 200) {
        message.textContent = 'Here are the users:' // Display a success message
        body.forEach(u => {
          const li = document.createElement('li') // Create a list item element
          li.textContent = u.username // Set the list item text to the username
          userListDOM.append(li) // Append the list item to the user list DOM element
        })
      } else {
        throw new Error(body.message) // Throw an error if the status is not 200
      }
    })
    .catch(err => {
      message.textContent = err.message // Display the error message
    })
}

// Add event listeners to the buttons
registerBtn.addEventListener('click', handle('register'))
loginBtn.addEventListener('click', handle('login'))
logoutBtn.addEventListener('click', logout)
fetchUsersBtn.addEventListener('click', fetchUsers)