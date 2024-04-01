import React from "react";
import Layout from "../../Layout";
import { StaticImage } from "gatsby-plugin-image";
import * as styles from "./styles.module.scss";
import { Accordion } from "flowbite-react";

const PrivacyPolicy = () => {
  return (
    <Layout pageTitle="Pourquoi RDC-&Eacute;tudes">
      <section className="md:hidden bg-sky-600 -mt-4">
        <div className="grid grid-cols-12 mb-5 mt-4 ">
          <div className="col-span-2"></div>
          <div className="col-span-8 z-20">
            <div className="text-center mx-4 mb-7">
              <StaticImage
                alt="privacy"
                src="../../../images/Blog_PrivacyGenerator_042120_WP-2-removebg-preview.png"
              />
              <span className="text-white text-lg text-center font-extrabold uppercase">
                Politique de confidentialité
              </span>
            </div>
          </div>
          <div className="col-span-2 z-10">
            <div className={styles.ellipse3}>
              <StaticImage
                alt="overlay"
                height={180}
                src="../../../images/Ellipse11.png"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="hidden md:block bg-sky-600 pb-16 -z-[999]">
        <div className="flex">
          <div className="flex">
            <StaticImage
              alt="privacy"
              src="../../../images/privacy-policy-removebg-preview1.png"
            />
            <div className="text-3xl text-white font-extrabold uppercase -ml-72 mt-40 z-20">
              Politique de Confidentialité
            </div>
          </div>

          <div className="right-0 top-[88] absolute">
            <div className="flex">
              <StaticImage
                alt="privacy"
                className="h-[15rem] absolute z-20 mt-48 mr-48"
                src="../../../images/Blog_PrivacyGenerator_042120_WP-2-removebg-preview.png"
              />
              <StaticImage alt="overlay" src="../../../images/Ellipse4.png" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-4 mt-4 mb-10 md:hidden">
        <Accordion>
          <Accordion.Panel>
            <Accordion.Title>Introduction</Accordion.Title>
            <Accordion.Content>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                Devant le développement des nouveaux outils de communication, il
                est nécessaire de porter une attention particulière à la
                protection de la vie privée. C‘est pourquoi, nous nous engageons
                à respecter la confidentialité des renseignements personnels que
                nous collectons.
              </p>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>
              collecte des renseignements personnels
            </Accordion.Title>
            <Accordion.Content>
              <p className="!max-sm:text-base">
                Nous collectons les renseignements suivants :
                <ul className="list-disc ml-5">
                  <li className="py-2">Nom</li>
                  <li className="py-2">Adresse électronique</li>
                </ul>
                Les renseignements personnels que nous collectons sont
                recueillis au travers de formulaires et grâce à l‘interactivité
                établie entre vous et notre site Web. Nous utilisons également,
                comme indiqué dans la section suivante, des fichiers témoins
                et/ou journaux pour réunir des informations vous concernant.
              </p>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>Formulaire et Interactivité</Accordion.Title>
            <Accordion.Content>
              Vos renseignements personnels sont collectés par le biais du
              formulaire de Contact sur chaque page de ce site web Nous
              utilisons les renseignements ainsi collectés pour les finalités
              suivantes :
              <ul className="list-disc ml-5">
                <li className="py-2">Contact</li>
                Vos renseignements sont également collectés par le biais de
                l‘interactivité pouvant s‘établir entre vous et notre site Web
                et ce, de la façon suivante
                <li className="py-2">Contact</li>
                <li className="py-2">Correspondance</li>
                Nous utilisons les renseignements ainsi collectés pour les
                finalités suivantes
              </ul>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel>
            <Accordion.Title>Droit d'Opposition et de Retrait</Accordion.Title>
            <Accordion.Content>
              Nous nous engageons à vous offrir un droit d‘opposition et de
              retrait quant à vos renseignements personnels.Le droit
              d‘opposition s‘entend comme étant la possiblité offerte aux
              internautes de refuser que leurs renseignements personnels soient
              utilisées à certaines fins mentionnées lors de la collecte. Le
              droit de retrait s‘entend comme étant la possiblité offerte aux
              internautes de demander à ce que leurs renseignements personnels
              ne figurent plus, par exemple, dans une liste de diffusion.
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel>
            <Accordion.Title>Droit d'Accès</Accordion.Title>
            <Accordion.Content>
              Nous nous engageons à reconnaître un droit d‘accès et de
              rectification aux personnes concernées désireuses de consulter,
              modifier, voire radier les informations les concernant.L‘exercice
              de ce droit se fera :Code postal : Local 1M3, Nouvelles Galéries
              Présidentielles, Kinshasa, R.D. CongoCourriel :
              salut@rdcetudes.comTéléphone : +243 822 313 039Section du site web
              : https://www.rdcetudes.com/ SÉCURITÉ Les renseignements
              personnels que nous collectons sont conservés dans un
              environnement sécurisé. Les personnes travaillant pour nous sont
              tenues de respecter la confidentialité de vos informations.Pour
              assurer la sécurité de vos renseignements personnels, nous avons
              recours aux mesures suivantes
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel>
            <Accordion.Title>Droit d'Accès</Accordion.Title>
            <Accordion.Content>
              <ul className="list-disc ml-5">
                <li className="py-2">Protocole SSL (Secure Sockets Layer)</li>
                <li className="py-2">Gestion des accès - personne autorisée</li>
                <li className="py-2">Identifiant / mot de passe</li>
              </ul>
              Nous nous engageons à maintenir un haut degré de confidentialité
              en intégrant les dernières innovations technologiques permettant
              d‘assurer la confidentialité de vos transactions. Toutefois, comme
              aucun mécanisme n‘offre une sécurité maximale, une part de risque
              est toujours présente lorsque lon utilise Internet pour
              transmettre des renseignements personnels.
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      </section>

      <section className="mx-20 mt-12 mb-10 hidden md:block">
        <div>
          <span className="text-3xl font-bold">
            La politique de confidentialité de RDC Etudes.
          </span>
          <p className="uppercase text-2xl font-bold py-8">
            Politique de confidentialité
          </p>
          <p className="text-xl">
            IntroductionDevant le développement des nouveaux outils de
            communication, il est nécessaire de porter une attention
            particulière à la protection de la vie privée. C‘est pourquoi, nous
            nous engageons à respecter la confidentialité des renseignements
            personnels que nous collectons.
          </p>
          <p className="uppercase text-2xl font-bold py-6">
            COLLECTE DES RENSEIGNEMENTS PERSONNELS
          </p>
          <p className="text-xl">
            Nous collectons les renseignements suivants :
            <ul className="list-disc ml-5">
              <li className="py-2">Nom</li>
              <li className="py-2">Adresse électronique</li>
            </ul>
            Les renseignements personnels que nous collectons sont recueillis au
            travers de formulaires et grâce à l‘interactivité établie entre vous
            et notre site Web. Nous utilisons également, comme indiqué dans la
            section suivante, des fichiers témoins et/ou journaux pour réunir
            des informations vous concernant.
          </p>

          <p className="uppercase text-2xl font-bold py-4">
            FORMULAIRES ET INTERACTIVITÉ
          </p>
          <p className="text-xl">
            Vos renseignements personnels sont collectés par le biais du
            formulaire de Contact sur chaque page de ce site web Nous utilisons
            les renseignements ainsi collectés pour les finalités suivantes :
            <ul className="list-disc ml-5">
              <li className="py-2">Contact</li>
              Vos renseignements sont également collectés par le biais de
              l‘interactivité pouvant s‘établir entre vous et notre site Web et
              ce, de la façon suivante
              <li className="py-2">Contact</li>
              <li className="py-2">Correspondance</li>
              Nous utilisons les renseignements ainsi collectés pour les
              finalités suivantes
            </ul>
            <p className="uppercase text-2xl font-bold py-4">
              DROIT D‘OPPOSITION ET DE RETRAIT
            </p>
            Nous nous engageons à vous offrir un droit d‘opposition et de
            retrait quant à vos renseignements personnels.Le droit d‘opposition
            s‘entend comme étant la possiblité offerte aux internautes de
            refuser que leurs renseignements personnels soient utilisées à
            certaines fins mentionnées lors de la collecte. Le droit de retrait
            s‘entend comme étant la possiblité offerte aux internautes de
            demander à ce que leurs renseignements personnels ne figurent plus,
            par exemple, dans une liste de diffusion. Pour pouvoir exercer ces
            droits, vous pouvez contacter:Code postal: Local 1M3, Nouvelles
            Galéries Présidentielles, Kinshasa, R.D. CongoCourriel :
            salut@rdcetudes.comTéléphone : +243 822 313 039Section du site web :
            https://www.rdcetudes.com/
            <p className="uppercase text-xl font-bold py-2">DROIT D‘ACCÈS</p>
            Nous nous engageons à reconnaître un droit d‘accès et de
            rectification aux personnes concernées désireuses de consulter,
            modifier, voire radier les informations les concernant.L‘exercice de
            ce droit se fera :Code postal : Local 1M3, Nouvelles Galéries
            Présidentielles, Kinshasa, R.D. CongoCourriel :
            salut@rdcetudes.comTéléphone : +243 822 313 039Section du site web :
            https://www.rdcetudes.com/ SÉCURITÉ Les renseignements personnels
            que nous collectons sont conservés dans un environnement sécurisé.
            Les personnes travaillant pour nous sont tenues de respecter la
            confidentialité de vos informations.Pour assurer la sécurité de vos
            renseignements personnels, nous avons recours aux mesures suivantes
            :
            <ul className="list-disc ml-5">
              <li className="py-2">Protocole SSL (Secure Sockets Layer)</li>
              <li className="py-2">Gestion des accès - personne autorisée</li>
              <li className="py-2">Identifiant / mot de passe</li>
            </ul>
            Nous nous engageons à maintenir un haut degré de confidentialité en
            intégrant les dernières innovations technologiques permettant
            d‘assurer la confidentialité de vos transactions. Toutefois, comme
            aucun mécanisme n‘offre une sécurité maximale, une part de risque
            est toujours présente lorsque lon utilise Internet pour transmettre
            des renseignements personnels.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
