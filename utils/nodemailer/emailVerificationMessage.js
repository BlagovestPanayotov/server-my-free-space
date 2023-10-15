const emailVerificationHTML = (url) =>{
  return `<!DOCTYPE html>
  <html lang="en">
  <style>
    header>h1 {
      text-align: center;
      padding-top: 0;
      font-style: italic;
      line-height: 1;
      font-family: Georgia, serif;
    }
  
    p {
      margin-left: 10%;
    }
  
    footer {
      background-color: rgba(0, 0, 0, 0.4);
      position: absolute;
      padding-top: 0.5rem;
      bottom: 0;
      right: 0;
      left: 0;
      width: 100%;
      height: 2.5rem;
      text-align: center;
      border-top-right-radius: 0.5rem;
      border-top-left-radius: 0.5rem;
    }
  </style>
  
  <body>
    <header>
      <h1>My Free Space</h1>
    </header>
    <main>
      <p>Hello dear user. You are about to join out comunity of travelars and nature lovers. The only thing left to do is
        to verify your emal addres. For successful verification, please follow the instructions:</p>
      <p>Copy the following link in the browser you have register.</p>
      <p>http://localhost:4200/auth/verified/${url}</p>
      <p>In case you are sent to register page, you have to just log in and try to access the link.</p>
      <p>Make sure that you are logged in My Free Space, when you try to verify your email.</p>
  
      <p>Have a wonderful time with our app.</p>
      <p>Best regards: Team My Free Space</p>
    </main>
  
    <footer>
      <p>&copy; 2023 All Right Reserved!</p>
    </footer>
  </body>
  
  </html>`
}

module.exports={
  emailVerificationHTML
}