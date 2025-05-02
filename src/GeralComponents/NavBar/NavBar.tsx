import React from 'react'
import './Nav.css';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios'

function NavBar() {

    const [isVisible, setIsVisible] = useState(true);
    const [isHidden, setIsHidden] = useState(false);


    useEffect(() => {
      let lastScrollTop = 0;
  
      const handleScroll = () => {
        const currentScroll = window.scrollY;
  
        if (currentScroll > lastScrollTop) {
          setIsVisible(false); 
        } else {
          setIsVisible(true);
          setIsHidden(false);
        }
  
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    function EfetuarLogout()
    {
        axios.post('https://web-production-7ea7.up.railway.app/func/conferelogin/logout', { nome: "Vazio" }, {
            withCredentials: true
          })
            .then(response => {
                window.location.replace('/')
            })
            .catch(error => {
              window.location.replace('/')
            });
    }


    function toggleDropdown() {
        const menu = document.getElementById("dropdownMenu");

        if (menu.classList.contains("invisible")) {
            menu.classList.remove("invisible", "opacity-0", "scale-95");
            menu.classList.add("visible", "opacity-100", "scale-100");
        } else {
            menu.classList.add("opacity-0", "scale-95");
            menu.classList.remove("opacity-100", "scale-100");

            setTimeout(() => {
                menu.classList.add("invisible");
            }, 300);
        }
    }
    return (
        <div
        id="NavBar"
        className={`header grid grid-cols-12 bg-white  ${
          isVisible ? "animate-fadeInUp" : "animate-fadeInDown"
        } ${isHidden ? "hidden" : ""}`
    }  onAnimationEnd={() => {
        if (!isVisible) {
            setTimeout(() => setIsHidden(true),10);
        }
      }}
      >
                <div className="col-span-12 md:col-span-4 p-4 ml-13 md:ml-20 hidden md:block flex items-center">
                    
                </div>
                <div className="col-span-12 md:col-span-4 p-4 flex justify-center"><img src='/logo-furia.svg'></img></div>
                <div className="col-span-12 md:col-span-4 p-4 text-center">
                    <div className="relative inline-block text-left">
                        <button
                            onClick={toggleDropdown}
                            className="bg-black text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition-colors duration-300 ease-in-out"
                        >
                            Opções ▼
                        </button>

                        <div
                            id="dropdownMenu"
                            className="opacity-0 scale-60 invisible transition-all duration-300 ease-out absolute w-35 bg-white shadow-md z-30 mt-3 bg-white shadow-md rounded-md"
                        >
                            <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => { sessionStorage.setItem('telaUser',''); sessionStorage.setItem('permissaoUser',''); EfetuarLogout();}}>Efetuar Logout</a>

                        </div>
                    </div>
                </div>
            </div>

    )
}

export default NavBar