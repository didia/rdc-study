import React from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const TeamCard = ({ member}) => {
    const image = getImage(member.image)
    return (
      <div className="flex items-center justify-center mx-4 mb-24">
        <div className="relative w-full group max-w-md min-w-0 mx-auto mt-6 mb-6 break-words bg-white border shadow-2xl dark:bg-gray-800 dark:border-gray-700 md:max-w-sm rounded-xl">
          <div className="pb-6">
            <div className="flex flex-wrap justify-center">
              <div className="flex justify-center w-full">
                <div className="relative">
                  <GatsbyImage
                    objectFit="cover"
                    image={image}
                    className="h-36 w-36 border-white rounded-full align-middle border-8 absolute -m-16 -ml-18 lg:-ml-16 max-w-[150px]"
                  />
                </div>
              </div>
            </div>
            <div className="mt-20 text-center">
              <h3 className="mb-1 text-2xl font-bold leading-normal text-gray-700 dark:text-gray-300">
                {member.name}
              </h3>
              <div className="flex flex-row justify-center w-full mx-auto space-x-2 text-center">
                <div className="text-sm font-bold tracking-wide text-gray-600 dark:text-gray-300 font-mono">
                  {member.title.length < 44 ? (
                    <p>
                      {member.title}
                      <br />
                      <br />
                    </p>
                  ) : (
                    member.title
                  )}
                </div>
              </div>
              <div className="w-full text-center">
                <div className="flex justify-center pt-2 pb-0 lg:pt-4">
                  <div className="flex space-x-2">
                    <a
                      className="p-1 -m-1 text-gray-400 hover:text-amber-500 focus:outline-none focus-visible:ring-2 ring-primary"
                      href="https://cd.linkedin.com/company/rdcetudes"
                      rel="noopener"
                      aria-label="Ariel Cerda on Twitter"
                      target="_blank"
                    >
                      <svg
                        className="w-6 h-6 overflow-visible fill-current"
                        alt=""
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </a>

                    <a
                      className="p-1 -m-1 text-gray-400 hover:text-amber-500 focus:outline-none focus-visible:ring-2 ring-primary"
                      href="https://www.facebook.com/rdcetudes/"
                      rel="noopener"
                      aria-label="Ariel Cerda on Linkedin"
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 45 45"
                        className="w-6 h-6 overflow-visible fill-current"
                      >
                        <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z"></path>
                      </svg>
                    </a>

                    <a
                      className="p-1 -m-1 text-gray-400 hover:text-amber-500 focus:outline-none focus-visible:ring-2 ring-primary"
                      href="https://twitter.com/rdcetudes"
                      rel="noopener"
                      aria-label="Ariel Cerda on Linkedin"
                      target="_blank"
                    >
                      <svg
                        className="w-6 h-6 overflow-visible fill-current"
                        alt=""
                        aria-hidden="true"
                        viewBox="0 0 140 140"
                      >
                        <path d="M23.4 44.59h-4.75a12.76 12.76 0 00-9.73 2.19 9.44 9.44 0 00-2.35 7.12V131a9.08 9.08 0 002.3 7 9.24 9.24 0 006.82 2c2.22 0 4.15-.21 8.24-.06a12 12 0 009.25-2 9.1 9.1 0 002.29-7V53.9a9.44 9.44 0 00-2.34-7.12 12.68 12.68 0 00-9.73-2.19zM21 0A16.19 16.19 0 005.09 15.6 16.52 16.52 0 0021 31.86 16.12 16.12 0 0037 15.6 16.18 16.18 0 0021 0zM99.74 43.63a31.09 31.09 0 00-20.93 6.3A7.25 7.25 0 0077 46.34a6.08 6.08 0 00-4.52-1.78 119.08 119.08 0 00-15 .3c-4.16.84-6.18 3.79-6.18 9V131a9.14 9.14 0 002.28 7 12.06 12.06 0 009.26 2c4.47-.17 5.74.06 8.22.06a9.26 9.26 0 006.83-2 9.12 9.12 0 002.3-7V89.88A12.48 12.48 0 0192.93 76 12.44 12.44 0 01106 89.88V131a9.1 9.1 0 002.29 7 12 12 0 009.24 2c1.83-.07 4-.07 5.8 0a12.09 12.09 0 009.26-2 9.14 9.14 0 002.28-7V78.32a33.07 33.07 0 00-35.13-34.69z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:h-[350px] pt-3 mt-3 text-center border-t border-gray-200 dark:border-gray-700/50">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4">
                  <p className="font-light text-base leading-relaxed text-gray-600 dark:text-gray-400">
                    {member.about}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative h-6 overflow-hidden translate-y-6 rounded-b-xl">
              <div className="absolute flex -space-x-12 rounded-b-2xl">
                <div className="w-36 h-8 transition-colors duration-200 delay-75 transform skew-x-[35deg] bg-sky-400/90 group-hover:bg-[#4bb4d4]/90 z-10"></div>
                <div className="w-28 h-8 transition-colors duration-200 delay-100 transform skew-x-[35deg] bg-sky-300/90 group-hover:bg-sky-500/90 z-20"></div>
                <div className="w-28 h-8 transition-colors duration-200 delay-150 transform skew-x-[35deg] bg-sky-200/90 group-hover:bg-sky-400/90 z-30"></div>
                <div className="w-28 h-8 transition-colors duration-200 delay-200 transform skew-x-[35deg] bg-sky-100/90 group-hover:bg-sky-300/90 z-40"></div>
                <div className="w-28 h-8 transition-colors duration-200 delay-300 transform skew-x-[35deg] bg-sky-50/90 group-hover:bg-sky-200/90 z-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default TeamCard;