import styled from "styled-components";

interface ButtonProps {
  children: React.ReactNode | string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  active?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function Button({ children, ...props }: ButtonProps) {
  return <StyledButton {...props}>{children}</StyledButton>;
}

const StyledButton = styled.button`
  background: ${({ theme }) => theme.primary};
  border: 2px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.secondary};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover,
  &:focus {
    transform: scale(1.01);
    box-shadow: 0 0 12px 0 ${({ theme }) => theme.primary};
  }
`;

export function CircularButton({ children, ...props }: ButtonProps) {
  return <StyledCircularButton {...props}>{children}</StyledCircularButton>;
}

const StyledCircularButton = styled.button`
  background: transparent;
  border: 2px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.secondary};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 50%;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover,
  &:focus {
    transform: scale(1.01);
    box-shadow: 0 0 12px 0 ${({ theme }) => theme.primary};
  }
`;

export const FancyButton = ({ children, ...props }: ButtonProps) => {
  return <StyledFancyButton {...props}>{children}</StyledFancyButton>;
};

const StyledFancyButton = styled.button`
  border: none;
  border-top: 2px solid #04f4f3;
  border-bottom: 2px solid #078688;
  background-image: linear-gradient(#04f4f3, #078688),
    linear-gradient(#04f4f3, #078688);
  background-size: 2px 100%;
  background-position: 0 0, 100% 0;
  background-repeat: no-repeat;
  background-color: hsla(0, 0%, 100%, 0.05);
  color: ${({ theme }) => theme.secondary};
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
`;
