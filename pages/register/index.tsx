import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import Button from "../../components/Button";
import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
/************JWT AUTH************* */
const jwt = require('jsonwebtoken');

export default function Register() {
  const [secretKey,setSecretKey]=useState(process.env.secret);
  const [appHost, setAppHost] = useState(process.env.NEXT_APP_HOST);
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsgType, setErrorMsgType] = useState(0);
  const [router, setRouter] = useState(useRouter());

  const handleEmailAddress = useCallback(
    (e) => setEmailAddress((e.target as HTMLInputElement).value),
    [],
  );
  const handlePassword = useCallback(
    (e) => setPassword((e.target as HTMLInputElement).value),
    [],
  );
  const handleConfirmPassword = useCallback(
    (e) => setConfirmPassword((e.target as HTMLInputElement).value),
    [],
  );
  const handleUserName = useCallback(
    (e) => setName((e.target as HTMLInputElement).value),
    [],
  );

  const registerUser = async (e: any) => {
    e.preventDefault();
    try {
      setErrorMsgType(0);
      // console.log(emailAddress, password, confirmPassword);

      if (password !== confirmPassword) {
        setErrorMsgType(1);
      }
      else if (name===undefined || name===null || name === "") {
        setErrorMsgType(3);
      }
      else {
        let data = {
          query: `mutation {
            register(name: "${name}", email: "${emailAddress}", password: "${password}", profilepicture: "", walletaddress: "") {
              name
              email
              profilepicture
          }
        }`
        };
        let response = await axios.post(appHost + '/register', data);
        // console.log( response.data);
        if (response.data != undefined && response.data.data != undefined && response.data.data.register != undefined) {
          let userName = response.data.data.register.name, profilePicture=response.data.data.register.profilepicture;
          console.log('secret...', process.env.secret);
          const token = jwt.sign({ sub: emailAddress }, secretKey, { expiresIn: '7d' });
          console.log('token...', token, 'secret...',secretKey);
          localStorage.setItem('user', JSON.stringify({
            userEmail: emailAddress,
            name:userName,
            token,
            profilePicture: profilePicture
          }));  
          toast.success("Registered sucessfully!");
          router.push("/staking");
        }
        else if (response.data.errors != undefined && response.data.errors.length > 0) {
          if (response.data.errors[0]['message'] === "Email is taken") {
            setErrorMsgType(2);
          }
        }
      }
    } catch (ex) {
      console.log('ex:....', ex)
    }
  }

  return (
    <StyledRegister>
      <div className="gradient"></div>
      <h1>Register</h1>
      <p>Register a new account below.</p>
      <form onSubmit={registerUser}>
        <label>
          <h3>User Name</h3>
          <input
            type="text"
            defaultValue=""
            placeholder="Enter your user name here..."
            onChange={handleUserName}
            required
          />
        </label>
        <label>
          <h3>Email Address</h3>
          <input
            type="email"
            defaultValue=""
            placeholder="Enter your email here..."
            onChange={handleEmailAddress}
            required
          />
        </label>
        <label>
          <h3>Password</h3>
          <input
            type="password"
            defaultValue=""
            placeholder="Enter your password here..."
            onChange={handlePassword}
            required
          />
        </label>
        <label>
          <h3>Confirm Password</h3>
          <input
            type="password"
            defaultValue=""
            placeholder="Re-Enter your password here..."
            onChange={handleConfirmPassword}
            required
          />
        </label>
        <div className="extras">
          <label>
            <input type="checkbox" required />
            <span>I agree to the Terms of Service</span>
          </label>

        </div>

        {errorMsgType == 1 ? (<a id="errorMsg">Password confirmation does not match!</a>) : (
          errorMsgType == 2 ? (<a id="errorMsg">This Email is already registered!</a>) : (
            errorMsgType == 3 ? (<a id="errorMsg">User name is required!</a>) : (<></>)))}
        <Button type="submit">Register</Button>
      </form>
    </StyledRegister>
  );
}

const StyledRegister = styled.section`
  padding: 10rem 2rem 6rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  .gradient {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: -1;
    background-image: radial-gradient(
      circle farthest-corner at 50% 50%,
      rgba(114, 255, 255, 0.05),
      rgba(115, 241, 255, 0.04) 14%,
      rgba(58, 220, 255, 0.03) 31%,
      rgba(133, 233, 255, 0.01) 45%,
      hsla(0, 0%, 100%, 0) 56%,
      hsla(0, 0%, 100%, 0) 72%,
      hsla(0, 0%, 100%, 0) 104%
    );
  }
  h1 {
    font-size: 2rem;
  }
  p {
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }
  form {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 2rem;
    h3 {
      font-size: 0.8rem;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 1;
      span {
        font-size: 0.8rem;
        color: #bfc2c3;
        b {
          color: ${({ theme }) => theme.primary};
          font-family: "Radwave";
        }
      }
    }
    label {
      display: block;
    }
    p {
      margin: 0;
      font-size: 0.7rem;
      span {
        color: ${({ theme }) => theme.primary};
      }
    }
    input {
      margin-top: 0.5rem;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: transparent;
      border: 1px dashed #8a8a8a;
      border-radius: 5px;
      font-weight: bold;
      font-size: 0.8rem;
      padding: 0.5rem 1rem;
      color: ${({ theme }) => theme.secondary};
      transition: all 0.2s ease-in-out;
      outline: none;
      svg {
        font-size: 1rem;
      }
      &:hover,
      &:focus {
        border: 1px dashed ${({ theme }) => theme.primary};
      }
    }
    button {
      width: 100%;
      font-size: 1rem;
      font-weight: 900;
      padding: 0.8rem 1rem;
    }
    .extras {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      label {
        width: fit-content;
        display: flex;
        align-items: center;
        cursor: pointer;
        input {
          width: fit-content;
          height: 0.8rem;
          margin: 0 0.5rem 0 0;
          display: inline-block;
        }
        span {
          display: inline-block;
          font-size: 0.75rem;
          white-space: nowrap;
        }
        
      }
      .links {
        a {
          &:first-of-type {
            color: ${({ theme }) => theme.tertiary};
            opacity: 0.8;
            margin-right: 1rem;
          }
        }
      }
    }
  }
  
  #errorMsg {
    color: ${({ theme }) => theme.error};
    font-size: 1rem;
  }
`;
