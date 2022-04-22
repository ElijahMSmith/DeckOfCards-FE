import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {createContext, useEffect, useState} from 'react';
import {BASE_URL} from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  const [gameStateC, setGameStateC] = useState({});
  const [socketC, setSocketC] = useState({});

  const register = (username, email, password) => {
    //setIsLoading(true);

    axios
      .post(`${BASE_URL}/user/register`, {
        username,
        email,
        password,
      })
      .then(res => {
        let userInfo = res.data;
        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setIsLoading(false);
        console.log(userInfo);
      })
      .catch(e => {
        console.log(`register error ${e}`);
        setIsLoading(false);
      });
  };

  const login = (email, password) => {
    //setIsLoading(true);

    axios
      .post(`${BASE_URL}/user/login`, {
        email,
        password,
      })
      .then(res => {
        let userInfo = res.data;
        console.log(userInfo);
        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setIsLoading(false);
      })
      .catch(e => {
        console.log(`login error ${e}`);
        setIsLoading(false);
      });
  };

  const logout = () => {
    //setIsLoading(true);

    axios
      .post(
        `${BASE_URL}/user/logout`,
        {},
        {
          headers: {'Authorization': 'Bearer ' + `${userInfo.token}`},
        },
      )
      .then(res => {
        console.log(res.data);
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
        console.log("logged out successfully")
      })
      .catch(e => {
        console.log(`logout error ${e.message}`);
        setIsLoading(false);
        console.log(`${userInfo.token}`)
      });
  };

  const isLoggedIn = async () => {
    try {
      //setSplashLoading(true);

      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);
      if (userInfo) {
        setUserInfo(userInfo);
      }

      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);
      console.log(`is logged in error ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        splashLoading,
        register,
        login,
        logout,
        gameStateC,
        setGameStateC,
        socketC,
        setSocketC,
      }}>
      {children}
    </AuthContext.Provider>
  );
};