import React from 'react';
import './InfoPages.css';

const PageLayout = ({ title, children }) => (
  <main className="info-page page-enter">
    <div className="container">
      <h1 className="info-page__title">{title}</h1>
      <div className="info-page__content">
        {children}
      </div>
    </div>
  </main>
);

export const AboutPage = () => (
  <PageLayout title="Rreth Nesh">
    <p>Mirë se vini në LUXE Store, destinacioni juaj kryesor për modë premium dhe ekskluzive. Themeluar me pasionin për të sjellë trendet më të fundit me cilësinë më të lartë.</p>
    <h2>Misioni Ynë</h2>
    <p>Misioni ynë është të fuqizojmë individët të shprehin veten përmes stilit të tyre unik, duke ofruar koleksione të kuruara me kujdes dhe shërbim të shkëlqyer ndaj klientit.</p>
    <h2>Vlerat Tona</h2>
    <ul>
      <li><strong>Cilësia:</strong> Ne nuk bëjmë kompromis me materialet dhe punimin.</li>
      <li><strong>Ekskluziviteti:</strong> Dizajne që ju bëjnë të dalloheni.</li>
      <li><strong>Klienti në qendër:</strong> Përvoja juaj e blerjes është prioriteti ynë numër një.</li>
    </ul>
  </PageLayout>
);

export const PrivacyPage = () => (
  <PageLayout title="Politika e Privatësisë">
    <p>Në LUXE Store, privatësia juaj është thelbësore. Kjo politikë shpjegon se si ne i mbledhim, përdorim dhe mbrojmë të dhënat tuaja personale.</p>
    <h2>Mbledhja e të Dhënave</h2>
    <p>Ne mbledhim informacionin që na ofroni kur bëni një porosi ose regjistroheni në faqen tonë (emri, emaili, adresa, etj.). Gjithashtu, mbledhim të dhëna për përdorimin tuaj të faqes përmes cookies.</p>
    <h2>Përdorimi i Informacionit</h2>
    <p>Të dhënat tuaja përdoren për të përpunuar porositë, për të përmirësuar faqen tonë dhe për t'ju dërguar oferta speciale nëse keni pranuar.</p>
    <h2>Mbrojtja e të Dhënave</h2>
    <p>Ne përdorim teknologji të avancuara të enkriptimit për të siguruar që të dhënat tuaja të jenë të mbrojtura gjatë gjithë kohës.</p>
  </PageLayout>
);

export const TermsPage = () => (
  <PageLayout title="Kushtet e Përdorimit">
    <p>Ju lutemi lexoni me kujdes këto Kushte Përdorimi përpara se të përdorni faqen e LUXE Store.</p>
    <h2>Pranimi i Kushteve</h2>
    <p>Duke vizituar ose duke blerë në faqen tonë, ju pranoni të jeni të lidhur me këto terma dhe kushte.</p>
    <h2>Pronësia Intelektuale</h2>
    <p>E gjithë përmbajtja në këtë faqe interneti, duke përfshirë tekstin, grafikën, logot dhe imazhet, është pronë e LUXE Store dhe mbrohet nga ligjet e të drejtave të autorit.</p>
    <h2>Saktësia e Informacionit</h2>
    <p>Ne përpiqemi që përshkrimet dhe çmimet e produkteve të jenë sa më të sakta. Megjithatë, ne rezervojmë të drejtën të korrigjojmë çdo gabim ose lëshim në çdo kohë.</p>
  </PageLayout>
);

export const ReturnsPage = () => (
  <PageLayout title="Kthim & Rimbursim">
    <p>Ne dëshirojmë që të jeni 100% të kënaqur me blerjen tuaj. Nëse nuk jeni plotësisht të kënaqur, ja si funksionon politika jonë e kthimit.</p>
    <h2>Politika e Kthimit 30-Ditore</h2>
    <p>Ju mund t'i ktheni produktet e papërdorura brenda 30 ditëve nga data e blerjes për një rimbursim të plotë ose shkëmbim.</p>
    <h2>Kushtet për Kthim</h2>
    <ul>
      <li>Produkti duhet të jetë në gjendjen e tij origjinale, i papërdorur dhe me të gjitha etiketat e bashkangjitura.</li>
      <li>Fatura ose prova e blerjes duhet të përfshihet.</li>
      <li>Kthimi nuk vlen për artikujt e personalizuar ose të brendshmet për arsye higjienike.</li>
    </ul>
    <h2>Procesi i Rimbursimit</h2>
    <p>Pasi të pranojmë dhe inspektojmë kthimin tuaj, rimbursimi do të procesohet brenda 5-7 ditëve të punës në mënyrën origjinale të pagesës.</p>
  </PageLayout>
);

export const FAQPage = () => (
  <PageLayout title="Pyetje të Shpeshta (FAQ)">
    <div className="faq-item">
      <h3>Sa kohë zgjat dërgesa?</h3>
      <p>Për porositë brenda Kosovës, dërgesa zakonisht zgjat 2-3 ditë pune. Për rajonin, 5-7 ditë pune.</p>
    </div>
    <div className="faq-item">
      <h3>Si mund të ndjek porosinë time?</h3>
      <p>Pasi porosia juaj të niset, ju do të merrni një email me një link për të ndjekur statusin e dërgesës.</p>
    </div>
    <div className="faq-item">
      <h3>A mund të anuloj porosinë time?</h3>
      <p>Po, mund ta anuloni porosinë brenda 24 orëve nga momenti i blerjes duke kontaktuar mbështetjen tonë të klientit.</p>
    </div>
    <div className="faq-item">
      <h3>A ofroni transport ndërkombëtar?</h3>
      <p>Për momentin ne dërgojmë vetëm në Kosovë, Shqipëri dhe Maqedoni të Veriut. Po punojmë për të zgjeruar rrjetin tonë.</p>
    </div>
  </PageLayout>
);
