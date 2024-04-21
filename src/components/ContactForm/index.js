import React, {useEffect} from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import * as styles from "./styles.module.scss";
import PrimaryBtn from '../Button/Primary';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import axios from 'axios';
import 'animate.css';
import {ToastContainer, toast, Slide} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const ContactForm = ({ title, bgImg, marginBottom }) => {
  const notify = () => toast("Wow so easy!");
    const [serverResponse, setServerResponse] = React.useState(``);
    const name = React.useRef('')
    const email = React.useRef("");
    const message = React.useRef("");
    const toastId = React.useRef(null);

    async function submiForm(e) {
        e.preventDefault();
        const toastId = toast.loading("Envoi en cours....")
        
        // setTimeout(() => {
        //   toast.dismiss({ id: toastId });
        //   toast.success("Merci de nous écrire !", {
        //     position: "top-left",
        //     id: toastId,
        //     autoClose: 1500
        //   });  
        // }, 2500);
        // return;
        
        const data = {
          name: name.current.value,
          email: email.current.value,
          message: message.current.value
        }
        const response = await axios
          .post("/api/contact-form", data, {
            headers: {
              "Content-Type": "application/json",
            },
            // onDownloadProgress: (p) => {
            //   const progress = p.loaded / p.total;
            //     if (toastId.current === null) {
            //       toastId.current = toast("Upload in Progress", { progress });
            //     } else {
            //       toast.update(toastId.current, { progress });
            //     }
            // }
          })
          .then((res) =>{
             console.log("res", res)
             toast.dismiss({ id: toastId });
             toast.success("Merci de nous écrire !", {
               position: "top-left",
               id: toastId,
               autoClose: 1500,
             });
            })
          .catch((err) => console.log("err", err));
          setServerResponse(response);
      }
    return (
      <>
        <ToastContainer
          position="top-left"
          //autoClose={5000}
          transition={Slide}
          className={"w-[22rem]"}
        />
        <section className={marginBottom + " md:hidden mt-12"}>
          <div className="text-center mx-10 z-10">
            <span className="text-[#4bb4d4] text-2xl font-semibold font-['roboto']">
              Besoin d'un service ?
            </span>{" "}
            <p className="py-4 font-['roboto']">
              Avez-vous des questions ou besoin d’informations supplémentaires?
              N’hésitez donc pas de nous contacter, de préférence à travers nos
              médias sociaux.
            </p>
          </div>

          <div>
            <div className="flex justify-center w-full z-10 absolute">
              <div className="">
                <div>
                  <input
                    type="text"
                    className={`font-['roboto'] ${styles.form__input}`}
                    placeholder="Nom"
                  />
                </div>

                <div className="py-4">
                  <input
                    type="text"
                    className={`font-['roboto'] ${styles.form__input}`}
                    placeholder="Adresse E-mail"
                  />
                </div>

                <div>
                  <textarea
                    className={`font-['roboto'] ${styles.form__textarea}`}
                    aria-label="Message"
                    defaultValue={"Message"}
                  />
                </div>

                <div className="py-4">
                  <button className="bg-[#4bb4d4] hover:bg-blue-700 text-white font-light py-2 px-4 rounded-md">
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.form__overlayImg}>
              <StaticImage
                alt="airway"
                src="../../images/png-clipart-black-airway.png"
              />
            </div>
          </div>
        </section>

        <section className="hidden md:flex">
          <div className="grid grid-cols-2 my-16">
            <div>
              <div className="text-center z-10 ml-40">
                <span className="text-[#4bb4d4] text-4xl max-[1384px]:text-4xl font-semibold font-['monserrat']">
                  Besoin d'un service ?
                </span>{" "}
                <p className="py-4 text-xl font-['roboto']">
                  Avez-vous des questions ou besoin d’informations
                  supplémentaires? N’hésitez donc pas de nous contacter, de
                  préférence à travers nos médias sociaux.
                </p>
              </div>

              <div className="mt-12">
                <div className="flex justify-center w-full z-30 ml-20">
                  <form className="" onSubmit={submiForm} method="POST">
                    <div>
                      <input
                        type="text"
                        className={styles.form__input2}
                        placeholder="Nom"
                        ref={name}
                      />
                    </div>

                    <div className="py-4">
                      <input
                        type="email"
                        className={styles.form__input2}
                        placeholder="Adresse E-mail"
                        ref={email}
                      />
                    </div>

                    <div>
                      <textarea
                        className={styles.form__textarea2}
                        aria-label="Message"
                        ref={message}
                      />
                    </div>

                    <div className="py-4">
                      <PrimaryBtn
                        type={"submit"}
                        text={"Soumettre"}
                        fontSize={"lg"}
                      />
                    </div>
                  </form>
                </div>
                <div className={styles.form__overlayImg3}>
                  <StaticImage
                    alt="airway"
                    height={400}
                    src="../../images/Ellipse3.png"
                  />
                </div>
              </div>
            </div>

            <div className="">
              <StaticImage
                className="float-right absolute right-0 -mt-20"
                alt="airway"
                height={300}
                width={300}
                src="../../images/png-clipart-black-airway-aviation-aircraft.png"
              />
              <div className="absolute h-[35rem] w-[20rem] ml-40">
                <AnimationOnScroll animateIn="animate__bounceIn">
                  <StaticImage
                    alt="airway"
                    src="../../images/smiley-femme-bagage-rouge-coup-moyen.png"
                  />
                </AnimationOnScroll>
              </div>
              <StaticImage
                className="relative float-right mt-40 -z-30"
                alt="airway"
                height={400}
                src="../../images/Ellipse4.png"
              />
            </div>
          </div>
        </section>
      </>
    );
}
 
export default ContactForm;