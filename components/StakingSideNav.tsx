import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { BsGear } from "react-icons/bs";
import { BiTransfer, BiLogOut } from "react-icons/bi";
import { MdOutlineVpnKey, MdOutlineGridView } from "react-icons/md";
import { HiOutlineLockOpen } from "react-icons/hi";
import { useRouter } from "next/router";
import { useEffect, useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";

export default function StakingSideNav(props: any) {
  // console.log("propsss...",props);
  const { pathname } = useRouter();
  const [router, setRouter] = useState(useRouter());
  const [userName, setUserName] = useState('User name');
  const [profilePictureSrc, setProfilePictureSrc] = useState<any>('');
  // // let data = localStorage.getItem('user');
  // data = data != null ? JSON.parse(data) : null;
  let [isNameExtracted, setIsNameExtracted] = useState(false);
  let [displayToast, setDisplayToast] = useState(false);

  useEffect(
    () => {
      if (isNameExtracted === false) {
        fetchUserName();
      }
    },
    [isNameExtracted],
  );

  const fetchUserName = () => {

    let data_ = localStorage.getItem('user');
    let data;
    if (data_ != null) {
      data = JSON.parse(data_);
      if (data != null) {
        if (data['name'] != undefined) {
          setUserName(data['name']);
        }
        if (data['profilePicture'] != undefined) {
          setProfilePictureSrc(data['profilePicture']);
        }
      }

    } else {
      if (displayToast == false) {
        displayToast=true;
        toast.error("Login required!");
      }
      router.push("/login");
    }
    setIsNameExtracted(true);
  }
  // console.log(typeof (data), data);
  const logout = (e: any) => {
    e.preventDefault()
    localStorage.removeItem('user');
    router.push("/login");

  }

  return (
    isNameExtracted === false ? (<></>) : (<StyledStakingSideNav>
      <div className="user">
        <div className="avatar">
          {props.profilePicture !== undefined && props.profilePicture != "" ? (<Image className="avatar" src={props.profilePicture} alt="avatar" layout="fill" />)
            : (profilePictureSrc !== "" && profilePictureSrc !== undefined ? (<Image className="avatar" src={profilePictureSrc} alt="avatar" layout="fill" />) :
              (<Image className="avatar" src="/images/Group-69.png" alt="avatar" layout="fill" />))}
        </div>
        <div className="name">
          <p>Welcome</p>
          <h3>{props.userName != undefined ? props.userName : userName}</h3>
        </div>
      </div>
      <div className="links">
        <Link href="/dashboard" passHref scroll={false}>
          <a className={pathname === "/dashboard" ? "active" : undefined}>
            <MdOutlineGridView /> Dashboard
          </a>
        </Link>
        <Link href="/transfer" passHref scroll={false}>
          <a className={pathname === "/transfer" ? "active" : undefined}>
            <BiTransfer /> Transfer
          </a>
        </Link>
        <Link href="/connect" passHref scroll={false}>
          <a className={pathname === "/connect" ? "active" : undefined}>
            <MdOutlineVpnKey /> Connect Wallet
          </a>
        </Link>
        <Link href="/staking" passHref scroll={false}>
          <a className={pathname === "/staking" ? "active" : undefined}>
            <HiOutlineLockOpen /> Staking
          </a>
        </Link>
      </div>
      <div className="extras">
        <Link href="/profile" passHref scroll={false}>
          <a className={pathname === "/profile" ? "active" : undefined}>
            <BsGear /> Profile
          </a>
        </Link>
        <Link href="/logout" passHref scroll={false}>
          <a onClick={logout}>
            <BiLogOut /> Logout
          </a>
        </Link>
      </div>
    </StyledStakingSideNav>
    )
  );
}

const StyledStakingSideNav = styled.div`
  flex: 0.25;
  position: sticky;
  top: 8rem;
  .user {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      box-shadow: 0 0 5px 4px rgb(0 0 0 / 25%);
      position: relative;
      img {
        object-fit: cover;
      }
    }
    h3 {
      margin-top: 0.3rem;
      font-size: 1.2rem;
      line-height: 1;
    }
    p {
      font-size: 0.9rem;
      line-height: 1;
      color: ${({ theme }) => theme.tertiary};
    }
  }

  .links {
    margin-top: 4rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    a {
      font-size: 1.3rem;
      font-weight: 900;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 1rem;
      color: rgba(255, 255, 255, 0.3);
      transition: color 0.2s ease-in-out;
      outline: none;
      &:hover,
      &:focus {
        color: ${({ theme }) => theme.secondary};
      }
      svg {
        font-size: 1.4rem;
      }
    }
  }
  .extras {
    margin-top: 6rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    a {
      font-size: 1rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 1rem;
      color: rgba(255, 255, 255, 0.3);
      transition: color 0.2s ease-in-out;
      outline: none;
      &:hover,
      &:focus {
        color: ${({ theme }) => theme.secondary};
      }
      svg {
        font-size: 1.2rem;
      }
    }
  }
  .active {
    color: ${({ theme }) => theme.secondary} !important;
  }
`;
