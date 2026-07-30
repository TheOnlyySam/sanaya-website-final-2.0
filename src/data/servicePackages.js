export const SERVICE_PACKAGE_IDS = [
  "quick-consultation",
  "full-consultation",
  "two-hour-support",
  "three-hour-support",
  "support-day",
  "weekly-support",
  "monthly-starter",
  "monthly-business",
  "monthly-professional",
  "enterprise",
];

export const servicePackages = [
  {
    id: "quick-consultation",
    name: { en: "Quick Consultation", ar: "استشارة سريعة" },
    priceIqd: 25000,
    duration: { en: "Up to 30 minutes", ar: "لغاية 30 دقيقة" },
    description: {
      en: "A focused online session for one clear question or an initial assessment.",
      ar: "جلسة إلكترونية مركزة لسؤال واضح أو لتقييم أولي للمشكلة.",
    },
    included: {
      en: ["One specific question", "Initial problem assessment", "Basic guidance", "Feature explanation", "Short online consultation"],
      ar: ["سؤال محدد واحد", "تقييم أولي للمشكلة", "إرشادات أساسية", "شرح إحدى الخصائص", "استشارة قصيرة عبر الإنترنت"],
    },
    excluded: {
      en: ["Programming", "Server work", "Complex reports", "Database repair", "Advanced customization"],
      ar: ["البرمجة", "أعمال الخوادم", "التقارير المعقدة", "إصلاح قواعد البيانات", "التخصيص المتقدم"],
    },
  },
  {
    id: "full-consultation",
    name: { en: "Full Consultation", ar: "استشارة كاملة" },
    priceIqd: 40000,
    duration: { en: "Up to 60 minutes", ar: "لغاية 60 دقيقة" },
    description: {
      en: "A complete remote consultation to review an issue, workflow, or requirement.",
      ar: "استشارة متكاملة عن بُعد لمراجعة مشكلة أو سير عمل أو متطلب.",
    },
    included: {
      en: ["Odoo issue review", "Configuration advice", "Workflow consultation", "Remote consultation meeting", "Requirements review"],
      ar: ["مراجعة مشكلة في Odoo", "نصيحة في الإعدادات", "استشارة في سير العمل", "اجتماع استشاري عن بُعد", "مراجعة المتطلبات"],
    },
  },
  {
    id: "two-hour-support",
    name: { en: "Two-Hour Support", ar: "دعم ساعتين" },
    priceIqd: 75000,
    duration: { en: "Up to 2 hours", ar: "لغاية ساعتين" },
    description: {
      en: "Hands-on help for common operational and configuration needs.",
      ar: "مساعدة عملية للاحتياجات التشغيلية وإعدادات النظام الشائعة.",
    },
    included: {
      en: ["Configuration", "User permissions", "Basic training", "Operational issues", "Simple data-import assistance"],
      ar: ["الإعدادات", "صلاحيات المستخدمين", "تدريب أساسي", "المشكلات التشغيلية", "مساعدة بسيطة في استيراد البيانات"],
    },
  },
  {
    id: "three-hour-support",
    name: { en: "Three-Hour Support", ar: "دعم 3 ساعات" },
    priceIqd: 105000,
    duration: { en: "Up to 3 hours", ar: "لغاية 3 ساعات" },
    description: {
      en: "A longer support block for several related needs or guided training.",
      ar: "فترة دعم أطول لمعالجة عدة احتياجات مترابطة أو تقديم تدريب موجه.",
    },
    included: {
      en: ["Multiple support issues", "User training", "Configuration review", "Simple reports", "Basic workflow changes"],
      ar: ["عدة مشكلات دعم", "تدريب المستخدمين", "مراجعة الإعدادات", "تقارير بسيطة", "تغييرات أساسية في سير العمل"],
    },
  },
  {
    id: "support-day",
    name: { en: "Support Day", ar: "يوم دعم" },
    priceIqd: 250000,
    duration: { en: "Up to 8 hours", ar: "لغاية 8 ساعات" },
    description: {
      en: "A focused remote workday for support, review, adjustments, and training.",
      ar: "يوم عمل مركز عن بُعد للدعم والمراجعة والتعديلات والتدريب.",
    },
    included: {
      en: ["Focused remote support", "Multiple requests", "Basic report adjustments", "Data review", "Small approved customizations", "Staff training"],
      ar: ["دعم مركز عن بُعد", "عدة طلبات دعم", "تعديلات أساسية على التقارير", "مراجعة البيانات", "تخصيصات صغيرة معتمدة", "تدريب الموظفين"],
    },
    recommended: true,
  },
  {
    id: "weekly-support",
    name: { en: "Weekly Support", ar: "دعم أسبوعي" },
    priceIqd: 600000,
    duration: { en: "Up to 20 support hours", ar: "لغاية 20 ساعة دعم" },
    description: {
      en: "A week of priority follow-up for active implementation and support needs.",
      ar: "أسبوع من المتابعة ذات الأولوية لاحتياجات التنفيذ والدعم النشطة.",
    },
    included: {
      en: ["Daily follow-up", "Implementation assistance", "Priority support", "Training", "Configuration", "Minor approved modifications"],
      ar: ["متابعة يومية", "مساعدة في التنفيذ", "دعم ذو أولوية", "تدريب", "إعدادات النظام", "تعديلات صغيرة معتمدة"],
    },
  },
  {
    id: "monthly-starter",
    name: { en: "Monthly Starter", ar: "الشهري الأساسي" },
    priceIqd: 850000,
    duration: { en: "Up to 30 support hours", ar: "لغاية 30 ساعة دعم" },
    description: {
      en: "Ongoing Odoo support for small businesses with regular operational needs.",
      ar: "دعم Odoo مستمر للشركات الصغيرة ذات الاحتياجات التشغيلية المنتظمة.",
    },
    included: {
      en: ["Ongoing support", "Regular follow-up", "Configuration assistance", "User guidance", "Minor approved adjustments"],
      ar: ["دعم مستمر", "متابعة منتظمة", "مساعدة في الإعدادات", "إرشاد المستخدمين", "تعديلات صغيرة معتمدة"],
    },
  },
  {
    id: "monthly-business",
    name: { en: "Monthly Business", ar: "شهري الأعمال" },
    priceIqd: 1500000,
    duration: { en: "Up to 60 support hours", ar: "لغاية 60 ساعة دعم" },
    description: {
      en: "Broader monthly coverage for businesses that need consistent priority support.",
      ar: "تغطية شهرية أوسع للشركات التي تحتاج إلى دعم مستمر ذي أولوية.",
    },
    included: {
      en: ["Higher request priority", "Ongoing support", "Regular follow-up", "Configuration and training", "Minor approved customizations"],
      ar: ["أولوية أعلى للطلبات", "دعم مستمر", "متابعة منتظمة", "إعدادات وتدريب", "تخصيصات صغيرة معتمدة"],
    },
  },
  {
    id: "monthly-professional",
    name: { en: "Monthly Professional", ar: "الشهري الاحترافي" },
    priceIqd: 2300000,
    duration: { en: "Up to 100 support hours", ar: "لغاية 100 ساعة دعم" },
    description: {
      en: "High-capacity monthly support with regular consulting and meetings.",
      ar: "دعم شهري بسعة عالية مع استشارات واجتماعات منتظمة.",
    },
    included: {
      en: ["Highest standard priority", "Regular meetings", "Ongoing consulting", "Training", "Configuration", "Minor approved development"],
      ar: ["أعلى أولوية اعتيادية", "اجتماعات منتظمة", "استشارات مستمرة", "تدريب", "إعدادات النظام", "تطوير بسيط معتمد"],
    },
  },
  {
    id: "enterprise",
    name: { en: "Enterprise", ar: "المؤسسات" },
    priceIqd: null,
    duration: { en: "Custom duration and support hours", ar: "المدة وساعات الدعم حسب الاتفاق" },
    description: {
      en: "A tailored engagement for organizations with complex delivery and support requirements.",
      ar: "اتفاقية مصممة للمؤسسات ذات متطلبات التنفيذ والدعم المعقدة.",
    },
    included: {
      en: ["Custom SLA", "Dedicated resources", "Large support capacity", "On-site support", "Advanced development", "Integrations", "Implementation projects"],
      ar: ["اتفاقية مستوى خدمة مخصصة", "موارد مخصصة", "سعة دعم كبيرة", "دعم ميداني", "تطوير متقدم", "تكاملات", "مشاريع تنفيذ"],
    },
  },
];

export const serviceTypes = [
  "consultation",
  "technical-support",
  "odoo-configuration",
  "user-training",
  "reports",
  "data-import",
  "simple-customization",
  "server-hosting",
  "integration",
  "other",
];

export const contactMethods = ["phone", "whatsapp", "email", "online-meeting"];

export function getServicePackage(packageId) {
  return servicePackages.find((servicePackage) => servicePackage.id === packageId) || null;
}

export function formatIqd(priceIqd, language = "ar") {
  if (priceIqd === null) {
    return language === "ar" ? "حسب الاتفاق" : "Contact us";
  }

  return `${new Intl.NumberFormat(language === "ar" ? "ar-IQ" : "en-IQ", {
    maximumFractionDigits: 0,
  }).format(priceIqd)} ${language === "ar" ? "د.ع" : "IQD"}`;
}
