import React from 'react';

import GenericPage from '../GenericPage';

const page = {
  description:
    'RDC Etudes offre un service d’assistance dans le strict respect des lois des pays concernés. En plus des guides gratuits que nous mettons à votre disposition, nous vous offrons un service d’assistance dont l’objectif n’est pas l’argent mais la réalisation de votre projet d’études.',
  title: 'Service d’assistance visa',
  path: '/assistance-visa'
};

const AssistanceVisaPage = () => (
  <GenericPage page={page}>
    <h1>Le service d’assistance visa.</h1>
    <p>
      <strong>Introduction</strong>
      <br />
      <p>
        Le service d’assistance pour l’obtention de Visa est un des services qui attirent le plus des fraudeurs dans le
        monde. C’est pour cette raison que plusieurs gouvernements ont mis en place des méchanismes et restrictions pour
        protéger les démandeurs potentiels.
      </p>

      <p>
        RDC Etudes s’engage à respecter scripuleusement les lois des pays concernés dans son offre d’assistance pour
        obtention de visa d‘études.
      </p>

      <p>
        Cette page vous explique en détails ce que RDC Etudes fait ou ne fait pas en ce qui concernent chaque pays. Elle
        sera mise à jour au fur et à mesure que les autorisations sont obtenues ou si les legislations des pays
        concernés advenaient à changer.
      </p>
    </p>
    <hr />
    <h2>Belgique</h2>
    <p>
      Notre assistance consiste à vous aider à:
      <ul>
        <li>trouver la bonne information en utilisant le site web du gouvernement belge;</li>
        <li>remplir les formulaires;</li>
        <li>réunir les documents qui vous sont démandés et les différentes preuves;</li>
        <li>prendre rendez-vous en ligne;</li>
        <li>faire vos plans de voyages.</li>
      </ul>
      <strong>
        Les rendez-vous et formulaires sont gratuits. Nous n’avons aucune influence sur les décisions de l’ambassade de
        vous octroyer ou réfuser le visa. Cela relève entièrement de l’ambassade. Notre aide se limite à vous
        accompagner dans le processus de dépôt.
      </strong>
    </p>
    <hr />
    <h2>Canada</h2>
    <p>
      Notre assistance consiste à vous aider à:
      <ul>
        <li>trouver la bonne information en utilisant le site web du gouvernement canadien;</li>
        <li>utiliser les services en ligne du gouvernement canadien;</li>
        <li>consulter et utiliser les formulaires électroniques;</li>
        <li>faire vos plans de voyages;</li>
        <li>rassembler les documents qui vous sont démandés.</li>
      </ul>
      Nous n’avons pas encore le droit d’agir en tant que réprésentants, nous ne serons donc pas en mesure de:
      <ul>
        <li>vous conseiller sur le programme d’immigration à utiliser pour votre demande;</li>
        <li>
          remplir ni mettre à jour votre demande à votre place. Nous pouvons vous aider en indiquant comment faire, mais
          vous devez le faire vous-même;
        </li>
        <li>traiter avec immigration Canada en votre nom.</li>
      </ul>
      <strong>
        Nous n’avons aucune influence sur les décisions du gouvernement canadien de vous octroyer ou réfuser le visa.
        Cela relève entièrement de l’ambassade. Notre aide se limite à vous accompagner dans le processus de dépôt.
      </strong>
    </p>
    <hr />
    <h2>États-Unis</h2>
    <p>
      Notre assistance consiste à vous aider à:
      <ul>
        <li>utiliser les services en ligne du gouvernement américain pour faire votre demande de visa;</li>
        <li>consulter et utiliser les formulaires électroniques;</li>
        <li>rassembler les documents qui vous sont démandés;</li>
        <li>préparer l’entrevue à l’ambassade.</li>
      </ul>
      <strong>
        Nous n’avons aucune influence sur votre obtention de rendez-vous ou les décisions de l’ambassade de vous
        octroyer ou réfuser le visa. Cela relève entièrement de l’ambassade. Notre aide se limite à vous accompagner
        dans le processus de dépôt.
      </strong>
    </p>
    <hr />
  </GenericPage>
);

export default AssistanceVisaPage;
