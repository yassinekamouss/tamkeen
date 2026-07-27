import React from "react";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import SeoAlternates from "../components/SeoAlternates";

const Privacy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-white text-[#1F2937] font-sans">
      <Helmet>
        <title>{`${t("privacy_modal.title")} | Tamkeen`}</title>
        <meta name="description" content={t("privacy_modal.intro")} />
        <meta property="og:title" content={`${t("privacy_modal.title")} | Tamkeen`} />
        <meta property="og:description" content={t("privacy_modal.intro")} />
      </Helmet>
      <SeoAlternates />

      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-16">
        <div className="text-center mb-16 border-b border-[#E4E4E7] pb-10">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F97316] mb-3 block">
            {t("privacy_page.legal_badge")}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#1F2937] tracking-tight leading-tight mb-4">
            {t("privacy_modal.title")}
          </h1>
          <p className="text-sm sm:text-base text-[#1F2937]/70 max-w-2xl mx-auto leading-relaxed">
            {t("privacy_modal.intro")}
          </p>
        </div>

        <div className="space-y-12">
          {/* SECTION 1 */}
          <section className="border-b border-[#E4E4E7] pb-8">
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#1F2937] mb-4 flex items-center gap-2">
              <span className="text-[#F97316] font-mono">01.</span>
              {t("privacy_modal.section1.title")}
            </h2>
            <p className="text-[#1F2937]/75 leading-relaxed mb-6 text-sm sm:text-base">
              {t("privacy_modal.section1.p1")}
            </p>
            <ul className="space-y-3 text-[#1F2937]/75 text-sm sm:text-base">
              <li className="flex items-start">
                <span className="text-[#F97316] mr-3 ml-0 rtl:ml-3 rtl:mr-0 font-bold">•</span>
                <div>
                  <strong className="text-[#1F2937]">
                    {t("privacy_modal.section1.li1.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section1.li1.text")}
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#F97316] mr-3 ml-0 rtl:ml-3 rtl:mr-0 font-bold">•</span>
                <div>
                  <strong className="text-[#1F2937]">
                    {t("privacy_modal.section1.li2.strong")}:
                  </strong>{" "}
                  {t("privacy_modal.section1.li2.text")}
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#F97316] mr-3 ml-0 rtl:ml-3 rtl:mr-0 font-bold">•</span>
                <div>
                  <strong className="text-[#1F2937]">
                    {t("privacy_modal.section1.li3.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section1.li3.text")}
                </div>
              </li>
            </ul>
          </section>

          {/* SECTION 2 */}
          <section className="border-b border-[#E4E4E7] pb-8">
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#1F2937] mb-4 flex items-center gap-2">
              <span className="text-[#F97316] font-mono">02.</span>
              {t("privacy_modal.section2.title")}
            </h2>
            <p className="text-[#1F2937]/75 leading-relaxed mb-6 text-sm sm:text-base">
              {t("privacy_modal.section2.p1")}
            </p>
            <ul className="space-y-3 text-[#1F2937]/75 text-sm sm:text-base">
              <li className="flex items-start">
                <span className="text-[#F97316] mr-3 ml-0 rtl:ml-3 rtl:mr-0 font-bold">•</span>
                <div>
                  <strong className="text-[#1F2937]">
                    {t("privacy_modal.section2.li1.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section2.li1.text")}
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#F97316] mr-3 ml-0 rtl:ml-3 rtl:mr-0 font-bold">•</span>
                <div>
                  <strong className="text-[#1F2937]">
                    {t("privacy_modal.section2.li2.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section2.li2.text")}
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#F97316] mr-3 ml-0 rtl:ml-3 rtl:mr-0 font-bold">•</span>
                <div>
                  <strong className="text-[#1F2937]">
                    {t("privacy_modal.section2.li3.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section2.li3.text")}
                </div>
              </li>
            </ul>
          </section>

          {/* SECTION 3 */}
          <section className="border-b border-[#E4E4E7] pb-8">
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#1F2937] mb-4 flex items-center gap-2">
              <span className="text-[#F97316] font-mono">03.</span>
              {t("privacy_modal.section3.title")}
            </h2>
            <p className="text-[#1F2937]/75 leading-relaxed mb-6 text-sm sm:text-base">
              {t("privacy_modal.section3.p1")}
            </p>
            <ul className="space-y-3 text-[#1F2937]/75 text-sm sm:text-base">
              <li className="flex items-start">
                <span className="text-[#F97316] mr-3 ml-0 rtl:ml-3 rtl:mr-0 font-bold">•</span>
                <div>
                  <strong className="text-[#1F2937]">
                    {t("privacy_modal.section3.li1.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section3.li1.text")}
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#F97316] mr-3 ml-0 rtl:ml-3 rtl:mr-0 font-bold">•</span>
                <div>
                  <strong className="text-[#1F2937]">
                    {t("privacy_modal.section3.li2.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section3.li2.text")}
                </div>
              </li>
            </ul>
          </section>

          {/* SECTION 4 */}
          <section className="border-b border-[#E4E4E7] pb-8">
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#1F2937] mb-4 flex items-center gap-2">
              <span className="text-[#F97316] font-mono">04.</span>
              {t("privacy_modal.section4.title")}
            </h2>
            <p className="text-[#1F2937]/75 leading-relaxed mb-6 text-sm sm:text-base">
              {t("privacy_modal.section4.p1")}
            </p>
            <ul className="space-y-3 text-[#1F2937]/75 text-sm sm:text-base">
              <li className="flex items-start">
                <span className="text-[#F97316] mr-3 ml-0 rtl:ml-3 rtl:mr-0 font-bold">•</span>
                <div>
                  <strong className="text-[#1F2937]">
                    {t("privacy_modal.section4.li1.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section4.li1.text")}
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#F97316] mr-3 ml-0 rtl:ml-3 rtl:mr-0 font-bold">•</span>
                <div>
                  <strong className="text-[#1F2937]">
                    {t("privacy_modal.section4.li2.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section4.li2.text")}
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#F97316] mr-3 ml-0 rtl:ml-3 rtl:mr-0 font-bold">•</span>
                <div>
                  <strong className="text-[#1F2937]">
                    {t("privacy_modal.section4.li3.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section4.li3.text")}
                </div>
              </li>
            </ul>
          </section>

          {/* CONTACT INFO */}
          <div className="bg-[#1F2937]/5 border border-[#E4E4E7] rounded-none p-6 sm:p-8">
            <h3 className="text-base sm:text-lg font-bold font-display text-[#1F2937] mb-3 uppercase tracking-wide">
              {t("privacy_modal.contactTitle")}
            </h3>
            <p className="text-[#1F2937]/75 mb-4 text-sm sm:text-base leading-relaxed">
              {t("privacy_modal.contactText")}
            </p>
            <p className="text-[#1F2937] text-sm sm:text-base font-mono">
              <strong>{t("privacy_modal.emailLabel")} : </strong>
              <a
                href="mailto:contact@masubvention.ma"
                className="text-[#1E5ED8] hover:text-[#F97316] underline transition-colors duration-200">
                contact@masubvention.ma
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
