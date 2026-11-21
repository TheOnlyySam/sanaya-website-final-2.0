import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaArrowDown, FaFilePdf } from "react-icons/fa6";

export const designerSoftwareLinks = [
  { path: "/software/sanrack-designer", name: "SanRack Designer" },
  { path: "/software/sanpower-designer", name: "SanPower Designer" },
];

const products = {
  sanrack: {
    name: "SanRack Designer",
    version: "1.6.3",
    installer: "https://github.com/TheOnlyySam/sanrack-releases/releases/download/v1.6.3/SanRack-Designer-Setup-1.6.3.exe",
    en: {
      headline: "Plan racks, rooms, and connections in one project.",
      description: "Design server rooms and data centre racks, map copper and fibre links, and turn the same model into drawings, schedules, and a bill of quantities.",
      features: [
        ["Rack and room layouts", "Place equipment in front and rear rack elevations and arrange racks in a room plan. Start from a template or build a custom equipment library."],
        ["Cabling and power", "Trace port-to-port links in the connection studio, plan A/B feeds, and map equipment power supplies to PDU outlets."],
        ["Checks and deliverables", "Review design issues before handover and export rack elevations, connection diagrams, equipment schedules, and bills of quantities."],
      ],
      shots: ["Rack elevation workspace", "3D connection studio", "Equipment schedule sheet"],
    },
    ar: {
      headline: "صمّم الرفوف والغرف والتوصيلات في مشروع واحد.",
      description: "خطّط لغرف الخوادم ورفوف مراكز البيانات، وحدّد توصيلات النحاس والألياف، وأخرج الرسومات والجداول وجداول الكميات من النموذج نفسه.",
      features: [
        ["تخطيط الرفوف والغرف", "وزّع المعدات في الواجهات الأمامية والخلفية للرفوف، ورتّب الرفوف على مخطط الغرفة، واستخدم القوالب أو مكتبة معدات مخصصة."],
        ["الكابلات والطاقة", "تتبّع التوصيلات بين المنافذ، وخطّط لتغذية A/B، واربط مصادر طاقة المعدات بمخارج وحدات توزيع الطاقة."],
        ["المراجعة والتسليم", "راجع ملاحظات التصميم وصدّر واجهات الرفوف ومخططات التوصيل وجداول المعدات والكميات."],
      ],
      shots: ["واجهة تصميم الرفوف", "استوديو التوصيلات ثلاثي الأبعاد", "جدول المعدات"],
    },
  },
  sanpower: {
    name: "SanPower Designer",
    version: "3.0.1",
    installer: "https://github.com/TheOnlyySam/sanpower-releases/releases/download/v3.0.1/SAN-Power-Designer-Setup-3.0.1.exe",
    en: {
      headline: "Take low-voltage designs from loads to panel drawings.",
      description: "Build a power distribution model for a data centre or building, evaluate cables and protection, and prepare coordinated electrical schedules and reports.",
      features: [
        ["Power networks and single-line drawings", "Model boards, feeders, and loads. Use the data centre wizard to start from rack loads and redundancy requirements, then arrange single-line drawing sheets."],
        ["Sizing and checks", "Review cable sizes, voltage drop, fault levels, protection, and equipment sizing with reference tables and design checks."],
        ["Panel layouts and documentation", "Arrange panels in 2D and 3D, assemble material lists and cost estimates, and export schedules and report packages."],
      ],
      shots: ["Power network workspace", "3D panel studio", "Single-line drawing sheets"],
    },
    ar: {
      headline: "صمّم شبكات الجهد المنخفض من الأحمال إلى لوحات التوزيع.",
      description: "أنشئ نموذج توزيع الطاقة لمركز بيانات أو مبنى، وراجع الكابلات والحماية، وأعدّ الجداول والتقارير الكهربائية.",
      features: [
        ["الشبكات والمخططات أحادية الخط", "نمذج اللوحات والمغذيات والأحمال. ابدأ بمعالج مراكز البيانات من أحمال الرفوف ومتطلبات التكرار، ثم رتّب أوراق المخطط."],
        ["اختيار المقاسات والمراجعة", "راجع مقاطع الكابلات وهبوط الجهد ومستويات القصر والحماية ومقاسات المعدات بالاستعانة بالجداول المرجعية وفحوصات التصميم."],
        ["تصميم اللوحات والتوثيق", "رتّب اللوحات في عرض ثنائي وثلاثي الأبعاد، وأعدّ قوائم المواد وتقديرات التكلفة، وصدّر الجداول والتقارير."],
      ],
      shots: ["واجهة شبكة الطاقة", "استوديو اللوحات ثلاثي الأبعاد", "المخططات أحادية الخط"],
    },
  },
};

