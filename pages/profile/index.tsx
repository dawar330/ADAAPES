import styled from "styled-components";
import Image from "next/image";
import StakingSideNav from "../../components/StakingSideNav";
import toast from "react-hot-toast";

import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
/************JWT AUTH************* */
const jwt = require('jsonwebtoken');
import getConfig from 'next/config';

import { Buffer } from "buffer";
import { create } from "ipfs-http-client";



const client = create("https://ipfs.infura.io:5001/api/v0");


export default function Profile() {
  const [secretKey, setSecretKey] = useState(process.env.secret);
  const [appHost, setAppHost] = useState(process.env.NEXT_APP_HOST);
  let [isDataExtracted, setIsDataExtracted] = useState(false);
  const [errorMsgType, setErrorMsgType] = useState(0);
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profilePictureSrc, setProfilePictureSrc] = useState<any>('');

  useEffect(
    () => {
      if (localStorage.getItem('user')!=null && isDataExtracted === false) {
        fetchUserData();
      }
    },
    [isDataExtracted],
  );

  const handleNewEmailAddress = useCallback(
    (e) => setNewEmail((e.target as HTMLInputElement).value),
    [],
  );
  const handleCurrentPassword = useCallback(
    (e) => setCurrentPassword((e.target as HTMLInputElement).value),
    [],
  );
  const handleNewPassword = useCallback(
    (e) => setNewPassword((e.target as HTMLInputElement).value),
    [],
  );
  const handleNewUserName = useCallback(
    (e) => setNewUserName((e.target as HTMLInputElement).value),
    [],
  );


  //1. get user data
  const fetchUserData = async () => {
    let item_ = localStorage.getItem('user');
    let item = item_ != null ? JSON.parse(item_) : null;

    if (item != null && item['userEmail'] != undefined) {
      let email = item['userEmail'];
      // test = (window as { [key: string]: any })["DataManager"] as string;
      console.log(email);
      let data = {
        query: `query {
        getOneUser(email:"${email}") {
            name
            email
            profilepicture
        }
      }`
      };
      let response = await axios.post(appHost + '/getOneUser', data);
      console.log(response);
      if (response.data != undefined && response.data.data != undefined && response.data.data.getOneUser != undefined) {
        let userData = response.data.data.getOneUser;
        if (userData !== null) {
          setCurrentUserName(userData['name']);
          setCurrentEmail(userData['email']);
          setProfilePictureSrc(userData['profilepicture']);
        }
      }


    }
  }
  //2. get updated values //3. validate values
  //4. update data

  const updateUserInformation = async (e: any) => {
    e.preventDefault();
    try {
      setErrorMsgType(0);
      /**{errorMsgType == 1 ? (<a id="errorMsg">Kindly input new value in atleast one field to update the profile!</a>) : (
                  errorMsgType == 2 ? (<a id="errorMsg">Current password and new password are same!</a>) : (
                    errorMsgType == 3 ? (<a id="errorMsg">Current email and new email are same!</a>) : (
                      errorMsgType == 4 ? (<a id="errorMsg">User with this email already exists!</a>) : (
                        errorMsgType == 5 ? (<a id="errorMsg">Invalid current password!</a>) : (<></>) */
      if ((currentPassword === undefined || currentPassword === "") && (newEmail === undefined || newEmail === "")
        && (newUserName === undefined || newUserName === "") && (newPassword === undefined || newPassword === "")) {
        setErrorMsgType(1);
      }
      else if (currentUserName === newUserName) {
        setErrorMsgType(6);
      }
      else if (currentEmail === newEmail) {
        setErrorMsgType(3);
      }
      else if (currentPassword === newPassword && currentPassword !== "") {
        setErrorMsgType(2);
      }
      else if (((currentPassword === undefined || currentPassword === "") && (newPassword !== undefined && newPassword !== ""))
        || ((currentPassword !== undefined && currentPassword !== "") && (newPassword === undefined || newPassword === ""))) {
        setErrorMsgType(7);
      } else {
        let name = newUserName, email = newEmail, password, prevPassword, prevEmail = "";
        if (newUserName === undefined || newUserName === "") {
          name = currentUserName;
        }
        if (newEmail === undefined || newEmail === "") {
          email = currentEmail;
        }
        if (newPassword === undefined || newPassword === "") {
          password = null;
          prevPassword = null;
        } else {
          password = newPassword;
          prevPassword = currentPassword;
        }
        prevEmail = currentEmail;

        let data = {
          query: `mutation {
            UpdateUserInfo(Info: {name:"${name}", email:"${email}" , password : "${password}" , currentPassword:"${prevPassword}", currentEmail:"${prevEmail}"}) {
            name
            email
            profilepicture
        }
      }`
        };
        let response = await axios.post(appHost + '/UpdateUserInfo', data);
        console.log(response);
        // response = response.data;
        if (response.data.data !== null && response.data.data.UpdateUserInfo !== undefined && response.data.data.UpdateUserInfo !== null) {
          let updatedInfo = response.data.data.UpdateUserInfo;

          const token = jwt.sign({ sub: updatedInfo.email }, secretKey, { expiresIn: '7d' });
          localStorage.setItem('user', JSON.stringify({
            userEmail: updatedInfo.email,
            name: updatedInfo.name,
            token,
            profilePicture: profilePictureSrc
          }));
          setNewEmail('');
          setNewPassword('');
          setNewUserName('');
          setCurrentPassword('');
          setCurrentEmail(updatedInfo.email);
          setCurrentUserName(updatedInfo.name);
          toast.success("Profile updated sucessfully!");
        } else if (response.data.errors !== undefined && response.data.errors.length > 0) {
          if (response.data.errors[0]['message'] === "Email is taken") {
            setErrorMsgType(4);
          }
          else if (response.data.errors[0]['message'] === "Wrong Password.") {
            setErrorMsgType(5);
          }
        }


      }


    } catch (ex) {
      console.log("err", ex);
    }
  }

  // save user image in ipfs and then save image hash in db
  const [toastID, settoastID] = useState<any>();
  const [file, setFile] = useState(null);

  const getImageFileObject = async (imageFile: any) => {
    if (imageFile.target.files[0] != undefined) {
      const toastId = toast.loading(
        <div style={{}}>
          <div>Saving And Updating</div>
        </div>,
        {
          style: {
            color: "#fff",
            backgroundColor: "black",
            border: "1px solid #444",
            fontSize: "14px",
            display: "flex",
            justifyContent: "left",
            width: "300px",
            padding: "6px",
          },
          iconTheme: {
            primary: "#2feacb",
            secondary: "black",
          },
        }
      );
      settoastID(toastId);
      const data = imageFile.target.files[0];

      const reader = new window.FileReader();
      // if (data) {
      //   reader.readAsArrayBuffer(data);
      // }
      // // reader.onloadend = () => {
      // //   setFile("Buffer data: ", Buffer(reader.result));
      // // };

      let ipfs_url;
      try {
        const created = await client.add(data);

        ipfs_url = `https://ipfs.infura.io/ipfs/${created.path}`;
      } catch (error) {
        console.log(error);
      }

      console.log("IPFS_URL.....................", ipfs_url);
      let queryData = {
        query: `mutation {
              UpdateProfilePic(profilepicture: "${ipfs_url}", email:"${currentEmail}" ) {
              name
              email
              profilepicture
          }
        }`
      };
      let response = await axios.post(appHost + '/UpdateProfilePic', queryData);
      console.log(response);
      // response = response.data;
      if (response.data.data !== null && response.data.data.UpdateProfilePic !== undefined && response.data.data.UpdateProfilePic !== null) {
          setProfilePictureSrc(ipfs_url);
          let updatedInfo =response.data.data.UpdateProfilePic;
          const token = jwt.sign({ sub: updatedInfo.email }, secretKey, { expiresIn: '7d' });
          localStorage.setItem('user', JSON.stringify({
            userEmail: updatedInfo.email,
            name: updatedInfo.name,
            token,
            profilePicture: ipfs_url
          }));
      }
      toast.dismiss(toastId);
    }
  }




  return (
    <Flex>
      <StakingSideNav profilePicture={profilePictureSrc} userName={currentUserName} />
      <StyledProfile>
        <div className="gradient"></div>
        <h1>Your Profile</h1>
        <div className="profile">
          <div className="profile__top">
            <div className="avatar">
              {profilePictureSrc === null || profilePictureSrc === "" ? (<Image src="/images/Group-69.png" alt="avatar" layout="fill" />) : (
                <Image className="avatar" src={profilePictureSrc} alt="avatar" layout="fill"/>
              )}
            </div>
            <div>
              <h3>Profile Picture</h3>
              <label>
                UPLOAD
                <input type="file" onChange={(img) => getImageFileObject(img)}
                  name="img"
                  accept="image/*" />
              </label>
            </div>
          </div>

          <div id="headerDiv">
            <h2>Change Your Profile Information</h2>
            <br />
            <> {errorMsgType == 1 ? (<a id="errorMsg">Kindly input new value in atleast one field to update the profile!</a>) : (
              errorMsgType == 2 ? (<a id="errorMsg">Current password and new password are same!</a>) : (
                errorMsgType == 3 ? (<a id="errorMsg">Current email and new email are same!</a>) : (
                  errorMsgType == 4 ? (<a id="errorMsg">User with this email already exists!</a>) : (
                    errorMsgType == 5 ? (<a id="errorMsg">Invalid current password!</a>) : (
                      errorMsgType == 6 ? (<a id="errorMsg">Current user name and new user name are same!</a>) : (
                        errorMsgType === 7 ? (<a id="errorMsg">In order to update password both current password and new password fields are required!</a>) : (<></>)
                      )
                    )
                  )
                )
              ))}
            </>
          </div>
          <div className="profile__extras">
            <div>
              {/* <h2>Change Your Profile Information</h2> */}
              <form onSubmit={(e) => e.preventDefault()}>
                <label>
                  <h3>
                    Current user name
                    {/* <span>*</span> */}
                  </h3>
                  <input type="text" value={currentUserName} required disabled />
                </label>
                <label>
                  <h3>
                    Current Email address
                    {/* <span>*</span> */}
                  </h3>
                  <input type="text" value={currentEmail} required disabled />
                </label>
                <label>
                  <h3>
                    Current password
                    <span>*</span>
                  </h3>
                  <input type="password" defaultValue="" onChange={handleCurrentPassword} />
                </label>
                {/* <button type="submit">CHANGE EMAIL</button> */}
              </form>
            </div>
            <div>
              {/* <h2>Change Your Email</h2> */}
              {/* <h2>&nbsp;&nbsp;</h2> */}
              <form onSubmit={updateUserInformation}>
                <label>
                  <h3>
                    New user name
                    <span>*</span>
                  </h3>
                  <input type="text" defaultValue="" onChange={handleNewUserName} />
                </label>
                <label>
                  <h3>
                    New Email address
                    <span>*</span>
                  </h3>
                  <input type="text" defaultValue="" onChange={handleNewEmailAddress} />
                </label>
                <label>
                  <h3>
                    New password
                    <span>*</span>
                  </h3>
                  <input type="password" defaultValue="" onChange={handleNewPassword} />
                </label>


                <div id="UpdInforDiv">
                  <button type="submit">Update Information</button>
                </div>

              </form>
            </div>

          </div>
        </div>
      </StyledProfile>
    </Flex>
  );
}

