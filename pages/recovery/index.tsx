import Link from "next/link";
import styled from "styled-components";
import Button from "../../components/Button";

export default function Recovery() {
  return (
    <StyledRecovery>
      <div className="gradient"></div>
      <h1>Password Reset</h1>
      <p>
        Enter the email address attached to your account to receive a recovery
        email.
      </p>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          <h3>Email Address</h3>
          <input
            type="email"
            defaultValue=""
            placeholder="Enter your email here..."
            required
          />
        </label>
        <Button type="submit">Reset Password</Button>
      </form>
    </StyledRecovery>
  );
}

const StyledRecovery = styled.section`
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
          margin: 0 0.25rem 0 0;
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
`;