const labels = {
  en: {
    portal: "Back to portal", download: "Download demo", facts: "Windows x64 · EXE installer · Works offline",
    demo: "Demo exports carry a trial watermark. Activate with the machine-specific code supplied by Sanaya.",
    features: "What you can do", gallery: "Inside the software", datasheets: "Product datasheets", english: "English PDF", arabic: "Arabic PDF",
  },
  ar: {
    portal: "العودة إلى البوابة", download: "تحميل النسخة التجريبية", facts: "Windows x64 · مثبت EXE · يعمل دون اتصال",
    demo: "تتضمن مخرجات النسخة التجريبية علامة مائية. للتفعيل، استخدم رمز الجهاز الذي توفره السنايا.",
    features: "إمكانيات البرنامج", gallery: "واجهات البرنامج", datasheets: "نشرات المنتج", english: "PDF بالإنجليزية", arabic: "PDF بالعربية",
  },
};

export default function DesignerSoftware({ product }) {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage === "ar" ? "ar" : "en";
  const info = products[product];
  const copy = info[lang];
  const ui = labels[lang];
  const shots = ["workspace", "studio", "output"];
  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"} className="bg-slate-50 pb-20 pt-28 text-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link className="inline-block pb-5 text-sm font-semibold text-teal-700 hover:underline" to="/portal">{ui.portal}</Link>
        <section className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white sm:p-10 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <p className="mb-3 text-sm font-semibold text-teal-300" dir="ltr">{info.name} {info.version}</p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{copy.headline}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200">{copy.description}</p>
            <a className="mt-7 inline-flex items-center gap-3 rounded-full bg-teal-300 px-6 py-3 font-bold text-slate-950 hover:bg-teal-200" href={info.installer}>
              <FaArrowDown aria-hidden="true" />{ui.download}
            </a>
            <p className="mt-4 text-sm font-semibold text-slate-200">{ui.facts}</p>
            <p className="mt-2 text-sm text-slate-300">{ui.demo}</p>
          </div>
          <img className="w-full rounded-xl border border-white/20" src={`/${product}-workspace.png`} alt={copy.shots[0]} />
        </section>

        <section className="mt-12" aria-labelledby="designer-features">
          <h2 className="font-display text-3xl font-bold" id="designer-features">{ui.features}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {copy.features.map(([title, description]) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-relaxed text-slate-700">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="designer-gallery">
          <h2 className="font-display text-3xl font-bold" id="designer-gallery">{ui.gallery}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {shots.slice(1).map((shot, index) => (
              <figure key={shot} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <a href={`/${product}-${shot}.png`} target="_blank" rel="noreferrer">
                  <img className="aspect-video w-full bg-slate-100 object-contain" loading="lazy" src={`/${product}-${shot}.png`} alt={copy.shots[index + 1]} />
                </a>
                <figcaption className="px-5 py-4 font-semibold">{copy.shots[index + 1]}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-teal-100 bg-teal-50 p-6 sm:p-8" aria-labelledby="designer-datasheets">
          <h2 className="font-display text-2xl font-bold" id="designer-datasheets">{ui.datasheets}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {[["en", ui.english], ["ar", ui.arabic]].map(([code, label]) => (
              <a key={code} className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-3 font-semibold text-teal-900 hover:bg-teal-100" href={`/${product}-datasheet-${code}.pdf`} download>
                <FaFilePdf aria-hidden="true" />{label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
