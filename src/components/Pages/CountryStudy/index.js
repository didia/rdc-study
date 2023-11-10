import React from "react";
import Layout from "../../Layout";
import * as styles from "./styles.module.scss";
import overlay4 from "../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png";

import img_franceFlag from "../../../images/580b585b2edbce24c47b27ff.png";
import img_graduated from "../../../images/depositphotos_42487119-stock-photo-good-looking-african-graduate.png";

const CountryStudy = () => {
  return (
    <Layout pageTitle={"Etudier en France"}>
      <section className="mb-12">
        <div className="grid grid-cols-12 text-center">
          <div className="col-span-1">
            <div className={styles.ellipse2}>
              <img src={overlay4} style={{ height: "170px" }} />
            </div>
          </div>
          <div className="col-span-8 ml-20 z-10 mt-5">
            <p className="text-sky-600 text-xl font-extrabold text-center">
              Etudier en France
            </p>
            <p className="text-justify text-xs">
              La France offre un enseignement de qualité qui possède plusieurs
              ressemblances avec plusieurs systèmes d’enseignement africains.
            </p>
          </div>
          <div className="col-span-3 mt-7">
            <img src={img_franceFlag} />
          </div>
        </div>

        <div className="h-20 border-b-2 border-sky-600 mx-8"></div>
        <div className="py-5 mx-8">
          <p className="uppercase font-bold text-sm text-start">
            Que faut-il pour étudier en france ?
          </p>

          <p className="py-2 text-justify">
            Pour étudier en Belgique, il faut généralement commencer par obtenir
            une équivalence de vos diplômes obtenus à l’extérieur de la
            Belgique, à moins que vous ayez obtenu votre diplôme dans une école
            dispensant un programme belge.Ensuite, vous devez déposer une
            demande d’admission auprès d’une université belge.Les demandes
            d’admission doivent être généralement faites entre le 15 février et
            le 30 avril de chaque année mais certaines universités permettent de
            le faire plus tôt.La majeure partie d’universités permet de faire la
            demande d’admission en ligne. Vous devez donc avoir une connexion
            internet et une dose de volonté.Quelques universités vous sont
            proposées dans &nbsp;
            <a className="underline">
              notre guide sur les démarches à suivre pour obtenir une admission
              dans une université belge.
            </a>{" "}
            &nbsp; Une fois l’admission obtenue, il faudra faire une demande de
            visa auprès du centre européen de visa (Maison Schengen).Pour
            obtenir votre visa, vous devrez convaincre l’officier consulaire que
            vous êtes un étudiant qualifié, que vous accomplirez vos études et
            que vous reviendrez dans votre pays d’origine après avoir terminé
            vos études.En outre, vous devez prouver que vous disposez de fonds
            suffisants pour couvrir la première année de vos études et que vous
            aurez accès à des fonds suffisants pour couvrir les années d’études
            suivantes.Pour en savoir plus,
            <a className="underline">
              {" "}
              consultez notre guide sur les démarches à suivre pour obtenir un
              visa d’étudiant pour la Belgique.
            </a>{" "}
            <p className="uppercase font-bold text-sm text-start py-4">
              Combien coûtent les études en france ?
            </p>
            <p className="text-justify">
              Les frais académiques réguliers en Belgique s’élèvent actuellement
              à 835€.Toutefois certaines universités majorent les frais
              académiques pour étudiants internationaux. Ainsi les frais peuvent
              varier entre 835€ et 4200€ par année tandis qu’il faut prévoir en
              moyenne entre 8 000€ et 12 500€ pour les frais de subistances par
              année.
            </p>
            <p className="uppercase font-bold text-sm text-start py-4">
              QU’EN EST-IL DE BOURSES D’ÉTUDES?
            </p>
            <p className="text-justify">
              Des bourses sont offertes par des organismes tels que l’ARES ou le
              VLIRUOS pour les cycles supérieurs c’est-à-dire master ou
              doctorat. Nous vous invitons à vous consulter leurs sites web pour
              en savoir plus.Cependant il est extrêmement difficile de trouver
              des bourses d’études pour le premier cycle, néanmoins certaines
              universités offrent des bourses d’excellence aux étudiants admis
              chez elles. Vous devrez vérifier si c’est le cas avec l’université
              que vous aurez choisie.
            </p>
            <p className="uppercase font-bold text-sm text-start py-4">
              COMBIEN COÛTENT LES DÉMARCHES?
            </p>
            <p className="text-justify">
              En supposant que vous choisissez d’être accompagné dans vos
              démarches par un mentor de RDC-Etudes, vous devez prévoir entre
              1570 USD et 2480 USD pour toutes vos démarches. Ces frais se
              présentent comme suit: 0 à 380 USD pour le processus d’admission.
              970 USD à 1200 USD pour le processus de visa. 599.98 USD à 899.97
              USD pour les frais d’assistance RDC Etudes. (400 USD pour chaque
              service: Equivalence, Admission et Visa) NB: Ces montants ne sont
              qu’une estimation des coûts réels, ils peuvent changer par rapport
              à votre location, aux universités ou encore s’ils sont changés par
              le gouvernement belge. Veuillez toujours vous fier à leurs sites
              web pour les montants actualisés.
            </p>
            <div className="border-b-2 border-sky-600 py-4"></div>
            <p className="uppercase font-bold text-sm text-start py-4">
              NOUS SOMMES LÀ POUR VOUS!
            </p>
            <p className="text-justify">
              Nous savons combien votre projet d’études est important pour vous,
              que vous voulez certainement mettre toutes les chances de votre
              côté pour que votre rêve d’étudier à l’étranger s’accomplisse.
              C’est pour cette raison qu’en plus de ces informations, nous vous
              offrons un service d’assistance dont l’objectif est de vous aider
              à monter le meilleur dossier possible pour vos démarches.
            </p>
            <p className="py-4">
              <button className="bg-sky-600 text-white py-4 px-10 rounded-full uppercase text-xs">
                Demander une assistance
              </button>
            </p>
            <p className="uppercase font-bold text-sm text-start py-4">
              Guides réliés
            </p>
            <div className="border-b-2 border-sky-600"></div>
          </p>
        </div>
        <div>
          <div className="grid grid-cols-1 mx-10 py-7">
            <div>
              <img
                alt="gallery"
                class="block h-full w-full rounded-sm object-cover object-center"
                src={img_graduated}
              />
            </div>
          </div>

          <div className="mx-10 text-justify">
            <p className="text-sky-600 text-xl font-bold uppercase">
              étudier au canada
            </p>
            <p className="py-2">
              Lorem ipsum dolor sit amet consectetur. Neque duis cras lectus non
              habitant et. At morbi volutpat sit eget luctus sed tellus dolor
              amet. Gravida amet mi pellentesque nisl tempor eget volutpat
              pulvinar. Lorem ipsum dolor sit amet consectetur. Neque duis cras
              lectus non habitant et..
            </p>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 mx-10 py-7">
            <div>
              <img
                alt="gallery"
                class="block h-full w-full rounded-sm object-cover object-center"
                src={img_graduated}
              />
            </div>
          </div>

          <div className="mx-10 text-justify">
            <p className="text-sky-600 text-xl font-bold uppercase">
              étudier au canada
            </p>
            <p className="py-2">
              Lorem ipsum dolor sit amet consectetur. Neque duis cras lectus non
              habitant et. At morbi volutpat sit eget luctus sed tellus dolor
              amet. Gravida amet mi pellentesque nisl tempor eget volutpat
              pulvinar. Lorem ipsum dolor sit amet consectetur. Neque duis cras
              lectus non habitant et..
            </p>
          </div>
        </div>
        
      </section>
    </Layout>
  );
};

export default CountryStudy;