const Flex = styled.main`
  padding: 12rem 2rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  max-width: 1460px;
  margin: 0 auto;
`;

const StyledProfile = styled.section`
  padding: 0 0 8rem 0;
  min-height: 100vh;
  flex: 1;
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
  .avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    box-shadow: 0 0 5px 4px rgb(0 0 0 / 25%);
    position: relative;
    img {
      object-fit: cover;
    }
  }
  .profile {
    padding: 2rem 0;
    &__top {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      h3 {
        font-size: 1.3rem;
      }
      label {
        display: inline-block;
        margin-top: 0.5rem;
        border: 1px solid ${({ theme }) => theme.secondary};
        color: ${({ theme }) => theme.secondary};
        border-radius: 0.4rem;
        padding: 0.6rem 1rem;
        font-size: 0.75rem;
        background-color: rgba(56, 152, 236, 0);
        transition: all 0.3s ease;
        font-weight: 900;
        cursor: pointer;
        &:hover,
        &:focus {
          color: ${({ theme }) => theme.primary};
          border: 1px solid ${({ theme }) => theme.primary};
          box-shadow: 0 0 3px 1px ${({ theme }) => theme.primary};
        }
        position: relative;
        input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          pointer-events: none;
        }
      }
    }
    &__extras {
      display: flex;
      gap: 1.5rem;
      margin-top: 0.7rem;
      div {
        flex: 1;
        h2 {
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }
      }
      form {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;
        button {
          display: inline-block;
          width: fit-content;
          margin-top: 0.5rem;
          border: 1px solid ${({ theme }) => theme.secondary};
          color: ${({ theme }) => theme.secondary};
          border-radius: 0.4rem;
          padding: 0.6rem 1rem;
          font-size: 0.75rem;
          background-color: rgba(56, 152, 236, 0);
          transition: all 0.3s ease;
          font-weight: 900;
          cursor: pointer;
          &:hover,
          &:focus {
            color: ${({ theme }) => theme.primary};
            border: 1px solid ${({ theme }) => theme.primary};
            box-shadow: 0 0 3px 1px ${({ theme }) => theme.primary};
          }
        }
        h3 {
          font-size: 0.9rem;
          font-weight: bold;
          display: flex;
          /* justify-content: space-between; */
          align-items: center;
          line-height: 1;
          span {
            font-size: 0.8rem;
            margin-left: 0.125rem;
            color: ${({ theme }) => theme.primary};
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
      }
    }
  }
  #UpdInforDiv{
    text-align:right;
  }
  #errorMsg {
    color: ${({ theme }) => theme.error};
    font-size: 1rem;
  }
  #headerDiv{
    margin-top: 3rem;
  }
`;
