import styled, { keyframes } from "styled-components";
import { useEffect, useRef, useState } from "react";
import { ImPlus, ImMinus } from "react-icons/im";

interface AccordionProps {
  title: string;
  children: React.ReactNode | string;
}

interface StyledAccordionProps {
  isOpen: boolean;
}

export default function Accordion({ title, children }: AccordionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [contentHeight, setContentHeight] = useState<number | string>(1000);

  useEffect(() => {
    setContentHeight(contentRef?.current!.offsetHeight);
  }, [isOpen]);

  return (
    <StyledAccordion isOpen={isOpen}>
      <button onClick={() => setIsOpen(!isOpen)} className="title">
        <p>{title}</p>
        <span>{isOpen ? <ImMinus /> : <ImPlus />}</span>
      </button>
      <div
        className="body"
        style={{
          maxHeight: isOpen ? `${contentHeight}px` : "0px",
        }}
      >
        <div className="content" ref={contentRef}>
          {children}
        </div>
      </div>
    </StyledAccordion>
  );
}

const dashKeyframes = keyframes`
    to {
        background-position: 100% 0%, 0% 100%, 0% 0%, 100% 100%;
    }
`;

const StyledAccordion = styled.div<StyledAccordionProps>`
  font-weight: 900;
  font-size: 1.1rem;
  width: 100%;
  border: none;
  border-top: ${({ isOpen }) => (isOpen ? "none" : "2px solid #04f4f3")};
  border-bottom: ${({ isOpen }) => (isOpen ? "none" : "2px solid #078688")};
  background: ${({ isOpen }) =>
    !isOpen
      ? "linear-gradient(#04f4f3, #078688), linear-gradient(#04f4f3, #078688)"
      : `linear-gradient(90deg, #04f4f3 50%, transparent 50%),
        linear-gradient(90deg, #04f4f3 50%, transparent 50%),
        linear-gradient(0deg, #04f4f3 50%, transparent 50%),
        linear-gradient(0deg, #04f4f3 50%, transparent 50%);`};
  background-size: ${({ isOpen }) =>
    isOpen ? "16px 2px, 16px 2px, 2px 16px, 2px 16px" : "2px 100%"};
  background-position: ${({ isOpen }) =>
    isOpen ? "0% 0%, 100% 100%, 0% 100%, 100% 0px" : "0 0, 100% 0"};
  background-repeat: ${({ isOpen }) =>
    isOpen ? "repeat-x, repeat-x, repeat-y, repeat-y" : "no-repeat"};
  background-color: hsla(0, 0%, 100%, 0.02);
  color: ${({ theme }) => theme.secondary};
  border-radius: 0.5rem;
  animation: ${({ isOpen }) => (isOpen ? dashKeyframes : "none")} 20s linear
    infinite;
  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem 2rem;
    font-size: 1.3rem;
    line-height: 1;
    font-weight: 900;
    border: none;
    background: none;
    color: ${({ theme }) => theme.secondary};
    cursor: pointer;
    svg {
      transition: all 0.3s ease;
    }
  }
  .body {
    max-height: 0px;
    overflow: hidden;
    font-weight: bold;
    line-height: 1.5;
    transition: all 0.3s ease;
  }
  .content {
    padding: 0.5rem 2rem 1.5rem;
  }
`;
