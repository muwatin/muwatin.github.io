// Language toggle: default Arabic, persisted in localStorage.
(() => {
  const root = document.documentElement;
  const body = document.body;
  const btn = document.getElementById('lang-toggle');
  const saved = localStorage.getItem('muwatin-lang');

  const apply = (lang) => {
    body.dataset.lang = lang;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    btn.textContent = lang === 'ar' ? 'EN' : 'ع';
  };

  apply(saved === 'en' ? 'en' : 'ar');

  btn.addEventListener('click', () => {
    const next = body.dataset.lang === 'ar' ? 'en' : 'ar';
    apply(next);
    localStorage.setItem('muwatin-lang', next);
  });
})();

// Generic accordion: used by "read the full concept note" and the program days/sessions.
// Animates via grid-template-rows (0fr -> 1fr) instead of native <details>, so it can transition smoothly.
const initAccordions = (root = document) => {
  root.querySelectorAll('.accordion-trigger').forEach((trigger) => {
    if (trigger.dataset.bound) return;
    trigger.dataset.bound = '1';
    trigger.addEventListener('click', () => {
      const panel = trigger.nextElementSibling;
      const open = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('open', !open);
    });
  });
};

// Rubrics: the five conference themes, in both languages.
(() => {
  const RUBRICS = [
    {
      ar: {
        title: 'المحور الأول: مفهوم التضامن والتحولات التي طرأت عليه',
        body: 'يسعى هذا المحور إلى إلقاء الضوء على مفهوم التضامن بشكل عام، والتحولات التي طرأت عليه على مدار السنوات الثلاث الماضية، وكيفية قراءة المفهوم اليوم من الناحية النظرية، والفرق بين التعاطف والتأييد والتضامن، والأبعاد السياسية للمفهوم.',
      },
      en: {
        title: 'First Rubric: The Concept of Solidarity and Its Transformations',
        body: 'This rubric seeks to shed light on the concept of solidarity more broadly, the transformations it has undergone over the past three years, how the concept can be understood theoretically today, the distinction between sympathy, support, and solidarity, and the political dimensions of the concept.',
      },
    },
    {
      ar: {
        title: 'المحور الثاني: حركة التضامن مع فلسطين: تعاطف لحظي مع الضحية أم احتجاج على الوضع العالمي؟',
        body: 'يناقش هذا المحور ماهية حركة التضامن العالمي مع فلسطين اليوم، وحدودها ومآلاتها، وإلى أي مدى تتقاطع التعبئة من أجل فلسطين مع القلق على مستقبل الشعوب الأخرى المهدد.',
      },
      en: {
        title: 'Second Rubric: Momentary Sympathy with the Victim or Protest against the Global Condition?',
        body: 'This rubric looks into the nature of the global solidarity movement with Palestine today, its limits and trajectories, and the extent to which mobilisation for Palestine intersects with concerns about the endangered future of other peoples.',
      },
    },
    {
      ar: {
        title: 'المحور الثالث: الآفاق السياسية لحركة التضامن العالمي',
        body: 'يناقش هذا المحور الآفاق السياسية لحركة التضامن العالمي مع فلسطين، وإمكانيات تحولها إلى حركة نضالية عالمية منظمة، والشروط التنظيمية والسياسية والمؤسسية الضرورية لذلك.',
      },
      en: {
        title: 'Third Rubric: The Political Prospects for the Global Solidarity Movement',
        body: 'This rubric examines the political prospects of the global solidarity movement with Palestine, and the organisational, political, and institutional conditions necessary for transforming it into a sustainable and organised international movement.',
      },
    },
    {
      ar: {
        title: 'المحور الرابع: الوضع الداخلي الفلسطيني والمعيقات التي يضعها أمام النضال العالمي المشترك',
        body: 'يناقش هذا المحور الوضع الداخلي الفلسطيني، والمحددات والمعيقات التي تضعها أزمات النظام السياسي الفلسطيني أمام تمكن الفلسطينيين من البناء على حركة التضامن الواسعة، وبناء التحالفات مع القوى التقدمية العالمية.',
      },
      en: {
        title: 'Fourth Rubric: The Palestinian Domestic Condition and the Obstacles to a Shared Global Struggle',
        body: 'This rubric examines the Palestinian domestic situation, the constraints posed by the crises of the Palestinian political system, and the prospects for building alliances with progressive forces around the world.',
      },
    },
    {
      ar: {
        title: 'المحور الخامس: تقبّل حقوق الإنسان في ظل حركة التضامن',
        body: 'يعرض هذا المحور لنقاش مستقبل حقوق الإنسان في ظل تفعيل آلية التضامن الأممي، وإمكانيات تحويل منظومة حقوق الإنسان إلى أداة تحررية تهدف إلى تحرير الإنسان وصون كرامته.',
      },
      en: {
        title: 'Fifth Rubric: The Reception of Human Rights within the Solidarity Movement',
        body: 'This rubric inspects the future of human rights in the context of activating transnational solidarity as a mechanism, and the possibilities for transforming the human rights system into an emancipatory instrument.',
      },
    },
  ];

  const list = document.getElementById('rubrics-list');
  if (!list) return;

  const split = (title) => {
    const i = title.indexOf(':');
    return [title.slice(0, i), title.slice(i + 1).trim()];
  };
  const arDigits = ['1', '2', '3', '4', '5']; // Western digits in Arabic too

  RUBRICS.forEach((r, n) => {
    const [arLabel, arTitle] = split(r.ar.title);
    const [enLabel, enTitle] = split(r.en.title);
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="rubric-num" aria-hidden="true">
        <span data-i18n="ar">${arDigits[n]}</span>
        <span data-i18n="en" lang="en" dir="ltr">0${n + 1}</span>
      </span>
      <div data-i18n="ar">
        <p class="rubric-label">${arLabel}</p>
        <h3>${arTitle}</h3>
        <p>${r.ar.body}</p>
      </div>
      <div data-i18n="en" lang="en" dir="ltr">
        <p class="rubric-label">${enLabel}</p>
        <h3>${enTitle}</h3>
        <p>${r.en.body}</p>
      </div>`;
    list.appendChild(li);
  });
})();

// Papers, in programme order. Titles are given in both languages exactly as in the final programme
// (Programme AR/EN 261116); `gist` is the summary of the submitted abstract, in its original language (`lang`).
// Optional `abstract: '...'` holds the full text (blank line between paragraphs); the popup then shows it instead of the gist.
const ABSTRACTS = [
  { id: 'grimm', name: 'Jannis Julien Grimm', lang: 'en',
    title: { ar: 'التضامن في ظروف مستحيلة: التضامن مع فلسطين في ألمانيا بين اللامبالاة العامة وقمع الدولة', en: 'Solidarity Under Impossible Conditions: Palestine Solidarity in Germany between Public Indifference and State Repression' },
    gist: 'Mixed-methods study of Palestine solidarity protest in Germany, and how repression both enables alliances and strains them.' },
  { id: 'de-smet', name: 'Bram J. De Smet', lang: 'en',
    title: { ar: 'التصعيد الديكولونياليّ: كيف تتعلّم الحركات الرفضَ في ظلّ سياسات التهدئة', en: 'Decolonial Escalation: How Movements Learn to Refuse Under Pacification' },
    gist: 'Ethnographic study of Helsinki de-escalation volunteers, proposing "decolonial escalation" and hope as infrastructure for sustained refusal.' },
  { id: 'jaaba', name: 'ياسمين الجعبة', lang: 'ar',
    title: { ar: 'التشكّل التاريخيّ والتحوّلات المفهوميّة للتضامن', en: 'Historical Formation and Conceptual Transformations of Solidarity' },
    gist: 'تتتبع محطات تشكل مفهوم التضامن تاريخياً، وكيف تحول إلى كلمة طنانة تتسع لمعانٍ متعددة ومتناقضة أحياناً.' },
  { id: 'kumar', name: 'Santosh Kumar', lang: 'en',
    title: { ar: 'من الاستغلال الاستعماريّ إلى التضامن العالميّ: الطبقة والاستعمار والمقاومة في أدب ما بعد الاستعمار في الهند وفلسطين', en: 'From Colonial Exploitation to Global Solidarity: Class, Colonialism, and Resistance in Postcolonial Literature from India and Palestine' },
    gist: 'Reads Indian and Palestinian postcolonial literature side by side to ask how sympathy becomes shared, class-grounded struggle.' },
  { id: 'saadi', name: 'Sardar Saadi', lang: 'en',
    title: { ar: 'التضامن من القاعدة: النضالات الكرديّة والفلسطينيّة وسياسات التحرّر', en: 'Solidarity from Below: Kurdish and Palestinian Struggles and the Politics of Liberation' },
    gist: 'Draws on Kurdish and Palestinian experiences to argue for solidarity grounded in mutual recognition rather than shared victimhood alone.' },
  { id: 'hindi-arqawi-sadeq', name: 'Yara Al Hindi, Bayan M. Arqawi, and Tareq Sadeq', authors: ['Yara Al Hindi', 'Bayan M. Arqawi', 'Tareq Sadeq'], lang: 'en',
    title: { ar: 'عمالقة الذكاء الاصطناعيّ وإبادة غزّة', en: 'AI Giants and the Annihilation of Gaza' },
    gist: 'Traces the contracts, ownership, and political ties of major AI companies to the Israeli military during the annihilation of Gaza.' },
  { id: 'ayoub', name: 'حسن ايوب', lang: 'ar',
    title: { ar: 'التضامن مع فلسطين: عندما ترتدّ أدوات القمع الاستعماريّ داخلياً', en: 'Solidarity with Palestine: When the Tools of Colonial Repression Turn Inward' },
    gist: 'يفحص كيف تستخدم حكومات غربية أدوات قمع استعمارية تاريخياً ضد حركات التضامن مع فلسطين داخل مجتمعاتها نفسها.' },
  { id: 'vlachou', name: 'Stefania Vlachou', lang: 'en',
    title: { ar: 'من الزنازين والأنفاق إلى إعادة التفكير في حقوق الإنسان خارج الفخّ الليبراليّ', en: 'From the Prison Cells and the Tunnels to Rethinking Human Rights Beyond the Liberal Trap' },
    gist: 'Argues for a solidarity rooted in Amílcar Cabral’s "return to the source," treating resistance as primary and international law as contested terrain.' },
  { id: 'jarrar', name: 'خالدة جرار', lang: 'ar',
    title: { ar: 'مقاربات للنضال التحرّريّ: أشكال التضامن العالميّة في تجارب الأسْر', en: 'Approaches to Emancipatory Struggle: Global Forms of Solidarity in Experiences of Captivity' },
    gist: 'تقرأ تجربة الأسرى وإضراباتهم عن الطعام كعدسة لفهم تبادل أشكال النضال والتضامن العالمي بين المجتمعات المضطهدة.' },
  { id: 'allahham', name: 'Mohammad Allahham', lang: 'en',
    title: { ar: 'من هو "الشعب"؟ الإقصاء الجندريّ وتقرير المصير وحدود التضامن التحرّريّ مع فلسطين', en: 'Who Are "the People"? Gendered Exclusion, Self-Determination, and the Limits of Emancipatory Solidarity with Palestine' },
    gist: 'Examines how official nationalist discourse constructs "the people" as a masculine subject, using Nancy Fraser’s three dimensions of justice.' },
  { id: 'husein', name: 'أسيل حسين', lang: 'ar',
    title: { ar: 'حركة التضامن مع فلسطين ومساءلة الشكل القانونيّ لحقوق الإنسان', en: 'The Palestine Solidarity Movement and the Questioning of the Legal Form of Human Rights' },
    gist: 'تقترح مؤشرين لتمييز التضامن التحرري عن التضامن الذي يعيد إنتاج علاقات الهيمنة داخل شبكاته نفسها.' },
  { id: 'tawil', name: 'حياة الطويل', lang: 'ar',
    title: { ar: 'الحقّ في الصحّة بين الإبادة والسوق: نحو تضامن أمميّ قائم على المنفعة المشتركة وحقوق إنسان تحرّريّة', en: 'The Right to Health between Genocide and the Market: Towards an Internationalist Solidarity based on Common Benefit and Emancipatory Human Rights' },
    gist: 'تجادل بأن تضامن العاملين الصحيين حول العالم مع زملائهم في غزة نموذج لتضامن قائم على مصلحة مشتركة لا إغاثة فقط.' },
  { id: 'checa-hidalgo', name: 'Diego Checa Hidalgo', lang: 'en',
    title: { ar: 'الجامعات في مواجهة الإبادة: التضامن مع فلسطين في مجتمعات التعليم العالي الإسبانيّة', en: 'Universities Against the Genocide: Solidarity with Palestine in the Spanish Higher Education Communities.' },
    gist: 'Traces four phases in Spanish universities’ response to the genocide in Gaza, from ethical statements to collective action.' },
  { id: 'habboob-hindi', name: 'Belén Habboob Martos and Nadia Hindi Mediavilla', authors: ['Belén Habboob Martos', 'Nadia Hindi Mediavilla'], lang: 'en',
    title: { ar: 'حركة التضامن مع فلسطين في جامعة غرناطة: من الاستجابة الأخلاقيّة إلى إعادة التسييس', en: 'Palestine Solidarity Movement at the University of Granada: From Ethical Response to Repoliticisation' },
    gist: 'Analyses how University of Granada mobilisations (2023–2025) moved from ethical empathy to academic boycott and repoliticisation.' },
  { id: 'tamimi', name: 'Tamara Tamimi', lang: 'en',
    title: { ar: 'تحدّي الحصانة الإسرائيليّة: التضامن بين دول الجنوب، والحشد الجماهيريّ، وحدود التغيير السياسيّ', en: 'Challenging Israeli Impunity: South–South Solidarity, Grassroots Mobilization, and the Limits of Political Change' },
    gist: 'Examines how Global South state initiatives and grassroots mobilisation reinforce, or fail to reinforce, each other against Israeli impunity.' },
  { id: 'ishaq-qassis', name: 'القسيس منذر اسحق ورفعت قسيس', authors: ['القسيس منذر اسحق', 'رفعت قسيس'], lang: 'ar',
    title: { ar: 'دور المسيحيّين الفلسطينيّين في تحوّلات مواقف الكنائس الغربيّة تجاه القضيّة الفلسطينيّة: كايروس فلسطين نموذجاً', en: 'The Role of Palestinian Christians in Transforming Western Churches’ Positions on the Palestinian Cause: Kairos Palestine as a Model' },
    gist: 'يتناول دور حركة كايروس فلسطين ووثيقتيها في إعادة تشكيل الخطاب اللاهوتي الغربي وحشد التضامن الكنسي.' },
  { id: 'chahabi', name: 'Anarim Chahabi', lang: 'en',
    title: { ar: 'صناعة التضامن الحميمة: القرابة والتعبئة السياسيّة عبر العائلات الفلسطينيّة في لبنان والدنمارك', en: 'The Intimate Making of Solidarity: Kinship and Political Mobilization across Palestinian Families in Lebanon and Denmark' },
    gist: 'Ethnographic fieldwork on how kinship ties between refugee camps in Lebanon and Denmark translate into political mobilisation.' },
  { id: 'kruger', name: 'Thalia Kruger and Eman AlAsah', authors: ['Thalia Kruger', 'Eman AlAsah'], lang: 'en',
    title: { ar: 'أشكال التضامن في سبيل حقوق الإنسان: الفكر عبر-الإفريقيّ مثالاً', en: 'Specific Solidarities in Search of Human Rights: Pan-Africanism as One Example' },
    gist: null },
];

// A paper's title in the given language (falls back to the other one)
const titleIn = (a, lang) => {
  const t = a.title || {};
  if (t[lang]) return { text: t[lang], lang };
  const other = lang === 'ar' ? 'en' : 'ar';
  return t[other] ? { text: t[other], lang: other } : null;
};

// Optional profile details, keyed by the person's name exactly as written above (one entry per person,
// so co-authors of the same paper each get their own). Bios are per language: the popup shows the one
// matching the page language, and falls back to the other if only one is available.
//   'Name': { photo: 'assets/people/name.jpg', bio: { ar: '...', en: '...' } }
// Participants who are not presenting a paper (e.g. hosts, chairs). They appear in Participants with their
// bio, but not under Abstracts or in the Programme, and their popup has no "Speaking on" part.
const OTHER_PARTICIPANTS = [
  // Opening remarks: the President of Birzeit University, then the Director of Muwatin
  'طلال شهوان',
  'مضر قسيس',
  // Keynote speakers
  'Andrea Sangiovanni', 'Salim Valley',
  // Session chairs, in programme order
  'Basem Izbidi', 'George Giacaman', 'Basil Farraj', 'Lena Meari', 'Rahaf Salahat', 'Ahmad Attallah',
];
const ALL_ENTRIES = [
  ...OTHER_PARTICIPANTS.map((name) => ({ id: null, name, lang: 'ar', noPaper: true })), // listed first (hosts)
  ...ABSTRACTS,
];

const PROFILES = {
  'مضر قسيس': {
    name: { ar: 'مضر قسيس', en: 'Mudar Kassis' },
    photo: 'assets/people/kassis.png',
    cutout: true,
    bio: {
      ar: 'عضو الهيئة الأكاديمية في دائرة الفلسفة والدراسات الثقافية بجامعة بيرزيت، ومدير معهد مواطن للديمقراطية وحقوق الإنسان، وبرنامج الماجستير في الديمقراطية وحقوق الإنسان. تنطلق اهتماماته البحثية الراهنة من تراث فلسفة الممارسة، وتركّز على قضايا التحوّل الديمقراطي، ونزع الاستعمار والتحرّر، ومفهوم الكرامة والحياة اليومية، وأخلاقيات البحث العلمي، والفساد السياسي، والشعبوية.',
      en: 'He is a faculty member in the Department of Philosophy and Cultural Studies at Birzeit University, and Director of the Muwatin Institute for Democracy and Human Rights and the Master’s Program in Democracy and Human Rights. His current research interests are grounded in the tradition of the philosophy of praxis and focus on democratisation, decolonisation and emancipation, the concepts of dignity and everyday life, research ethics, political corruption, and populism.',
    },
  },
  'خالدة جرار': {
    name: { ar: 'خالدة جرار', en: 'Khalida Jarrar' },
    photo: 'assets/people/jarrar.png',
    cutout: true,
    bio: {
      ar: 'باحثة متطوعة في معهد مواطن للديمقراطية وحقوق الإنسان، تعمل على بحث بعنوان "الأبعاد الطبقية والنوع اجتماعية للحركة الأسيرة وانعكاساتها في المشروع التحرري"، وأسيرة سابقة.',
      en: 'A volunteer researcher at the Muwatin Institute, working on a study titled “The Class and Gender Dimensions of the Prisoner Movement and Their Reflections on the Liberation Project.” She is a former detainee in Israeli prisons.',
    },
  },
  'أسيل حسين': {
    name: { ar: 'أسيل حسين', en: 'Aseel Hussein' },
    photo: 'assets/people/hussein.png',
    cutout: true,
    bio: {
      ar: 'طالبة ماجستير في برنامج الديمقراطية وحقوق الإنسان في جامعة بيرزيت. تعمل حالياً على إعداد دراسة بعنوان: "مستقبل منظومة حقوق الإنسان وإمكاناتها في سياق التحولات والأزمات المعاصرة للنظام العالمي"، التي تبحث في التحديات التي تواجه منظومة حقوق الإنسان في ظل التحولات الجيوسياسية والأزمات المتصاعدة في النظام العالمي، وإمكانات إعادة التفكير في أدوارها ووظائفها ضمن نظام عالمي متغير ومتحول.',
      en: 'Master’s student in the Democracy and Human Rights Program at Birzeit University. She is currently preparing a study entitled “The Future of the Human Rights System and Its Possibilities in the Context of Contemporary Transformations and Crises in the World Order.” The study examines the challenges facing the human rights system amid ongoing geopolitical transformations and escalating crises, and explores possibilities for rethinking its roles and functions within a changing global order.',
    },
  },
  'Tareq Sadeq': {
    name: { ar: 'طارق صادق', en: 'Tareq Sadeq' },
    photo: 'assets/people/sadeq.png?v=3',
    cutout: true,
    bio: {
      ar: 'عميد كلية الأعمال والاقتصاد وعضو الهيئة الأكاديمية في جامعة بيرزيت.',
      en: 'Dean of the Faculty of Business and Economics and faculty member at Birzeit University.',
    },
  },
  'Bayan M. Arqawi': {
    name: { ar: 'بيان عرقاوي', en: 'Bayan M. Arqawi' },
    photo: 'assets/people/arqawi.png',
    cutout: true,
    bio: {
      ar: 'عضو الهيئة الأكاديمية في دائرة العلوم المالية والمصرفية في جامعة بيرزيت منذ عام 2016. أنهت الدكتوراه في جامعة بوند في أستراليا. تَرتكز اهتماماتها البحثية في النظريات القانونية للتنمية المالية. عملت مديرة للتحليل المالي في قطاع الاتصالات وتكنولوجيا المعلومات قبل أن تلتحق بالحقل الأكاديمي. وهي كذلك ناشطة في حماية حقوق الحيوان.',
      en: 'Faculty member at the Department of Banking and Finance at Birzeit University since 2016. She finished her PhD studies at Bond University in Australia. Her research focuses on Legal Theories of Financial Development. She served as a Director of Financial Analysis in the ICT sector for three years before joining the academic field. She is also an animal rights activist.',
    },
  },
  'Thalia Kruger': {
    name: { ar: 'ثاليا كروجر', en: 'Thalia Kruger' },
    photo: 'assets/people/kruger.png',
    cutout: true,
    bio: {
      ar: 'عضو الهيئة الاكاديمية في القانون الدولي الخاص في مجموعة أبحاث القانون والتنمية في جامعة أنتويرب. تتركز اهتماماتها حول القضايا القانونية العابرة للحدود والدور الذي يمكن أن يلعبه القانون لتعزيز حماية حقوق الإنسان للأشخاص في المواقف المهمشة أو تعريضها للخطر. وفي هذا السياق، عملت في مجال قانون الدولي للأسرة، والعقود الدولية، وقانون الإجراءات الدولي.',
      en: 'Professor of Private International Law at the Law & Development Research Group of the University of Antwerp. Her interests are cross-border legal issues and the role the law can play to enhance or endanger the protection of human rights for people in marginalised positions. In this context she has worked in international family law as well as international contracts and international procedural law.',
    },
  },
};

// Everyone's name in both languages, spelt as in the final programme. Keys are the names used above.
const NAMES = {
  'مضر قسيس': ['مضر قسّيس', 'Mudar Kassis'],
  'طلال شهوان': ['طلال شهوان', 'Talal Shahwan'],
  'Andrea Sangiovanni': ['أندريا سانجوفاني', 'Andrea Sangiovanni'],
  'Salim Valley': ['سليم فالي', 'Salim Valley'],
  'Basem Izbidi': ['باسم الزبيدي', 'Basem Izbidi'],
  'George Giacaman': ['جورج جقمان', 'George Giacaman'],
  'Basil Farraj': ['باسل فرّاج', 'Basil Farraj'],
  'Lena Meari': ['لينة ميعاري', 'Lena Meari'],
  'Rahaf Salahat': ['رهف صلاحات', 'Rahaf Salahat'],
  'Ahmad Attallah': ['أحمد عطا الله', 'Ahmad Attallah'],
  'Jannis Julien Grimm': ['يانيس جوليان غريم', 'Jannis Julien Grimm'],
  'Bram J. De Smet': ['برام دي سميت', 'Bram J. De Smet'],
  'ياسمين الجعبة': ['ياسمين جعبة', 'Yasmeen Jubeh'],
  'Santosh Kumar': ['سانتوش كومار', 'Santosh Kumar'],
  'Sardar Saadi': ['سردار سعدي', 'Sardar Saadi'],
  'Yara Al Hindi': ['يارا الهندي', 'Yara Al Hindi'],
  'Bayan M. Arqawi': ['بيان عرقاوي', 'Bayan M. Arqawi'],
  'Tareq Sadeq': ['طارق صادق', 'Tareq Sadeq'],
  'حسن ايوب': ['حسن أيّوب', 'Hasan Ayoub'],
  'Stefania Vlachou': ['ستيفانيا ڤلاخو', 'Stefania Vlachou'],
  'خالدة جرار': ['خالدة جرّار', 'Khalida Jarrar'],
  'Mohammad Allahham': ['محمد اللحّام', 'Mohammad Allahham'],
  'أسيل حسين': ['أسيل حسين', 'Aseel Hussain'],
  'حياة الطويل': ['حياة الطويل', 'Hayat AlTaweel'],
  'Diego Checa Hidalgo': ['دييغو تشيكا إيدالغو', 'Diego Checa Hidalgo'],
  'Belén Habboob Martos': ['بيلين حبّوب مارتوس', 'Belén Habboob Martos'],
  'Nadia Hindi Mediavilla': ['نادية هندي ميدياڤيا', 'Nadia Hindi Mediavilla'],
  'Tamara Tamimi': ['تمارا تميمي', 'Tamara Tamimi'],
  'القسيس منذر اسحق': ['منذر اسحق', 'Munther Isaac'],
  'رفعت قسيس': ['رفعت قسّيس', 'Rifat Kassis'],
  'Anarim Chahabi': ['أناريم شهابي', 'Anarim Chahabi'],
  'Thalia Kruger': ['ثاليا كروجر', 'Thalia Kruger'],
  'Eman AlAsah': ['إيمان العصا', 'Eman AlAsah'],
};
for (const [key, [ar, en]] of Object.entries(NAMES)) {
  PROFILES[key] = PROFILES[key] || {};
  PROFILES[key].name = { ar, en };
}

// A person's name: if PROFILES gives it in both languages, both are written and the language toggle shows one
const escName = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const nameHtml = (person) => {
  const n = PROFILES[person] && PROFILES[person].name;
  if (!n || !n.ar || !n.en) return escName(person);
  return `<span data-i18n="ar" lang="ar" dir="rtl">${escName(n.ar)}</span><span data-i18n="en" lang="en" dir="ltr">${escName(n.en)}</span>`;
};
const nameIn = (person, lang) => (PROFILES[person] && PROFILES[person].name && PROFILES[person].name[lang]) || person;

// The first lines of the bio on a photo card, in both languages (the toggle shows one; CSS trims it to a few lines)
const cardBio = (p) => {
  if (!p.bio) return '';
  const one = (lang) => {
    const b = typeof p.bio === 'string' ? { text: p.bio, lang: null } : bioFor(p, lang);
    return b ? `<span class="card-bio" data-i18n="${lang}"${b.lang ? ` lang="${b.lang}" dir="${b.lang === 'ar' ? 'rtl' : 'ltr'}"` : ''}>${escName(b.text)}</span>` : '';
  };
  return one('ar') + one('en');
};

// Picks the bio in the page language, or the other language if that is all there is
const bioFor = (p, lang) => {
  if (!p || !p.bio) return null;
  if (typeof p.bio === 'string') return { text: p.bio, lang: null };
  const other = lang === 'ar' ? 'en' : 'ar';
  if (p.bio[lang]) return { text: p.bio[lang], lang };
  if (p.bio[other]) return { text: p.bio[other], lang: other };
  return null;
};

(() => {
  const abstractsEl = document.getElementById('abstracts-list');
  const participantsEl = document.getElementById('participants-list');
  const dirOf = (lang) => (lang === 'ar' ? 'rtl' : 'ltr');
  const T = {
    ar: { speaking: 'المداخلة', abstract: 'الملخص', close: 'إغلاق', prev: 'السابق', next: 'التالي', readAbstract: 'الملخص', prevAbs: 'الملخص السابق', nextAbs: 'الملخص التالي' },
    en: { speaking: 'Intervention', abstract: 'Abstract', close: 'Close', prev: 'Previous participant', next: 'Next participant', readAbstract: 'Abstract', prevAbs: 'Previous abstract', nextAbs: 'Next abstract' },
  };
  const uiLang = () => document.body.dataset.lang || 'ar';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pendingLabel = { ar: 'العنوان قيد الإعداد', en: 'Title to be announced' };
  const pendingGist = { ar: 'الملخص قيد الإعداد.', en: 'Abstract to be announced.' };
  const authorsOf = (a) => a.authors || [a.name];

  // The avatar shows the first letter of the name itself, not of a title such as القسيس
  const initialOf = (name) => name.replace(/^القسيس\s+/, '').trim().charAt(0);

  // Floating card (native <dialog>: Esc, backdrop and focus handling come for free); used for people and abstracts
  const dlg = document.createElement('dialog');
  dlg.className = 'profile-dialog';
  document.body.appendChild(dlg);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

  // Previous / next arrows; `list` is the sequence to step through
  const addNav = (labels, go) => {
    dlg.insertAdjacentHTML('beforeend', `
      <button class="profile-nav profile-prev" type="button" aria-label="${labels[0]}"><span aria-hidden="true" dir="ltr">${uiLang() === 'ar' ? '›' : '‹'}</span></button>
      <button class="profile-nav profile-next" type="button" aria-label="${labels[1]}"><span aria-hidden="true" dir="ltr">${uiLang() === 'ar' ? '‹' : '›'}</span></button>`);
    dlg.querySelector('.profile-prev').addEventListener('click', () => go(-1));
    dlg.querySelector('.profile-next').addEventListener('click', () => go(1));
    dlg.onkeydown = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      // In Arabic, "next" is to the left
      const forward = uiLang() === 'ar' ? e.key === 'ArrowLeft' : e.key === 'ArrowRight';
      go(forward ? 1 : -1);
    };
  };
  const show = () => {
    dlg.querySelector('.profile-close').addEventListener('click', () => dlg.close());
    if (!dlg.open) dlg.showModal();
    dlg.focus();
  };

  // A person's card. `a` is their paper (or { noPaper: true } for hosts, chairs and keynote speakers).
  const openProfile = (person, a = { noPaper: true, lang: 'ar' }, fromAbstract = false) => {
    const p = PROFILES[person] || {};
    const lang = uiLang();
    const ui = T[lang];
    const bio = bioFor(p, lang);
    const shown = nameIn(person, lang);
    dlg.className = 'profile-dialog';
    dlg.classList.toggle('has-cutout', !!p.cutout);
    const avatar = p.photo
      ? `<img class="profile-photo" src="${esc(p.photo)}" alt="">`
      : `<div class="profile-photo profile-initial" aria-hidden="true">${esc(initialOf(shown))}</div>`;
    const nameLang = p.name ? lang : a.lang;
    const nameTag = `<h3 class="profile-name" lang="${nameLang}" dir="${dirOf(nameLang)}">${esc(shown)}</h3>`;
    const bioTag = bio ? `<p class="profile-bio"${bio.lang ? ` lang="${bio.lang}" dir="${dirOf(bio.lang)}"` : ''}>${esc(bio.text)}</p>` : '';
    // "Intervention": the paper title, which opens its abstract
    const t = a.noPaper ? null : titleIn(a, lang);
    const paperTag = fromAbstract || a.noPaper ? '' : `
      <a class="profile-paper-card" href="#abs-${a.id}">
        <span class="profile-kicker">${ui.speaking}</span>
        <span class="profile-paper-quote" lang="${t ? t.lang : lang}" dir="${dirOf(t ? t.lang : lang)}">${esc(t ? t.text : pendingLabel[lang])}</span>
        <span class="profile-paper-go">${ui.readAbstract}</span>
      </a>`;
    dlg.innerHTML = p.cutout
      ? `
      <button class="profile-close" type="button" aria-label="${ui.close}">×</button>
      ${nameTag}
      <div class="profile-body">
        <span class="profile-float-spacer"></span>
        <img class="profile-cutout" src="${esc(p.photo)}" alt="" style="shape-outside: url('${esc(p.photo)}')">
        ${bioTag}
        ${paperTag}
      </div>`
      : `
      <button class="profile-close" type="button" aria-label="${ui.close}">×</button>
      ${avatar}
      ${nameTag}
      ${bioTag}
      ${paperTag}`;
    // Previous / next participant (in the order they are listed on the page); not for people outside that list
    const idx = PEOPLE.findIndex((x) => x.person === person);
    if (idx >= 0) {
      addNav([ui.prev, ui.next], (step) => {
        const n = PEOPLE[(idx + step + PEOPLE.length) % PEOPLE.length];
        openProfile(n.person, n.a);
      });
    } else {
      dlg.onkeydown = null;
    }
    dlg.querySelector('.profile-paper-card')?.addEventListener('click', (e) => { e.preventDefault(); openAbstract(a); });
    show();
    const img = dlg.querySelector('.profile-body .profile-cutout');
    if (img) { fitFloat(); if (!img.complete) img.addEventListener('load', fitFloat, { once: true }); }
  };

  // An abstract's card: title, the authors (each opens their card), and the abstract itself
  const openAbstract = (a) => {
    const lang = uiLang();
    const ui = T[lang];
    const t = titleIn(a, lang);
    const text = a.abstract || a.gist;
    const body = text
      ? `<div class="abstract-text" lang="${a.lang}" dir="${dirOf(a.lang)}">${text.split(/\n\s*\n/).map((para) => `<p>${esc(para)}</p>`).join('')}</div>`
      : `<div class="abstract-text is-empty">${pendingGist[lang]}</div>`;
    dlg.className = 'profile-dialog abstract-dialog';
    // A sheet of paper on the backdrop: long abstracts lengthen the sheet and the whole view scrolls, like a page
    dlg.innerHTML = `
      <article class="abstract-sheet">
        <button class="profile-close" type="button" aria-label="${ui.close}">×</button>
        <header class="abstract-head">
          <span class="profile-kicker">${ui.abstract}</span>
          <h3 class="abstract-title" lang="${t ? t.lang : lang}" dir="${dirOf(t ? t.lang : lang)}">${esc(t ? t.text : pendingLabel[lang])}</h3>
          <p class="abstract-names">${speakersHtml(a, lang)}</p>
        </header>
        ${body}
      </article>`;
    dlg.scrollTop = 0;
    dlg.querySelectorAll('.abstract-names .person-link').forEach((b) => {
      b.addEventListener('click', () => openProfile(b.dataset.person, a, true));
    });
    const idx = ABSTRACTS.indexOf(a);
    addNav([ui.prevAbs, ui.nextAbs], (step) => openAbstract(ABSTRACTS[(idx + step + ABSTRACTS.length) % ABSTRACTS.length]));
    show();
  };

  // A clickable name, written in the given language
  const personLink = (person, lang) =>
    `<button class="person-link" type="button" data-person="${esc(person)}">${esc(nameIn(person, lang))}</button>`;
  // A paper's speakers, joined the way the programme writes them ("A وB وC" / "A, B, and C")
  const speakersHtml = (a, lang) => {
    const names = authorsOf(a).map((p) => personLink(p, lang));
    if (lang === 'ar') return names.join(' و');
    if (names.length < 3) return names.join(' and ');
    return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
  };

  // The photo sits in the bottom-left corner and the text flows around her outline, using the space above the head.
  // A float can't be pinned to the bottom, so an invisible spacer above it is sized to push it down
  // until its bottom lines up with the end of the text.
  const fitFloat = () => {
    const body = dlg.querySelector('.profile-body');
    if (!body) return;
    const sp = body.querySelector('.profile-float-spacer');
    const img = body.querySelector('.profile-cutout');
    if (window.matchMedia('(max-width: 640px)').matches || !img.offsetHeight) { sp.style.height = '0px'; return; }
    const ph = img.offsetHeight;
    const textEnd = () => {
      const last = body.lastElementChild;
      return last.offsetTop + last.offsetHeight + parseFloat(getComputedStyle(last).marginBottom || 0) - body.offsetTop;
    };
    let h = 0;
    sp.style.height = '0px';
    for (let i = 0; i < 8; i++) {
      const next = Math.max(0, textEnd() - ph);
      if (Math.abs(next - h) < 1) break;
      h = next;
      sp.style.height = `${h}px`;
    }
    if (textEnd() > h + ph) sp.style.height = `${textEnd() - ph}px`;
  };
  window.addEventListener('resize', () => { if (dlg.open) fitFloat(); });
  const PEOPLE = ALL_ENTRIES.flatMap((a) => authorsOf(a).map((person) => ({ person, a })));

  for (const a of ALL_ENTRIES) {
    if (participantsEl) {
      for (const person of authorsOf(a)) {
        const card = document.createElement('div');
        card.className = 'participant-card';
        const prof = PROFILES[person];
        const media = prof && prof.cutout
          ? `<img class="cutout" src="${esc(prof.photo)}" alt="" loading="lazy">`
          : prof && prof.photo
          ? `<img class="avatar avatar-photo" src="${esc(prof.photo)}" alt="" loading="lazy">`
          : `<span class="avatar" aria-hidden="true"><span data-i18n="ar">${esc(initialOf(nameIn(person, 'ar')))}</span><span data-i18n="en">${esc(initialOf(nameIn(person, 'en')))}</span></span>`;
        if (prof && prof.cutout) card.classList.add('has-cutout');
        card.innerHTML = `
          <button class="person-btn" type="button">
            ${prof && prof.cutout ? '' : media}
            <span class="name" lang="${a.lang}" dir="${dirOf(a.lang)}">${nameHtml(person)}</span>
            ${prof && prof.cutout ? `${cardBio(prof)}${prof.bio ? `<span class="card-more"><span data-i18n="ar">المزيد</span><span data-i18n="en" lang="en" dir="ltr">Read more</span></span>` : ''}${media}` : ''}
          </button>`;
        card.querySelector('.person-btn').addEventListener('click', () => openProfile(person, a));
        participantsEl.appendChild(card);
      }
    }

    // Abstract cards: just the title and the speakers; the card opens the abstract
    if (abstractsEl && !a.noPaper) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'abstract-card';
      card.id = `abs-${a.id}`;
      card.innerHTML = ['ar', 'en'].map((lang) => {
        const t = titleIn(a, lang);
        const names = authorsOf(a).map((p) => esc(nameIn(p, lang)));
        const joined = lang === 'ar' ? names.join(' و') : names.length < 3 ? names.join(' and ') : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
        return `<span class="abstract-card-inner" data-i18n="${lang}" lang="${lang}" dir="${dirOf(lang)}">
          <span class="paper-title"${t && t.lang !== lang ? ` lang="${t.lang}" dir="${dirOf(t.lang)}"` : ''}>${esc(t ? t.text : pendingLabel[lang])}</span>
          <span class="name">${joined}</span>
        </span>`;
      }).join('');
      card.addEventListener('click', () => openAbstract(a));
      abstractsEl.appendChild(card);
    }
  }

  // Participants: everyone with a photo gets the full card, in an even grid. People whose photo and bio
  // haven't arrived yet are shown as small cards underneath, and move up into the grid once a photo is added.
  if (participantsEl) {
    const featured = document.createElement('div');
    featured.className = 'participants-featured';
    const rest = document.createElement('div');
    rest.className = 'participants-rest';
    for (const card of Array.from(participantsEl.children)) {
      (card.classList.contains('has-cutout') ? featured : rest).appendChild(card);
    }
    participantsEl.append(featured, rest);
    if (!rest.children.length) rest.remove();
    // The popup's previous / next follow the same order as on the page
    const hasPhoto = (x) => (PROFILES[x.person] && PROFILES[x.person].cutout ? 0 : 1);
    PEOPLE.sort((p, q) => hasPhoto(p) - hasPhoto(q));
  }

  // Tall (portrait) photos are shown whole instead of cropped in on the face
  const markTall = (img) => { if (img.naturalHeight > img.naturalWidth * 1.2) img.classList.add('tall'); };
  document.addEventListener('load', (e) => { if (e.target.tagName === 'IMG') markTall(e.target); }, true);
  document.querySelectorAll('img').forEach((img) => img.complete && markTall(img));

  // ----- Programme: the final programme (Programme AR/EN 261116), followed exactly in each language -----
  // {{key}} in a line is a person's name (a key of NAMES), written in that language and opening their card.
  const byId = Object.fromEntries(ABSTRACTS.map((a) => [a.id, a]));
  const DAYS = [
    {
      ar: 'اليوم الأوّل - الثلاثاء، 15 كانون الأوّل/ديسمبر 2026',
      en: 'First Day - Tuesday, 15 December 2026',
      items: [
        { time: '9:00', ar: 'تسجيل', en: 'Morning Coffee and Registration' },
        { time: '9:30', ar: 'كلمات افتتاحيّة', en: 'Opening Remarks',
          lines: {
            ar: ['كلمة {{طلال شهوان}} رئيس جامعة بيرزيت', 'كلمة {{مضر قسيس}} مدير معهد مواطن للديمقراطيّة وحقوق الإنسان'],
            en: ['Address by the President of Birzeit University', 'Address by the Director of Muwatin Institute of Democracy and Human Rights'],
          } },
        { time: '10:00', keynote: true, ar: 'كلمة {{Andrea Sangiovanni}} المفتاحيّة حول قيمة التضامن', en: 'Keynote Address by {{Andrea Sangiovanni}} on The Value of Solidarity' },
        { time: '10:45', ar: 'استراحة', en: 'Break' },
        { time: '11:00', chair: 'Basem Izbidi',
          ar: { label: 'الجلسة الأولى:', title: 'كيف نفهم التضامن وكيف يعمل؟', chairLabel: 'رئيس الجلسة:' },
          en: { label: 'Session I:', title: 'How to Understand Solidarity and How it Works', chairLabel: 'Chair:' },
          papers: ['grimm', 'de-smet', 'jaaba'] },
        { time: '12:30', chair: 'George Giacaman',
          ar: { label: 'الجلسة الثانية:', title: 'وقائع تضامنيّة', chairLabel: 'رئيس الجلسة:' },
          en: { label: 'Session II:', title: 'Acts of Solidarity', chairLabel: 'Chair:' },
          papers: ['kumar', 'saadi', 'hindi-arqawi-sadeq'] },
        { time: '14:00', ar: 'غداء', en: 'Lunch' },
        { time: '14:45', chair: 'Basil Farraj',
          ar: { label: 'الجلسة الثالثة:', title: 'إرهاصات وتداعيات التضامن', chairLabel: 'رئيس الجلسة:' },
          en: { label: 'Session III:', title: 'The Precursors and Repercussions of Solidarity', chairLabel: 'Chair:' },
          papers: ['ayoub', 'vlachou', 'jarrar'] },
      ],
    },
    {
      ar: 'اليوم الثاني - الأربعاء، 16 كانون الأوّل/ديسمبر 2026',
      en: 'Second Day - Wednesday, 16 December 2026',
      items: [
        { time: '9:30', ar: 'قهوة', en: 'Morning Coffee and Registration' },
        { time: '10:00', keynote: true, ar: 'كلمة {{Salim Valley}} المفتاحيّة', en: 'Keynote Address by {{Salim Valley}}' },
        { time: '10:45', chair: 'Lena Meari',
          ar: { label: 'الجلسة الرابعة:', title: 'التضامن حول الحقوق', chairLabel: 'رئيسة الجلسة:' },
          en: { label: 'Session IV:', title: 'Solidarity Around Rights', chairLabel: 'Chair:' },
          papers: ['allahham', 'husein', 'tawil'] },
        { time: '12:15', ar: 'استراحة', en: 'Break' },
        { time: '12:30', chair: 'Rahaf Salahat',
          ar: { label: 'الجلسة الخامسة:', title: 'أنماط تضامنيّة متجدّدة', chairLabel: 'رئيسة الجلسة:' },
          en: { label: 'Session V', title: 'Emerging Forms of Solidarity', chairLabel: 'Chair:' },
          papers: ['checa-hidalgo', 'habboob-hindi', 'tamimi'] },
        { time: '14:00', ar: 'غداء', en: 'Lunch' },
        { time: '14:45', chair: 'Ahmad Attallah',
          ar: { label: 'الجلسة السادسة:', title: 'بنى قديمة لتضامن جديد؟', chairLabel: 'رئيس الجلسة:' },
          en: { label: 'Session VI:', title: 'Old Structures for New Solidarity?', chairLabel: 'Chair:' },
          papers: ['ishaq-qassis', 'chahabi', 'kruger'] },
      ],
    },
  ];

  const withNames = (line, lang) => esc(line).replace(/\{\{(.+?)\}\}/g, (_, key) => personLink(key.replace(/&amp;/g, '&'), lang));

  const rowHtml = (item, lang) => {
    const time = typeof item.time === 'string' ? item.time : item.time[lang];
    let body;
    let kind;
    if (item.papers) {
      const s = item[lang];
      kind = 'session';
      const papers = item.papers.map((id) => {
        const a = byId[id];
        const t = titleIn(a, lang);
        return `
          <li class="tt-paper">
            <button class="tt-paper-title" type="button" data-abs="${a.id}">${esc(t ? t.text : pendingLabel[lang])}</button>
            <span class="tt-speakers">${speakersHtml(a, lang)}</span>
          </li>`;
      }).join('');
      body = `
        <div class="tt-session-head">
          <span class="tt-session-name"><span class="tt-session-label">${esc(s.label)}</span> ${esc(s.title)}</span>
          <span class="tt-chair">${esc(s.chairLabel)} ${personLink(item.chair, lang)}</span>
        </div>
        <ul class="tt-papers">${papers}</ul>`;
    } else if (item.keynote) {
      kind = 'keynote';
      body = `<p class="tt-keynote-text">${withNames(item[lang], lang)}</p>`;
    } else {
      kind = item.lines ? 'opening' : 'break';
      body = `<p class="tt-label">${esc(item[lang])}</p>${item.lines ? `<div class="tt-lines">${item.lines[lang].map((l) => `<p>${withNames(l, lang)}</p>`).join('')}</div>` : ''}`;
    }
    return `<li class="tt-row tt-${kind}"><span class="tt-time">${time}</span><div class="tt-body">${body}</div></li>`;
  };

  const root = document.getElementById('program-days');
  if (root) {
    for (const day of DAYS) {
      const el = document.createElement('div');
      el.className = 'accordion program-day';
      el.innerHTML = `
        <button class="accordion-trigger program-day-trigger" type="button" aria-expanded="false">
          <span data-i18n="ar">${day.ar}</span>
          <span data-i18n="en" lang="en" dir="ltr">${day.en}</span>
        </button>
        <div class="accordion-panel">
          <div class="accordion-inner">
            <ol class="timetable" data-i18n="ar" lang="ar" dir="rtl">${day.items.map((it) => rowHtml(it, 'ar')).join('')}</ol>
            <ol class="timetable" data-i18n="en" lang="en" dir="ltr">${day.items.map((it) => rowHtml(it, 'en')).join('')}</ol>
          </div>
        </div>`;
      root.appendChild(el);
    }
    initAccordions(root);
    // Names open the person's card; titles open the abstract
    root.addEventListener('click', (e) => {
      const person = e.target.closest('.person-link');
      if (person) {
        const paper = ALL_ENTRIES.find((a) => authorsOf(a).includes(person.dataset.person));
        openProfile(person.dataset.person, paper || undefined);
        return;
      }
      const title = e.target.closest('.tt-paper-title');
      if (title) openAbstract(byId[title.dataset.abs]);
    });
  }
})();

initAccordions(document);

// Hero: threads gather into a twisted cable that runs across the screen; the copy comes forward alongside.
// Drawn on a canvas and driven by a time-based spring on the scroll position, so it stays fluid at any frame rate.
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileQuery = window.matchMedia('(max-width: 820px)');
  const hero = document.querySelector('.hero');
  const canvas = document.getElementById('threads');
  const visual = document.querySelector('.visual');
  const ctx = canvas.getContext('2d');

  const COLORS = ['#6B1E2E', '#1F2F4D', '#5E7A8C', '#7A8F7A', '#1B8A3F', '#C9962E'];
  const K = COLORS.length;
  const N = 36;
  const STEP = 5; // horizontal spacing between samples, in px
  const CHUNK = 10; // samples per depth-sorted piece of the cable

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smooth = (t) => t * t * t * (t * (t * 6 - 15) + 10);

  const rnd = (i, k) => {
    const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  // Every thread is a smooth function y(x) across the whole screen, with gentle curvature only.
  // Scattered: a slow, wide drift. Gathered: one long taper into the middle that runs straight into the
  // twist (no flat stretch in between). The gathering sweeps left to right, blending the two.
  let W = 0;
  let H = 0;
  let M = 0;
  let xs = [];
  let threads = [];
  let pieces = [];
  let ambient = false;
  let lite = false; // switched on automatically if frames get expensive
  let costEma = 0;

  const build = () => {
    W = visual.clientWidth;
    H = visual.clientHeight;
    if (!W || !H) return false;
    const dpr = Math.min(2, window.devicePixelRatio || 1, Math.sqrt(3.4e6 / (W * H)));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const mobile = mobileQuery.matches;
    ambient = !reduce && !mobile;

    const Y0 = H * (mobile ? 0.5 : 0.56); // keep in step with --cable-y in the CSS
    const band = H * (mobile ? 0.36 : 0.17);
    const X0 = W * (mobile ? 0.5 : 0.46); // where the threads have fully gathered
    const XA = X0 - W * 0.14; // the twist begins to appear here, while the taper is still closing
    const XB = X0 + W * 0.1; // ...and is fully formed here
    const XS = -40;
    const XE = W + 60;
    const AMP = clamp(H * 0.05, 14, 42);
    const LAMBDA = clamp(W * 0.12, 96, 170);
    const RIB = AMP * 0.3; // half-width of a strand's ribbon of threads
    // Loose threads stay below the title: above the cable they may only rise as far as the gap to the title
    const up = mobile ? band : Math.min(band, clamp(H * 0.11, 68, 104) - 6);
    const lim = (dy) => (dy < 0 ? dy * (up / band) : dy);

    M = Math.ceil((XE - XS) / STEP) + 1;
    xs = Array.from({ length: M }, (_, j) => XS + j * STEP);
    const jRamp = Math.floor((XA - XS) / STEP);

    // Each strand orbits the cable's axis: y is its height, z (depth) decides who is in front
    const angle = (k, x) => ((x - X0) / LAMBDA) * Math.PI * 2 + (k / K) * Math.PI * 2;

    threads = [];
    pieces = [];

    for (let i = 0; i < N; i++) {
      const k = i % K;
      const off = (rnd(i, 12) - 0.5) * 2 * RIB;
      const yStart = Y0 + (rnd(i, 1) - 0.5) * 2 * band;

      // Scattered: slow drift, no small wiggles
      const base = Y0 + (rnd(i, 7) - 0.5) * 2 * band * 0.85;
      const tilt = (rnd(i, 3) - 0.5) * 2 * band * 0.8;
      const a1 = band * (0.15 + rnd(i, 5) * 0.25);
      const w1 = W * (1.4 + rnd(i, 6) * 1.2);
      const p1 = rnd(i, 4) * Math.PI * 2;

      const sc = new Float32Array(M); // scattered
      const fn = new Float32Array(M); // gathered into the middle, no twist yet
      const tw = new Float32Array(M); // the twist, added once the threads have gathered
      const Z = new Float32Array(M);
      for (let j = 0; j < M; j++) {
        const x = xs[j];
        sc[j] = Y0 + lim(base + tilt * (x / W - 0.5) + a1 * Math.sin((2 * Math.PI * x) / w1 + p1) - Y0);

        const u = smooth(clamp((x - XS) / (X0 - XS)));
        const ramp = smooth(clamp((x - XA) / (XB - XA)));
        const z = Math.cos(angle(k, x));
        Z[j] = z;
        fn[j] = Y0 + lim(yStart - Y0) * (1 - u);
        tw[j] = AMP * ramp * Math.sin(angle(k, x)) + off * ramp * (0.55 + 0.45 * z); // the ribbon narrows as the strand turns away
      }

      const th = {
        sc,
        fn,
        tw,
        Z,
        py: new Float32Array(M),
        cc: new Float32Array(M),
        jmax: 0,
        color: COLORS[k],
        width: 1.3 + rnd(i, 6) * 1.0,
        alpha: 0.82 + rnd(i, 10) * 0.18,
        ph: rnd(i, 15) * Math.PI * 2,
        delay: 0.12 * rnd(i, 16),
        dur: 0.28 + rnd(i, 17) * 0.2,
        stag: rnd(i, 11) * 0.05,
      };
      threads.push(th);

      // The approach is one piece; the cable is cut into short chunks that are depth-sorted across threads
      pieces.push({ th, j0: 0, j1: jRamp, z: -2, cable: false });
      for (let j0 = jRamp; j0 < M - 1; j0 += CHUNK) {
        const j1 = Math.min(M - 1, j0 + CHUNK);
        let z = 0;
        for (let j = j0; j <= j1; j++) z += Z[j];
        pieces.push({ th, j0, j1, z: z / (j1 - j0 + 1), cable: true });
      }
    }

    pieces.sort((a, b) => a.z - b.z);
    return true;
  };

  const draw = (p, now) => {
    ctx.clearRect(0, 0, W, H);
    const t = ambient ? now * 0.001 : 0;

    for (const th of threads) {
      const h = smooth(clamp((p - th.delay) / th.dur));
      th.jmax = Math.floor(h * (M - 1));
      for (let j = 0; j <= th.jmax; j++) {
        const f = j / (M - 1);
        // 1) the threads gather, sweeping left to right; 2) only then does the twist unwind out of the bundle
        const gather = smooth(clamp((p - 0.1 - th.stag - 0.26 * f) / 0.28));
        const twist = smooth(clamp((p - 0.42 - 0.26 * f) / 0.26));
        th.cc[j] = twist;
        let y = th.sc[j] + (th.fn[j] - th.sc[j]) * gather + th.tw[j] * twist;
        // A faint sway while the threads are still loose; it settles as they gather
        if (ambient) y += (1 - gather) * 4 * Math.sin(t * 0.6 + xs[j] * 0.003 + th.ph);
        th.py[j] = y;
      }
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const trace = (th, j0, end) => {
      const path = new Path2D();
      path.moveTo(xs[j0], th.py[j0]);
      for (let j = j0 + 1; j <= end; j++) path.lineTo(xs[j], th.py[j]);
      return path;
    };

    // Soft sheen under the loose part of each thread
    ctx.globalAlpha = 0.09;
    for (const pc of pieces) {
      if (lite || pc.cable) continue;
      const end = Math.min(pc.j1, pc.th.jmax);
      if (end - pc.j0 < 1) continue;
      ctx.strokeStyle = pc.th.color;
      ctx.lineWidth = pc.th.width * 3.4;
      ctx.stroke(trace(pc.th, pc.j0, end));
    }

    // Threads. In the cable, depth decides who is in front: nearer pieces are fuller and brighter and cast
    // a faint shadow on what they cross, so the strands read as turning around each other.
    for (const pc of pieces) {
      const { th } = pc;
      const end = Math.min(pc.j1, th.jmax);
      if (end - pc.j0 < 1) continue;
      const path = trace(th, pc.j0, end);

      let width = th.width;
      let alpha = th.alpha;
      if (pc.cable) {
        const s = th.cc[Math.min(end, pc.j0 + (pc.j1 - pc.j0 >> 1))];
        const z = pc.z;
        width = th.width * (1 + s * 0.28 * z);
        alpha = th.alpha * (1 - s * 0.22 * (1 - z) * 0.5);
        const edge = s * (z + 1) * 0.5;
        if (!lite && edge > 0.12) {
          ctx.globalAlpha = 0.16 * edge;
          ctx.strokeStyle = '#1E1B17';
          ctx.lineWidth = width + 1.8;
          ctx.stroke(path);
        }
      }
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = th.color;
      ctx.lineWidth = width;
      ctx.stroke(path);
    }
    ctx.globalAlpha = 1;
  };

  const reveals = Array.from(document.querySelectorAll('[data-reveal]'));
  const REVEAL_AT = [-0.12, -0.08, -0.04]; // edition, title, dates (all fully shown on the first screen)

  // Copy comes forward out of the screen
  const updateCopy = (p) => {
    reveals.forEach((node) => {
      const t = smooth(clamp((p - REVEAL_AT[Number(node.dataset.reveal) || 0]) / 0.3));
      node.style.opacity = t;
      node.style.transform = t >= 1 ? '' : `translateY(${(1 - t) * 14}px) scale(${0.84 + 0.16 * t})`;
      node.style.filter = t >= 1 ? '' : `blur(${(1 - t) * 10}px)`;
    });
  };

  const START = 0.26;
  let heroTotal = 0;
  const measure = () => {
    heroTotal = hero.offsetHeight - window.innerHeight;
  };
  const progress = () => {
    if (reduce || mobileQuery.matches) return 1;
    // The page opens already partly drawn (START), so the first screen is never empty
    return heroTotal > 0 ? START + (1 - START) * clamp(window.scrollY / heroTotal) : 1;
  };

  let current = 0;
  let lastDrawn = -1;
  const loadedAt = performance.now();

  const redraw = (now = performance.now()) => {
    const t0 = performance.now();
    draw(current, now);
    // If drawing costs more than ~9 ms for a while, drop the sheen and edge strokes
    costEma = costEma ? costEma * 0.9 + (performance.now() - t0) * 0.1 : performance.now() - t0;
    if (!lite && costEma > 9) lite = true;
    if (current !== lastDrawn) updateCopy(current);
    lastDrawn = current;
  };

  if (reduce) {
    hero.classList.add('static');
    document.querySelectorAll('.reveal').forEach((node) => node.classList.add('static', 'in'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    );
    document.querySelectorAll('.reveal').forEach((node) => io.observe(node));
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      measure();
      if (build()) {
        current = progress();
        redraw();
      }
    }, 120);
  });

  measure();
  if (!build()) return;
  current = reduce || mobileQuery.matches ? progress() : 0; // desktop: ease in from empty on load
  redraw();

  // Scroll sets the target; a time-based spring carries the drawing there, so wheel steps blend into one motion
  if (!reduce) {
    let last = performance.now();
    let lastSway = 0;
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target = progress();
      const tau = now - loadedAt < 2600 ? 0.5 : 0.2; // a slower, softer arrival during the intro
      current += (target - current) * (1 - Math.exp(-dt / tau));
      if (Math.abs(target - current) < 0.0003) current = target;

      const onScreen = window.scrollY < heroTotal + window.innerHeight * 2;
      const moving = current !== lastDrawn;
      const swaying = ambient && current < 0.72 && now - lastSway > 33;
      if (onScreen && (moving || swaying)) {
        if (swaying) lastSway = now;
        redraw(now);
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
})();
