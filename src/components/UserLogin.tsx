import { Button } from "./Button";

function UserLoginPage() {
  return (
    <>
      <div className="login-container">
        <LoginHeading />
        <LoginForm>
          <label htmlFor="email">Email *</label>
          <input type="text" name="email" />
          <label htmlFor="password">Password*</label>
          <input type="text" name="password" />
          <Button>Login</Button>
          <p>
            or <a href="#">create an account</a>
          </p>
        </LoginForm>
      </div>
    </>
  );
}

export function LoginHeading() {
  return (
    <div className="login-heading">
      <p>
        Hello!
        <br />
        Please log in or create an account
        <br />
        to use the features of this app
      </p>
    </div>
  );
}

export function LoginForm({ children }) {
  return <form className="user-login flex">{children}</form>;
}

export default UserLoginPage;
