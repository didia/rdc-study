import React from 'react';
import overlay4 from "../../images/png-clipart-black-airway.png";

const ContactForm = ({ title, bgImg, marginBottom }) => {
    return (
      <>
        <section className={marginBottom}>
          <div className="text-center mx-10">
            <span
              style={{
                color: "#0490DF",
                fontWeight: "900",
                fontSize: "28px",
                lineHeight: "27px",
              }}
            >
              Besoin d'un service ?
            </span>{" "}
            <p>Lorem ispum dolor fortuna simpre cresis, out decresis vita</p>
          </div>

          <div>
            <div class="flex justify-center w-full z-10 absolute">
              <div className="">
                <div>
                  <input
                    type="text"
                    className=""
                    style={{
                      width: "300px",
                      height: "40px",
                      border: "1.5px solid #0490DF",
                      borderRadius: "5px",
                      backgroundColor: "#ECEAEA",
                      paddingLeft: "20px",
                    }}
                    placeholder="Nom"
                  />
                </div>

                <div className="py-4">
                  <input
                    type="text"
                    className=""
                    style={{
                      width: "300px",
                      height: "40px",
                      border: "1.5px solid #0490DF",
                      borderRadius: "5px",
                      backgroundColor: "#ECEAEA",
                      paddingLeft: "20px",
                    }}
                    placeholder="Adresse E-mail"
                  />
                </div>

                <div>
                  <textarea
                    style={{
                      width: "300px",
                      height: "120px",
                      border: "1.5px solid #0490DF",
                      borderRadius: "5px",
                      backgroundColor: "#ECEAEA",
                      paddingLeft: "20px",
                      paddingTop: "20px",
                    }}
                  >
                    Message
                  </textarea>
                </div>

                <div className="py-4">
                  <button class="bg-sky-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
            <div class="w-full h-full mt-10">
              <img src={bgImg ? bgImg : overlay4} />
            </div>
          </div>
        </section>
      </>
    );
}
 
export default ContactForm;