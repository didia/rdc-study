import React, { useEffect, useState } from 'react';
import * as style from "./styles.module.scss";

const Menu = () => {
    return (
      <>
          <nav className={style.navbar}>
            <ul className={style["navlinks"]}>
              <input
                className={style.checkbox}
                type="checkbox"
                id="checkbox_toggle"
              />

              <label htmlFor="checkbox_toggle" className={style.hamburger}>
                &#9776;
              </label>

              <div className={style.menu}>
                <nav
                  class="lg:block xs:hidden relative flex flex-wrap items-center justify-between px-20 py-1 mb-2"
                  style={{
                    backgroundColor: "transparent",
                    position: "absolute",
                    zIndex: "3",
                    width: "100%",
                    height: "80px",
                    borderBlockEndColor: "#0d9488",
                    borderBlockEndWidth: "2px",
                  }}
                >
                  <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
                    <div class="w-full relative flex justify-between lg:w-auto  px-4 lg:static lg:block lg:justify-start">
                      <a
                        class="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
                        href=""
                      >
                        <img
                          class="hidden h-12 w-auto lg:block"
                          src=""
                          alt="Elite"
                        />
                      </a>
                      <button
                        class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                        type="button"
                      >
                        <span class="block relative w-6 h-px rounded-sm bg-white"></span>
                        <span class="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
                        <span class="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
                      </button>
                    </div>
                    <div
                      class="lg:flex flex-grow items-center "
                      id="centerMenu"
                    >
                      <ul class="flex flex-col lg:flex-row list-none ml-auto">
                        <li class="nav-item">
                          <a
                            class=" bg-teal-600 hover:bg-teal-600 
                                                    hover:text-white rounded-md px-9 py-2 
                                                    flex items-center text-xs uppercase 
                                                    font-bold leading-snug text-white
                                                    active:bg-teal-600 focus:outline-none focus:bg-teal-600"
                            href=""
                            aria-current="page"
                          >
                            Acceuil
                          </a>
                        </li>
                        <li class="nav-item">
                          <a
                            class="    hover:text-teal-600 px-9 py-2 
                                                    flex items-center text-xs uppercase 
                                                    font-bold leading-snug text-white"
                            href="#formations"
                          >
                            Formations
                            <span class="ml-2 w-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                class="h-5 w-5"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </span>
                          </a>
                        </li>
                        <li class="nav-item">
                          <a
                            class=" hover:bg-teal-600 hover:text-white 
                                                    rounded-md px-9 py-2 flex items-center 
                                                    text-xs uppercase font-bold leading-snug text-white
                                                    active:bg-teal-600 focus:outline-none focus:bg-teal-600"
                            href=""
                          >
                            A propos
                          </a>
                        </li>

                        <li class="nav-item">
                          <a
                            class="hover:bg-teal-600 hover:text-white 
                                                rounded-md px-9 py-2 flex items-center 
                                                text-xs uppercase font-bold leading-snug text-white
                                                active:bg-teal-600 focus:outline-none focus:bg-teal-600"
                            href=""
                          >
                            Contacts
                          </a>
                        </li>
                      </ul>

                      <ul class="flex flex-col lg:flex-row list-none ml-auto">
                        <li class="nav-item">
                          <a
                            class="hover:bg-teal-600 hover:text-white rounded-md px-2 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                            href="https://www.facebook.com/elitescd/"
                          >
                            <img
                              class="h-5 w-5 rounded-full"
                              src=""
                              alt=""
                            />
                          </a>
                        </li>
                        <li class="nav-item">
                          <a
                            class="hover:bg-teal-600 hover:text-white rounded-md px-2 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                            href="https://www.linkedin.com/company/academie-des-elites/"
                          >
                            <img
                              class="h-5 w-5 rounded-full"
                              src=""
                              alt=""
                            />
                          </a>
                        </li>

                        <li class="nav-item">
                          <a
                            class="hover:bg-teal-600 hover:text-white rounded-md px-2 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                            href="https://twitter.com/AcademieElites?s=09"
                          >
                            <img
                              class="h-5 w-5 rounded-full"
                              src=""
                              alt=""
                            />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>
              </div>
            </ul>
          </nav>
      </>
    );
}

export default Menu;