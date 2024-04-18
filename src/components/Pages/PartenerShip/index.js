import React from "react";
import Layout from "../../Layout";
import { StaticImage } from "gatsby-plugin-image";
import NewsCard from "../../NewsCard";

const PartenerShip = () => {
  return (
    <Layout pageTitle={"Détails sur les partenaires"}>
      <section>
        <div className="mx-4 py-5">
          <StaticImage
            src="../../../images/2VJHRB2PIZDLTHHCJITZPFTISU1.png"
            alt="gallery"
            className="block h-60 w-full rounded-sm object-cover object-center"
          />
        </div>

        <div className="mx-4 text-start">
          <p className="text-[#4bb4d4] text-xl font-bold">
            Optez pour l'Université Européenne Lefke en Chypre du Nord
          </p>

          <p className="py-3 text-sm">
            Les examens médicaux constituent une étape cruciale pour les
            demandeurs du visa canadien de plus de 6 mois (visiteur, études,
            travail ou encore regroupement familial).
          </p>

          <p className="py-2 text-sm">
            Après avoir obtenu une instruction pour la collecte des données
            biométriques, tout demandeur du visa canadien est anxieux de
            recevoir une réponse de la part de l’immigration qui peut prendre 4
            mois ou moins en cas de refus.
            <a href="#" className="font-bold">
              Mais cela ne veut pas dire que la durée du traitement entraine
              nécessairement une réponse favorable.
            </a>
          </p>

          <p className="py-2 text-sm">
            Cependant l’instruction aux examens médicaux est un bon signal pour
            la bonne marche du processus de demande de visa, si bien que
            certains demandeurs, par anxiété, peur ou anticipation décident de
            passer leurs examens médicaux avant l’instruction de l’immigration.
            Pour plus d’informations, sur les examens médicaux pour un long
            séjour, veuillez consulter le site de l’immigration.
          </p>

          <p className="py-2 font-bold text-lg">
            Passer l’examen médical avant l’instruction.
          </p>
          <p className="py-2">
            Il est possible de passer des examens médicaux avant l’instruction
            de l’immigration ou encore la soumission de votre demande par
            prévention. Cependant cela revient à votre entière responsabilité et
            n’engage ni l’immigration ni le médecin ou l’entité où vous
            passeriez vos examens en cas de refus de visa ou de rejet des
            examens effectués. Dans ce cas vous auriez perdu du temps et de
            l’argent qui vous auriez certainement servi autrement.
          </p>

          <p className="py-2 font-bold text-lg">
            Passer l’examen médical avant l’instruction.
          </p>

          <p className="py-2">
            Il est préférable et prudent de passer l’examen médical après
            instruction de l’immigration. Cela prouve que, vous êtes sur la
            bonne voie et que vous pouvez vous attendre à une suite favorable de
            votre demande. Vous trouverez plus d’informations sur les exigences
            en matière d’examens médicaux sur
            <a href="#" className="font-bold">
              le site web de l’immigration.
            </a>
          </p>

          <p className="py-2 font-bold text-lg">Où passer l'examen médical ?</p>

          <p className="py-2">
            Il existe une liste des médecins désignés dans chaque pays qui sont
            les seuls autorisés à procéder aux examens. En République
            Démocratique du Congo, les examens médicaux se font à Kinshasa au
            sein de l’OIM qui se trouve dans l’enceinte de la concession de UTEX
            AFRICA au 372 Avenue Colonel Mondjiba, Bâtiment 58 /Immotex, Commune
            Ngaliema, Kinshasa- République Démocratique du Congo. Pour tout
            contact, veuillez les contacter au +243 827076321.
          </p>

          <p className="py-2">
            NB :
            <ul className="list-decimal ml-7">
              <li className="py-2">
                Avant de passer vos examens médicaux, vous devez au préalable
                prendre rendez-vous.
              </li>
              <li className="py-2">
                Tout demandeur du visa canadien se trouvant en provinces de la
                RDC ou encore à Brazzaville ou certains pas d’Afrique centrale
                limitrophes au pays, doivent se faire examiner à Kinshasa.
              </li>
              <li className="py-2">
                Pour les autres, vous pouvez vérifier les médecins de votre pays
                sur le site web de l’immigration.
              </li>
            </ul>
          </p>

          <p className="py-2 font-bold text-lg">Quels documents apporter ?</p>

          <p className="py-2 font-bold text-sm">Pour le paiement des examens</p>
          <ul className="list-disc py-1 ml-7">
            <li>Votre passport</li>
            <li>Votre lettre d'insciption aux examens médicaux</li>
          </ul>

          <p className="py-2 font-bold text-sm">
            Pour la prise de rendez-vous :
          </p>
          <ul className="list-disc py-1 ml-7">
            <li>Votre passport</li>
            <li>Votre lettre d'insciption</li>
            <li>Votre reçu de paiement</li>
            <li>2 photos passeports 4x4</li>
          </ul>

          <p className="py-2 font-bold text-lg">
            Puis-je avoir un refus après avoir effectué des examens médicaux ?
          </p>
          <p className="py-2">
            Bien que cela soit rare, il est possible qu’après plusieurs
            vérifications, que l’agent de l’immigration rencontre des
            irrégularités dans votre dossier après vous avoir instruit aux
            examens médicaux. Cela peut susciter un refus ou encore une
            interdiction du territoire si les causes des irrégularités sont
            graves.
          </p>

          <p className="py-2 font-bold text-lg">Combien ça coûte ?</p>
          <p className="py-2">
            Les examens médicaux reviennent à 320$ (veuillez vous informer sur
            le coût et le moyen de paiement selon votre pays) à payer à CITY
            BANK la seule banque accréditée pour le paiement à Kinshasa. NB:
            Vous avez des préoccupations concernant votre projet d’études au
            Canada, optez pour une consultation chez RDC ETUDES et profitez de
            l’expertise de nos mentors.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default PartenerShip;
