import React from 'react';

import GenericPage from '../GenericPage';

const page = {
  description: 'La politique de confidentialité de RDC Etudes.',
  title: 'Politique de confidentialité',
  path: '/politique-de-confidentialite'
};

const PrivacyPolicyPage = () => (
  <GenericPage page={page}>
    <h1>Politique de confidentialité.</h1>
    <p>
      <strong>Introduction</strong>
      <br />
      Devant le développement des nouveaux outils de communication, il est nécessaire de porter une attention
      particulière à la protection de la vie privée. C‘est pourquoi, nous nous engageons à respecter la confidentialité
      des renseignements personnels que nous collectons.
    </p>
    <hr />
    <h2>Collecte des renseignements personnels</h2>
    <p>Nous collectons les renseignements suivants :</p>
    <ul>
      <li>Nom</li>
      <li>Adresse électronique</li>
    </ul>

    <p>
      Les renseignements personnels que nous collectons sont recueillis au travers de formulaires et grâce à
      l‘interactivité établie entre vous et notre site Web. Nous utilisons également, comme indiqué dans la section
      suivante, des fichiers témoins et/ou journaux pour réunir des informations vous concernant.
    </p>
    <hr />
    <h2>Formulaires&nbsp; et interactivité:</h2>
    <p>
      Vos renseignements personnels sont collectés par le biais du formulaire de Contact sur chaque page de ce site web{' '}
    </p>
    <p>Nous utilisons les renseignements ainsi collectés pour les finalités suivantes :</p>
    <ul>
      <li>Contact</li>
    </ul>
    <p>
      Vos renseignements sont également collectés par le biais de l‘interactivité pouvant s‘établir entre vous et notre
      site Web et ce, de la façon suivante:
    </p>
    <ul>
      <li>Contact</li>
    </ul>
    <p>
      Nous utilisons les renseignements ainsi collectés pour les finalités suivantes :<br />
    </p>
    <ul>
      <li>Correspondance</li>
    </ul>
    <hr />
    <h2>Droit d‘opposition et de retrait</h2>
    <p>
      Nous nous engageons à vous offrir un droit d‘opposition et de retrait quant à vos renseignements personnels.<br />
      Le droit d‘opposition s‘entend comme étant la possiblité offerte aux internautes de refuser que leurs
      renseignements personnels soient utilisées à certaines fins mentionnées lors de la collecte.<br />
    </p>
    <p>
      Le droit de retrait s‘entend comme étant la possiblité offerte aux internautes de demander à ce que leurs
      renseignements personnels ne figurent plus, par exemple, dans une liste de diffusion.<br />
    </p>
    <p>
      Pour pouvoir exercer ces droits, vous pouvez : <br />
      Code postal : 3214 Chemin Sainte-Foy, 301, Quebec City G1X 1R4<br /> Courriel : salut@rdcetudes.com<br />{' '}
      Téléphone : 5819988051<br /> Section du site web : https://www.rdcetudes.com/<br />{' '}
    </p>
    <hr />
    <h2>Droit d‘accès</h2>
    <p>
      Nous nous engageons à reconnaître un droit d‘accès et de rectification aux personnes concernées désireuses de
      consulter, modifier, voire radier les informations les concernant.<br />
      L‘exercice de ce droit se fera :<br />
      Code postal : 3214 Chemin Sainte-Foy, 301, Quebec City G1X 1R4<br /> Courriel : salut@rdcetudes.com<br />
      Téléphone : 5819988051<br /> Section du site web : https://www.rdcetudes.com/<br />
    </p>
    <hr />
    <h2>Sécurité</h2>
    <p>
      Les renseignements personnels que nous collectons sont conservés dans un environnement sécurisé. Les personnes
      travaillant pour nous sont tenues de respecter la confidentialité de vos informations.<br />
      Pour assurer la sécurité de vos renseignements personnels, nous avons recours aux mesures suivantes :
    </p>
    <ul>
      <li>Protocole SSL (Secure Sockets Layer)</li>
      <li>Gestion des accès - personne autorisée</li>
      <li>Identifiant / mot de passe</li>
    </ul>

    <p>
      Nous nous engageons à maintenir un haut degré de confidentialité en intégrant les dernières innovations
      technologiques permettant d‘assurer la confidentialité de vos transactions. Toutefois, comme aucun mécanisme
      n‘offre une sécurité maximale, une part de risque est toujours présente lorsque lon utilise Internet pour
      transmettre des renseignements personnels.
    </p>
  </GenericPage>
);

export default PrivacyPolicyPage;
