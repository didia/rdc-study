import React from "react";
import Layout from "../../Layout";
import { StaticImage } from "gatsby-plugin-image";

const FAQ = () => {
  return (
    <Layout pageTitle="FAQ">
      <section>
        <div class="relative h-60 w-full bg-sky-600">
          <div className="absolute">
            <StaticImage alt="question" src="../../../images/question.png" />
          </div>
          <div className="absolute py-20 pl-10 text-center text-white text-xl font-bold uppercase z-20">
            Questions populaires
          </div>
          <div class="absolute bottom-0 right-0">
            <StaticImage
              src="../../../images/faq.png"
              alt="img student"
              width={150}
            />
          </div>
        </div>
      </section>

      <section className="mx-10 mt-4 mb-20">
        <div className="text-justify">
          <span className="text-lg font-bold">
            Voici les réponses aux questions les plus souvent posées.
          </span>
          <p className="uppercase text-lg font-bold py-2">
            Qu’est-ce que RDC Études ?{" "}
          </p>
          RDC Etudes est une plateforme qui met gratuitement à votre disposition
          les informations nécessaires pour vos démarches d‘études à l’étranger.
          RDC Etudes peut aussi vous accompagner dans vos démarches d’admission
          et d’obtention des visas moyennant des frais d‘accompagnement.\ Pour
          en savoir plus sur RDC Etudes, consultez notre page à propos.
          <p className="uppercase text-lg font-bold py-2">
            Comment nous contacter ?{" "}
          </p>
          Vous pouvez nous contacter par courriel salut@rdcetudes.com ou par
          messagerie facebook. Faut-il payer pour accéder aux guides des
          démarches offerts par RDC Etudes? Non! Les guides des démarches sur
          notre site web sont complètement gratuits. Vous n‘avez pas besoin de
          dépenser un seul sou pour vos démarches. Toutefois si vous avez besoin
          d‘être accompagné dans vos démarches, RDC Etudes vous offre un service
          d‘accompagnement qui est payant. Pour en savoir plus sur notre service
          d’accompagnement, consultez notre page sur l’accompagnement.
          <p className="uppercase text-lg font-bold py-2">
            Quels sont les pays pour lesquels vous offrez votre service
            d’accompagnement ?{" "}
          </p>
          Actuellement, nous pouvons vous aider à faire les démarches pour le
          Canada, les États-Unis et la Belgique.
          <p className="uppercase text-lg font-bold py-2">
            Que dois-je faire pour obtenir une admission et un visa pour étudier
            à l’étranger ?
          </p>{" "}
          Pour obtenir une admission et un visa, vous devez commencer par
          choisir un ou des pays où vous voulez étudier. Ensuite vous devez
          choisir une université et procéder à la demande d’admission. Une fois
          la demande d’admission obtenue, vous pouvez faire une demande de Visa.
          Pour savoir comment faire une demande d’admission ou de visa,
          consultez nos guides gratuits à ce sujet.
          <p className="uppercase text-lg font-bold py-2">
            Quels sont les critères d’admissions ?
          </p>
          Les critères dépendent souvent de chaque université et/ou du programme
          pour lequel vous demandez une admission. En général, il faut avoir des
          bonnes notes scolaires et avoir fait des études qui correspondent au
          programme choisi. Par exemple, une personne ayant fait la sociologie
          aura des difficultés de se faire accepter dans la faculté
          d’informatique.
          <p className="uppercase text-lg font-bold py-2">
            Combien coûtent les études à l’étranger?
          </p>
          Les frais académiques dépendent du pays, de l’université ainsi que du
          programme d’études que vous avez choisi. En moyenne vous devez vous
          attendre en moyenne à: * Entre 4 000 USD et 13 000 USD par année pour
          le Canada, * Entre 832 et 4200 Euros par année pour la Belgique, *
          Entre 10 000 et 55 000 USD pour les Etats-Unis. Existent-ils des
          bourses pour étudier à l’étranger? Oui, il existe des bourses d’études
          pour étudier à l’étranger. Certaines sont complètes c’est à dire
          couvrent tous vos frais et d’autres sont partielles, ne couvrent
          qu’une partie de vos frais académiques ou vous offrent une réduction
          des frais académiques.\ Toutefois ces bourses sont beaucoup plus
          accessibles aux étudiants qui visent les études supérieures, soit la
          maitrise ou le doctorat.
          <p className="uppercase text-lg font-bold py-2">
            Comment trouver des bourses ?
          </p>
          Généralement les bourses complètes sont données par des organismes
          internationales ou des organismes gouvernementaux. Vous devez donc
          être à l’affut en consultant régulièrement les sites de ces
          organismes. Généralement nous partageons souvent les offres des
          bourses d’études dont nous sommes au courant sur notre page facebook.
          N’hésitez donc pas de vous abonner pour recevoir les dernières
          opportunités.
          <p className="uppercase text-lg font-bold py-2">
            Est-ce qu’on peut étudier la médecine ou le droit au Canada ?
          </p>
          Oui mais il est extrêmement difficile d’obtenir une inscription en
          médecine ou en droit pour les études du premier cycle au Canada. Ces
          programmes sont contingentés et le nombre d’étudiants étrangers admis
          par année est très limitée. Toutefois nous vous conseillons de
          communiquer avec l’université visée pour plus d’informations. Les
          diplômes congolais sont – ils reconnus à l’étrangers ? Oui les
          diplômes congolais sont bien reconnus partout dans le monde.
          Cependant, parfois les étudiants doivent faire quelques cours
          préparatoires pour être à jour et bien évoluer dans leurs
          cheminements.
          <p className="uppercase text-lg font-bold py-2">
            Peux-je introduire ma demande de permis d’études avant l’obtention
            de mon CAQ ?{" "}
          </p>
          Non. Vous devez avoir au minimum la lettre d’approbation de votre CAQ
          avant d’introduire votre demande de permis d’études.
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
