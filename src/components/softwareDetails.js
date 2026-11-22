export const softwareDetails = {
  sanrack: {
    metrics: [["A/B", "Power feeds and failover loads", "تغذية مزدوجة وأحمال عند التعطل"], ["600 dpi", "Print-resolution export", "تصدير بدقة الطباعة"], ["10", "Drawing sheet types", "أنواع أوراق الرسم"], ["Offline", "Local project storage", "حفظ المشاريع محلياً"]],
    workflow: [
      ["Set up the project", "Add the client, revision, title block and drawing size.", "إعداد المشروع", "أضف بيانات العميل والمراجعة وقالب العنوان وحجم الورق."],
      ["Lay out the room", "Arrange rows, pods and aisles. Place cabinets and configure A/B feeds.", "تخطيط الغرفة", "رتّب الصفوف والممرات والخزائن واضبط تغذية A/B."],
      ["Populate each rack", "Use equipment templates, import lists or build a device with custom port groups.", "تجهيز الرفوف", "استخدم القوالب أو استورد قوائم المعدات أو أنشئ أجهزة بمجموعات منافذ مخصصة."],
      ["Patch and trace", "Connect ports and trace copper and fibre routes in the 3D studio.", "ربط المنافذ وتتبعها", "اربط المنافذ وتتبّع مسارات النحاس والألياف في العرض ثلاثي الأبعاد."],
      ["Review the design", "Check rack overlaps, equipment feeds and PDU load before issue.", "مراجعة التصميم", "افحص التداخلات وتغذية الأجهزة وأحمال وحدات توزيع الطاقة."],
      ["Issue the package", "Export drawing sheets and assembly schedules, or hand procurement a priced Excel BOQ.", "إصدار الحزمة", "صدّر الرسومات والجداول أو سلّم فريق المشتريات جدول كميات مسعّراً."],
    ],
    gallery: [
      ["studio", "Trace connections in 3D", "Tagged routes show media, cable length and the ports at each end.", "تتبّع التوصيلات ثلاثي الأبعاد", "تُظهر المسارات نوع الكابل وطوله والمنافذ عند الطرفين."],
      ["plan", "Lay out the room", "Position the racks and check how rows, clearances and aisles fit.", "خطّط الغرفة", "حدّد مواقع الرفوف وراجع الصفوف والمسافات والممرات."],
      ["power", "Issue an A/B power sheet", "Document power distribution and review the remaining feed load in a failure scenario.", "أصدر مخطط تغذية A/B", "وثّق توزيع الطاقة وراجع حمل التغذية المتبقية عند التعطل."],
      ["output", "Hand over the equipment schedule", "Use coordinated equipment schedules alongside rack elevations and connection sheets.", "سلّم جدول المعدات", "استخدم جداول المعدات بجانب واجهات الرفوف ومخططات التوصيل."],
      ["checks", "Review issues before handover", "Find overloaded PDUs, single-fed equipment and rack placement conflicts.", "راجع الملاحظات قبل التسليم", "اكتشف الحمل الزائد على وحدات التوزيع والأجهزة أحادية التغذية وتعارضات التوزيع."],
    ],
  },
  sanpower: {
    metrics: [["57", "Equipment types", "نوعاً من المعدات"], ["19", "Iraqi governorate climate profiles", "ملفاً مناخياً لمحافظات العراق"], ["17", "Report sections", "قسماً للتقرير"], ["Offline", "Local project storage", "حفظ المشاريع محلياً"]],
    workflow: [
      ["Set the design basis", "Record site climate, voltage, earthing and cable limits.", "إعداد أسس التصميم", "سجّل المناخ والجهد والتأريض وحدود الكابلات."],
      ["Build the topology", "Model sources, ATS, switchboards and single or dual supply paths.", "بناء طوبولوجيا الشبكة", "نمذج المصادر ومفاتيح التحويل واللوحات ومسارات التغذية."],
      ["Enter and balance loads", "Build circuit and mechanical schedules, including demand and diversity.", "إدخال الأحمال وموازنتها", "أنشئ جداول الدوائر والأحمال الميكانيكية مع الطلب والتنوع."],
      ["Size and check", "Review cables, voltage drop, fault levels, protection and generator, transformer or UPS sizing.", "التحجيم والتحقق", "راجع الكابلات وهبوط الجهد وتيارات القصر والحماية وتحجيم المصادر."],
      ["Detail the panels", "Arrange components, DIN rails and ducts, then use the panel materials list for procurement.", "تفصيل اللوحات", "رتّب المكونات والسكك والقنوات واستعمل قوائم مواد اللوحات للمشتريات."],
      ["Issue the package", "Deliver single-line sheets, panel drawings, a priced BOQ and PDF or Excel reports.", "إصدار الحزمة", "سلّم المخططات الأحادية ورسومات اللوحات وجداول الكميات وتقارير PDF أو Excel."],
    ],
    gallery: [
      ["output", "Issue single-line diagrams", "Arrange sheets with IEC 60617 or ANSI symbols and project title blocks.", "أصدر المخططات أحادية الخط", "رتّب الأوراق برموز IEC 60617 أو ANSI وقالب عنوان المشروع."],
      ["plan", "Review circuit and load schedules", "Inspect board circuits, phase allocation and demand totals.", "راجع جداول الدوائر والأحمال", "افحص الدوائر وتوزيع الأطوار ومجاميع الطلب."],
      ["studio", "Detail the enclosure in 3D", "Review rails, trunking, gland plates and how the assembly fits inside the panel.", "فصّل اللوحة ثلاثية الأبعاد", "راجع السكك والقنوات ومداخل الكابلات وتوزيع المكونات."],
      ["power", "Check faults and protection", "Compare calculated fault levels, breaker breaking capacities and protection findings.", "تحقّق من القصر والحماية", "قارن تيارات القصر المحسوبة وقدرة القطع وملاحظات الحماية."],
      ["checks", "Review quantities and cost", "Use the reusable price library to estimate material costs and prepare a priced BOQ.", "راجع الكميات والتكلفة", "استخدم مكتبة الأسعار لتقدير تكاليف المواد وإعداد جدول كميات مسعّر."],
    ],
  },
};
