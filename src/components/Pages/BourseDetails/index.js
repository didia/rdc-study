import React from "react";
import Layout from "../../Layout";
import BourseCard from "../../BourseCard";
import { StaticImage } from "gatsby-plugin-image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faGlobe, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

const BourseDetails = () => {
  return (
    <Layout pageTitle={"Détails sur la bourse d'études"}>
      <section>
        <div className="grid grid-cols-1 mx-10 py-10">
          <div>
            <StaticImage
              alt="gallery"
              class="block h-full w-full rounded-sm object-cover object-center"
              src="../../../images/800x600_FE_WEB_equivalence 2.jpg"
            />
          </div>
        </div>
        <div className="mx-10">
          <p className="text-sky-600 text-xl font-bold text-start">
            Bourses d’excellence pour chercheurs et artistes étrangers en Suisse
          </p>
          <p className="py-3 text-sm">
            La Confédération suisse offre chaque année des bourses d’excellence
            dans le domaine de la recherche et des arts.
          </p>
          <div className="grid grid-cols-3">
            <div className="text-sm">
              {" "}
              <FontAwesomeIcon icon={faGlobe} /> Canada
            </div>
            <div className="inline text-sm">
              {" "}
              <FontAwesomeIcon icon={faClock} />
              <span className="px-2">Doctorat, Recherche</span>
            </div>
            <div className="text-sm">
              {" "}
              <FontAwesomeIcon icon={faGraduationCap} />
              <span className="px-2 text-red-600">Expire en Décembre</span>
            </div>
          </div>
          <p className="py-2 font-bold text-sm">
            En quoi consiste la bourse d'étude ?
          </p>
          <p className="py-4 text-sm">
            <span className="font-bold">
              La bourse de la conférence suisse offre :
            </span>

            <ul className="list-disc ml-5">
              <li className="py-2">
                Un paiement de 1920 Francs suisses (à peu près 1920 $) par mois
              </li>
              <li className="py-2">Les frais académiques sont payés.</li>
              <li className="py-2">
                Un billet d’avion retour vers votre pays d’origine payé à la fin
                de votre séjour d’études.
              </li>
              <li>
                Un paiement de 300 Francs suisses (à peu près 300 $) payé une
                fois à votre arrivée pour aider avec le logement
              </li>
              <li>La moitié de votre carte de transport.</li>
            </ul>
          </p>{" "}
          <p className="text-sm font-bold">
            Le délai de la bourse varie d’un pays à l’autre et d’une bourse à
            une autre. Pour d’informations, vous pouvez vous renseigner auprès
            <span className="underline">
              de l’ambassade de Suisse de votre pays.
            </span>
          </p>
          <p className="py-2 font-bold text-sm">
            Quels sont les critères de la bourse ?
          </p>
          <p className="py-4">
            La CFBE examine les demandes de bourse selon les trois critères
            suivants:
          </p>
          <ul className="list-decimal ml-5">
            <li className="">Le profil du candidat;</li>
            <li className="">
              La qualité du projet de recherche ou travail artistique;
            </li>
            <li className="">
              les synergies et le potentiel pour une future collaboration.
            </li>
          </ul>
          <p className="py-4">
            Les critères précis auxquels vous devez répondre variant d’une
            bourse à une autre:
          </p>
          <ul className="list-decimal ml-5">
            <li className="">Pour la bourse de Recherche</li>
            <li className="">Pour la bourse doctorale</li>
            <li className="">Pour la bourse Postdoctorale</li>
          </ul>
          <p className="text-sm py-2 font-bold">Comment postuler ?</p>
          <p className="text-lg py-2 font-bold">Edure de demande</p>
        </div>

        <div className="mx-10 mb-10">
          <StaticImage
            className="w-full"
            alt="bourse"
            src="../../../images/procedure-bourse-suisse1.png"
          />
        </div>

        <div className="mx-10 mb-10 text-sm text-justify">
          L’information sur les bourses disponibles pour votre pays, comment
          postuler et quels documents envoyer sont disponibles dans un dossier
          préparée pour votre pays. Nous vous invitons à télécharger le dossier
          sur le site web de la bourse d’études.
          <p className="py-2">
            Si la première lettre du nom de votre pays est comprise entre A et
            L: Allez sur
            <a href="#" className="font-bold">
              https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships/countrys-a---l.html
            </a>
          </p>
          <p className="py-2">
            Si la première lette du nom de votre pays est comprise entre M et Z:
            Allez sur
            <a href="#" className="font-bold">
              https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships/countrys-m---z.html.
            </a>
          </p>
          Pour plus d’informations sur la bourse, vous pouvez consulter le guide
          de candidature.
        </div>
      </section>

      <section>
        <div className="grid grid-cols-2 mx-4 mb-10 gap-4">
          <BourseCard/>
          <BourseCard/>
          <BourseCard/>
          <BourseCard/>
        </div>
      </section>
    </Layout>
  ); 
};

export default BourseDetails;
