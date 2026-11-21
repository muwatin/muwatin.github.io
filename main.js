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
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
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
// Optional `abstract: { ar, en }` holds the full text in both languages (Full abstracts translated 261118; blank line
// between paragraphs); the popup shows the one in the page language instead of the gist.
const ABSTRACTS = [
  { id: 'grimm', name: 'Jannis Julien Grimm', lang: 'en',
    title: { ar: 'التضامن في ظروف مستحيلة: التضامن مع فلسطين في ألمانيا بين اللامبالاة العامة وقمع الدولة', en: 'Solidarity Under Impossible Conditions: Palestine Solidarity in Germany between Public Indifference and State Repression' },
    gist: 'Mixed-methods study of Palestine solidarity protest in Germany, and how repression both enables alliances and strains them.',
    abstract: {
      ar: 'في ظل أي شروط يتيح التضامن نضالاً سياسياً مشتركاً بين فاعلين يتموضعون مواقع مختلفة؟ لماذا تواجه الاحتجاجات التضامنية مع فلسطين في ألمانيا حدوداً في قدرتها على استقطاب مشاركين جدد\n\n، رغم أن رغم أن عموم السكان ينظرون بإيجابية إلى المظالم التي تستند إليها هذه الاحتجاجات؟\n\nتفحص هذه المساهمة كيفية تشابك التعبئة ضد العنف الاستعماري في فلسطين مع الطعن في التواطؤ المؤسسي والإقصاء العنصري والنزعات السلطوية في ألمانيا. ولفحص شروط احتجاج التضامن في ألمانيا وحدوده، تجمع المساهمة نتائج مستمدة من تحليلات أصلية لأحداث الاحتجاج، والملاحظة الإثنوغرافية في أكثر من 100 فعالية احتجاجية، وعشرات المقابلات السردية، ومسحٍ للتعبئة الجماهيرية في برلين في أيلول/سبتمبر 2025، وشهادات طلابية جُمعت عبر جلسات استشارية وورشات حوارية بين عامي 2023 و2025. ومن خلال مفهمة التضامن عبر منطقيات مترابطة ثلاث، هي المناشدة والمساءلة والانتماء، يستكشف التحليل كيف يحافظ الفعل الجماعي على الحضور الفلسطيني والفاعلية السياسية الفلسطينية في ظل القمع. وتُظهر نتائج المسح تعبئةً تتجاوز منظمات التضامن القائمة، مقرونةً بالتزامات ديمقراطية وبانعدام الثقة في المؤسسات السياسية والأمنية. ويتتبّع البحث في الحرم الجامعي كيف تربط ممارسات الشرطة والرقابة والخذلان المؤسسي بين التضامن مع الفلسطينيين والصراعات حول الحرية الأكاديمية والاعتراف والحدود المشروعة للمعارضة. وتكشف هذه الديناميات إمكانات تشكيل نضال مشترك وحدوده في آن معاً؛ فالقمع قد يولّد تحالفات ومظالم مشتركة، لكنه قد يعزّز أيضاً الحدود الداخلية، والتفاوت في مستويات التعرض للمخاطر، وإنهاك الناشطين. ولذلك تُبرز المساهمة الشروط التنظيمية والعلائقية التي يدوم التضامن من خلالها: الدعم القانوني، والعون المتبادل، والحداد الجماعي، وممارسات الإصغاء المستدامة عبر الاختلاف. وتحاجج بأن الإمكانات التحررية للتضامن تقوم على ترجمة المعارضة المشتركة إلى بنى تحتية دائمة للمساءلة والرعاية، تُمكّن من الفعل الجماعي عبر مواقع غير متكافئة وتجارب متباينة.',
      en: 'Under what conditions does solidarity enable a common political struggle across differently situated actors? And why does Palestine solidarity protest in Germany meet recruitment limits even though its underlying grievances are viewed favorably by the general population? This contribution examines how mobilisation against colonial violence in Palestine becomes intertwined with contestation of institutional complicity, racialised exclusion and authoritarian tendencies in Germany. To examine the conditions and limits of solidarity protest in Germany, it synthesises findings from original protest event analyses, ethnographic observation at 100+ protest events, several dozen narrative interviews, a survey of Berlin’s September 2025 mass mobilisation, and student testimonies collected through consultation sessions and dialogue workshops between 2023 and 2025. Conceptualising solidarity through the interrelated logics of appeal, accountability and belonging, the analysis explores how collective action sustains Palestinian presence and political agency under conditions of repression. Survey findings demonstrate mobilisation beyond established solidarity organisations, alongside democratic commitments and distrust of political and security institutions. Campus research traces how policing, censorship and institutional abandonment connect solidarity with Palestinians to struggles over academic freedom, recognition and the legitimate boundaries of dissent. These dynamics reveal both the possibilities and the limits of constituting common struggle. Repression can generate alliances and shared grievances, but also reinforce internal boundaries, uneven exposure to risk and activist exhaustion. The contribution therefore foregrounds the organisational and relational conditions through which solidarity endures: legal support, mutual aid, collective mourning and sustained practices of listening across difference. It argues that solidarity’s emancipatory potential rests on translating shared opposition into durable infrastructures of accountability and care that enable collective action across unequal positions and divergent experiences.',
    } },
  { id: 'de-smet', name: 'Bram J. De Smet', lang: 'en',
    title: { ar: 'التصعيد الديكولونياليّ: كيف تتعلّم الحركات الرفضَ في ظلّ سياسات التهدئة', en: 'Decolonial Escalation: How Movements Learn to Refuse Under Pacification' },
    gist: 'Ethnographic study of Helsinki de-escalation volunteers, proposing "decolonial escalation" and hope as infrastructure for sustained refusal.',
    abstract: {
      ar: 'منذ تشرين الأول/أكتوبر 2023، ملأ التضامن مع فلسطين شوارع فنلندا أكثر من مئة مرة، فيما بقيت البنى التي تشير إليها بمنأى عن أي زعزعة تُذكر. فالمسيرات يُسمح بها لأنها قابلة للاحتواء. وهذا هو الشرط الذي ينبغي أن يبقى حاضراً عند الإجابة عن السؤال التالي: هل يبقى التضامن تعاطفاً مع الضحية، أم يغدو احتجاجاً على الظرف العالمي؟ تجيب الورقة عن هذا السؤال من الداخل، عبر بحث إثنوغرافي وإثنوغرافي ذاتي (auto-ethnographic) بين متطوعي "خفض التصعيد" الذين يتولّون حماية المظاهرات في هلسنكي، وتقترح مفهوم "التصعيد الديكولونيالي" (أي التصعيد في اتجاه نزع الاستعمار). فالعمل اليومي الحمائي والعلائقي الذي يؤديه هؤلاء المتطوعون يُساء فهمه بوصفه تهدئةً واحتواء، في حين أنه بيداغوجيا تبلور القدرة الجماعية على الرفض، وتعلّم مسؤوليةً عابرةً للحدود. أما سياسات التهدئة فتتقاسم معه التقنية ذاتها، ولا تختلف عنه إلا في اتجاه القدرة التي تُنتجها. وتُقرأ هنا وثيقة "خفض التصعيد" التي وضعتها الحركة بنفسها وتواصل مراجعتها باستمرار، بوصفها نظريةً ومنهاجاً كتبته حركةٌ لنفسها، لا بوصفها بياناتٍ تخضع للترميز؛ ففي مواجهة نزعة استخراجية تنقّب في الحراكات بحثاً عن مادة إمبريقية بينما تنكر قدرتها النظرية، يُتعامل مع الناشطين بوصفهم منظّرين لممارستهم. وحين يُفهم الأمل بوصفه بنيةً تحتية للعمل السياسي لا تفاؤلاً، تغدو القدرة المستدامة التي تنتجها هذه البيداغوجيا شرطاً مسبقاً لا نقطةَ نهاية. فالأمل يُديم الفعل كي يُعيد توجيهه: نحو اتساع المشاركة وديمومتها، واللاتعاون المستدام، والبناء الاستباقي الذي يجسّد في الحاضر ملامح البديل المنشود، وهو ما لا يستطيع نظامٌ قائم على الاحتواء أن يهضمه بسهولة. إن تضامناً لا يُديم سوى الفعل القابل للاحتواء لم يفِ بعد بما يدين به لأولئك الذين يُقدَّم باسمهم.',
      en: 'Since October 2023, Palestine solidarity in Finland has filled the streets more than a hundred times, and the structures it names continue largely undisturbed. The marches are permitted because they can be absorbed. This is the condition under which the question has to be answered: whether solidarity remains sympathy with a victim, or becomes protest against the global condition. The paper answers it from within, through ethnographic and auto-ethnographic research among the de-escalation volunteers who protect demonstrations in Helsinki, and proposes decolonial escalation. The protective, relational everyday work these volunteers perform is misread as calming and containment; it is a pedagogy that builds the collective capacity to refuse and teaches a responsibility that crosses borders. Pacification shares its technique and differs only in the direction of the capacity produced. The movement\'s own continuously revised de-escalation document is read here as theory and as a curriculum a movement has written for itself, not as data to be coded: against an extractivism that mines movements for empirical content while denying their theoretical capacity, activists are treated as theorists of their own practice. With hope understood as infrastructure rather than optimism, the sustained capacity this pedagogy produces becomes a precondition and not an endpoint. Hope sustains in order to redirect, toward the breadth and durability of participation, sustained non-cooperation and prefigurative building that an absorptive order cannot easily metabolise. A solidarity that sustains only absorbable action has not yet discharged what it owes to those in whose name it is offered.',
    } },
  { id: 'jaaba', name: 'ياسمين الجعبة', lang: 'ar',
    title: { ar: 'التشكّل التاريخيّ والتحوّلات المفهوميّة للتضامن', en: 'Historical Formation and Conceptual Transformations of Solidarity' },
    gist: 'تتتبع محطات تشكل مفهوم التضامن تاريخياً، وكيف تحول إلى كلمة طنانة تتسع لمعانٍ متعددة ومتناقضة أحياناً.',
    abstract: {
      ar: 'تقدم هذه الورقة لمحة عامة عن رحلة حياة مفهوم التضامن، وذلك من خلال الوقوف عند عدد من محطات التشكل التاريخي والمفهومي للمصطلح. فعلى الرغم من سرعة وسهولة انضواء مختلف الأعمال الرافضة لحرب الإبادة الجماعية على قطاع غزة، جمعية كانت أم فردية، في الحيز العام أم الخاص، تحت شعار التضامن، إلا أن محاولة تحديد المعالم الدقيقة للمفهوم تفتقر لذات السهولة والسرعة. فقد أصبح مفهوم التضامن، كما هو الحال مع معظم الكلمات التي تسبح في فضاء خطاب التنمية (والتنمية المستدامة)، أحدث المصطلحات الرائجة. إذ إن الاستعمال اللغوي الواسع للمفهوم - التضامن المناخي، والتضامن مع ضحايا الكوارث الطبيعية، والتضامن مع النضال النسوي، والتضامن مع نضال السود، والتضامن مع الحراك المثلي، والتضامن مع الفقراء، والتضامن مع قطاع غزة – يزيد من مقدار ضبابيته المفهومية، ويصب لصالح ثقل الكفة التي تساوي المفهوم مع مرادفات أخرى، مثل التعاطف والمناصرة والعمل الخيري.\n\nلذلك، تسعى هذه الورقة إلى تحديد الأسس التي يقوم عليها المفهوم، كما رسخها التشكل التاريخي في محطات مختلفة، من أجل فهم مدى وتبعات التحول المفهومي الذي طرأ عليه في شكله المعاصر، خاصة عند دخوله لفضاء خطاب العمل الإنساني، وفي سياق التقدم الساحق لأشكال النجاة الفردية في الحقبة النيوليبرالية المعولمة. وختاماً، تطرح الورقة تساؤلاً عن آفاق التشكل المفاهيمي لمصطلح التضامن في السياق الفلسطيني والعالمي الراهن.',
      en: 'This paper provides an overview of the historical development of the concept of "solidarity", by examining key milestones in its historical and conceptual formation. While various efforts opposing the genocidal war on the Gaza Strip—whether collective or individual, in the public or private sphere—are readily grouped under the banner of "solidarity," defining the precise contours of the concept proves far more elusive. Like many terms circulating within the discourse of development (and sustainable development), "solidarity" has become the latest buzzword. Its broad linguistic application—ranging from climate solidarity, to solidarity with victims of natural disasters, to solidarity with feminist struggles, the Black struggle, the LGBTQ+ movement, the poor, and the Gaza Strip—further deepens its conceptual ambiguity. This reinforces an interpretation that equates solidarity with terms such as empathy, advocacy, or charity.\n\nConsequently, this paper seeks to identify the foundational building blocks of the concept—as established through its historical evolution at various junctures—to better understand the scope and implications of the conceptual shifts it has undergone in its contemporary form. This is particularly relevant as the term enters the realm of humanitarian discourse, amidst the overwhelming rise of individualistic survival strategies in the era of globalized neoliberalism. Finally, the paper raises a question regarding the conceptual horizons of solidarity that are made possible within the current Palestinian and global contexts.',
    } },
  { id: 'kumar', name: 'Santosh Kumar', lang: 'en',
    title: { ar: 'من الاستغلال الاستعماريّ إلى التضامن العالميّ: الطبقة والاستعمار والمقاومة في أدب ما بعد الاستعمار في الهند وفلسطين', en: 'From Colonial Exploitation to Global Solidarity: Class, Colonialism, and Resistance in Postcolonial Literature from India and Palestine' },
    gist: 'Reads Indian and Palestinian postcolonial literature side by side to ask how sympathy becomes shared, class-grounded struggle.',
    abstract: {
      ar: 'يُظهر أدب ما بعد الاستعمار والأدب المناهض للاستعمار في الهند وفلسطين أن الهيمنة الاستعمارية لا يمكن فصلها عن الطبقة والملكية والعمل ونزع الملكية. وتسأل هذه الورقة كيف يشكّل الاستعمار الطبقةَ والحياةَ اليومية، وكيف تدرك الجماعات المضطهَدة البنى المشتركة للهيمنة.\n\nومن خلال قراءة مقارنة تجمع بين روايتَي مُلك راج آناند "المنبوذ" و"الحمّال" (Coolie)، وقصة ماهاسويتا ديفي "دروبادي" وروايتها "تشوتي موندا وسهمه"، ورواية إميل حبيبي "الوقائع الغريبة في اختفاء سعيد أبي النحس المتشائل"، ورواية سحر خليفة "الصبار". فمن جهة، يسلّط آناند وحبيبي الضوء على استغلال العمال في ظل الرأسمالية الاستعمارية، ومن جهة أخرى، تتتبّع ديفي وخليفة سلبَ الناس أرضهم، وعنفَ الدولة، والمقاومة. فضلاً عن ذلك، يُظهر حبيبي وآناند كيف تشكّل السلطة الاستعمارية بنية الطائفة-الطبقة والهوية في الحياة الفلسطينية والهندية على التوالي.\n\nتضع هذه الأعمال العمالَ والفلاحين واللاجئين والمجتمعات المهجّرة والذوات المهمّشة في المركز. وهي تحوّل تجارب الاستغلال الاستعماري إلى سرديات مقاومة جماعية، لكنها تكشف في الوقت ذاته كيف تعيد السلطة الاستعمارية تشكيل الأرض والعلاقات الاجتماعية.\n\nتطرح التعبئة العالمية من أجل فلسطين سؤالاً: كيف يمكن للتعاطف أن يتحوّل إلى نضال مشترك؟ إذ لا يمكن للتضامن أن يقوم على المعاناة المشتركة وحدها، بل يحتاج إلى مصالح مشتركة، ووعي سياسي، وفعل جماعي. وتحاجج هذه الورقة بأن النضالات المتمايزة تاريخياً يمكن أن تتشارك لغةً سياسية للتضامن، ولكن فقط من خلال الالتفات إلى الطبقة والمصالح المادية. كما تختبر الورقة المواضع التي تخفق فيها المقارنة.\n\nلا تتطابق التجربتان في البلدين، غير أن كليهما يُظهر كيف يعيد الحكم الاستعماري هيكلة الأرض والعمل. ويربط أدبهما النضالات المحلية ببنى أوسع للهيمنة. ومن شأن قراءة هذه الأعمال معاً أن تكشف هذه الروابط، التي تساعد على تخيّل تضامن عالمي قائم على المصالح المشتركة، لا على الألم المشترك وحده.',
      en: 'Postcolonial and anticolonial literature from India and Palestine shows that colonial domination cannot be separated from class, property, labour and dispossession. This paper asks how colonialism shapes class and everyday life, and how oppressed communities recognise shared structures of domination.\n\nTogether reading Mulk Raj Anand\'s Untouchable and Coolie, Mahasweta Devi\'s "Draupadi" and Chotti Munda and His Arrow, Emile Habibi\'s The Secret Life of Saeed the Pessoptimist, and Sahar Khalifeh\'s Wild Thorns. Anand and Habibi highlight labour exploitation under colonial capitalism, on the one hand. Devi and Khalifeh, on the other hand, trace people\'s dispossession, state violence, and resistance. Additionally, Habibi and Anand show how colonial power shapes caste-class and identity in Palestinian and Indian life, respectively.\n\nThese works keep workers, peasants, refugees, displaced communities and marginalised subjects in the centre. They turn experiences of colonial exploitation into narratives of collective resistance, yet they reveal how colonial power reshapes land and social relations.\n\nGlobal mobilisation for Palestine raises a question: how can sympathy become a shared struggle? Solidarity cannot rest on shared suffering alone. It needs shared interests, political consciousness and collective action. This paper argues that historically distinct struggles can share a political language of solidarity, but only by attending to class and material interests. It also tests where comparison fails.\n\nBoth countries are not identical. Yet both show colonial rule restructuring land and labour. Their literature connects local struggles to wider structures of domination. Reading both works can reveal these connections, which help to imagine global solidarity grounded in shared interests rather than shared pain alone.',
    } },
  { id: 'saadi', name: 'Sardar Saadi', lang: 'en',
    title: { ar: 'التضامن من القاعدة: النضالات الكرديّة والفلسطينيّة وسياسات التحرّر', en: 'Solidarity from Below: Kurdish and Palestinian Struggles and the Politics of Liberation' },
    gist: 'Draws on Kurdish and Palestinian experiences to argue for solidarity grounded in mutual recognition rather than shared victimhood alone.',
    abstract: {
      ar: 'ماذا يعني بناء تضامن يتجاوز تعبيرات التعاطف، والحدود القومية، والتحالفات الجيوسياسية؟ استناداً إلى تجارب المقاومة الكردية والفلسطينية، يستكشف هذا العرض التضامن من القاعدة بوصفه ممارسة سياسية متجذرة في التنظيم الشعبي، والنضالات المشتركة، والتطلعات الجمعية نحو التحرر. كما يبحث العرض في إمكانيات وتناقضات بناء التضامن عبر تواريخ مختلفة من الاضطهاد، داعياً إلى أشكال من التضامن السياسي التي لا تقوم، فحسب، على المظلومية المشتركة، بل على الاعتراف المتبادل، والعمل الجمعي، وبناء مستقبل تحرري.',
      en: 'What does it mean to build solidarity beyond expressions of sympathy, national boundaries, and geopolitical alliances? Drawing on Kurdish and Palestinian experiences of resistance, this presentation explores solidarity from below as a political practice rooted in grassroots organizing, shared struggles, and collective aspirations for liberation. It examines both the possibilities and contradictions of building solidarity across different histories of oppression, arguing for forms of political solidarity grounded not simply in shared victimhood, but in mutual recognition, collective action, and the creation of emancipatory futures.',
    } },
  { id: 'hindi-arqawi-sadeq', name: 'Yara Al Hindi, Bayan M. Arqawi, and Tareq Sadeq', authors: ['Yara Al Hindi', 'Bayan M. Arqawi', 'Tareq Sadeq'], lang: 'en',
    title: { ar: 'عمالقة الذكاء الاصطناعيّ وإبادة غزّة', en: 'AI Giants and the Annihilation of Gaza' },
    gist: 'Traces the contracts, ownership, and political ties of major AI companies to the Israeli military during the annihilation of Gaza.',
    abstract: {
      ar: 'تكشف عملية الإبادة التي تشنها إسرائيل في قطاع غزة عن شبكة عالمية من المصالح الاقتصادية والتكنولوجية، مما يتيح توسيع مفهوم مناهضة الحرب؛ إذ لم يعد الأمر يقتصر على مجرد الاعتراض على الاستخدام العسكري للتكنولوجيا، بل امتد ليشمل التدقيق في علاقات الملكية والاستثمار والتعاقد التي تشكل ركيزة لهذا الاستخدام. تسلط هذه الورقة الضوء على الدور الاقتصادي والسياسي الفاعل الذي تلعبه كبرى شركات الذكاء الاصطناعي في عملية الإبادة الإسرائيلية في غزة؛ حيث تحدد الشركات المرتبطة بعقود مع الحكومة الإسرائيلية أو شركات صناعة الأسلحة، وتوثق هذه العقود وتقدر قيمتها الاقتصادية، كما تبحث في هياكل ملكيتها ومصادر رأس مالها، وتتتبع أداء أسهمها وعوائدها المالية وأرباحها خلال فترة الإبادة، فضلاً عن علاقاتها السياسية وارتباطاتها بشخصيات سياسية نافذة. من خلال تتبع هذه العلاقات الاقتصادية والسياسية، تسعى الورقة إلى فهم كيف تتقاطع المصالح الاقتصادية الخاصة مع القوة العسكرية والاقتصاد السياسي لعملية الإبادة في غزة وكيف يمكن لهذا التشابك أن يسهم في تعزيز شمولية واستدامة حركات المناهضة وتوسيع نطاقها.',
      en: 'The Israeli annihilation of Gaza reveals a global network of economic and technological interests that transcends the boundaries of any single state—thereby allowing the concept of opposing war to expand from merely objecting to the military use of technology to scrutinising the relations of ownership, investment, and contracting that underpin such use. This paper points to the economic and political agency of major AI companies in the Israeli annihilation of Gaza. It identifies companies involved in contracts with the Israeli government or defence companies, documents the contracts and estimates their economic value, investigates their ownership structure and sources of capital, tracks their stock price performance, financial returns and profits during the annihilation, alongside their political connections and association with influential political figures in the US. By tracing these economic and political relationships, the paper seeks to understand how private economic interests intersect with military power and the political economy of the annihilation in Gaza and how highlighting these entanglements can foster sustained global anti-war movements and collective action.',
    } },
  { id: 'ayoub', name: 'حسن ايوب', lang: 'ar',
    title: { ar: 'التضامن مع فلسطين: عندما ترتدّ أدوات القمع الاستعماريّ داخلياً', en: 'Solidarity with Palestine: When the Tools of Colonial Repression Turn Inward' },
    gist: 'يفحص كيف تستخدم حكومات غربية أدوات قمع استعمارية تاريخياً ضد حركات التضامن مع فلسطين داخل مجتمعاتها نفسها.',
    abstract: {
      ar: 'على مدار السنوات الثلاث الماضية التي شهدت، ولا تزال، حرب الإبادة في قطاع غزة، وحملات التطهير العرقي والتوسع الاستعماري في الضفة الغربية، تستمر في مختلف دول العالم وعلى نطاق واسع حملات الاحتجاج والتظاهر، وفعاليات التضامن الأممي مع الشعب الفلسطيني. وتعكس حالة التضامن المتنامي مع المسألة الفلسطينية، في بعدها الفكري (مثلما تشير العديد من الدراسات والمتابعات البحثية) حضوراً واضحاً لنزعة جذرية مناهضة للاستعمار والإمبريالية، تظهر من الشعارات والهتافات وسواها من أشكال التعبير التي رافقت غالبية هذه الاحتجاجات والفعاليات، وبخاصة في نطاق الاعتصامات الطلابية في الجامعات الغربية.\n\nإن حركات الاحتجاج المتضامنة مع الشعب الفلسطيني في استمراريتها باتت تعبر عن حالة أعمق من التعبير عن السخط على الإبادة الجماعية، نحو مواجهة النظام العالمي الذي مكن ولا زال يمكن "إسرائيل" من الاستمرار في سياساتها الإجرامية بحق الشعب الفلسطيني. وهو ما يشير إلى إمكانية تحول هذه الاحتجاجات وحركات التضامن إلى تيارات اجتماعية وسياسية لها سمة الدوام، ومن ثم زيادة قدرتها على رفع كلفة استمرار التواطؤ مع وتمكين "إسرائيل". ولعل مثل هذه المؤشرات هي ما دفعت، ولا تزال، حكومات الدول الغربية (الولايات المتحدة الأمريكية، بريطانيا، ألمانيا، وفرنسا على وجه الخصوص) إلى اللجوء لأدوات واستراتيجيات القمع وتكميم الأفواه ضد تلك الاحتجاجات وفعاليات التضامن.\n\nوأبعد من مجرد التنصل من المبادئ المرتبطة بالديموقراطيات الليبرالية (الحريات السياسية والمدنية والفردية)، بل والانقلاب عليها لصالح أيديولوجيا ومصالح النخب السياسية وعلاقاتها المتشعبة مع "إسرائيل"، ودفاعها المستميت عن منظومة القوة والنفوذ العالمي وتحالفاته التي تقع "إسرائيل" في قلبها، فإن مظاهر وأدوات، وأشكال القمع التي تمارس بحق قوى الاحتجاج تشير إلى أن عصر الاستعمار الجديد (بصفته استمراراً عبر الزمان والمكان) يعيد إنتاج ذات علاقات القوة والهيمنة التي سادت عصر الاستعمار والإمبريالية العالمية في القرنين الثامن عشر والتاسع عشر.\n\nتبحث هذه الورقة في أشكال وأدوات ومنهجيات الدول الغربية في قمع حركات الاحتجاج المتضامنة مع الشعب الفلسطيني، والتي تشير إلى الاستخدام الممنهج لذات الأدوات التي ارتبطت تاريخياً بقمع القوى الاستعمارية للشعوب الخاضعة لها، ما يعزز صدقية الفرضية القائلة بأن حركة التضامن مع الشعب الفلسطيني باتت تمثل حالة من الانتفاضة العالمية ضد نظام الهيمنة الاستعمارية الجديدة. ثمة نمطية تكشف عنها عمليات القمع والملاحقة وتشير إلى اتفاق ضمني بين حكومات هذه الدول على عدم السماح بتعمق واستمرار هذه الاحتجاجات وتحولها إلى التغيير البنيوي للنظام العالمي.',
      en: 'Over the past three years— a period marked by an ongoing genocidal war in the Gaza Strip, as well as campaigns of ethnic cleansing and colonial expansion in the West Bank—protests, demonstrations, and acts of internationalist solidarity with the Palestinian people have persisted on a global scale. As many studies and research reports indicate, this growing solidarity with the Palestinian cause reflects a clear expression of a radical anti-colonial and anti-imperialist sentiment. This is evident in the slogans, chants, and other forms of expression that have accompanied these protests, most notably within the student encampments at Western universities.\n\nThe continuity of these protest movements, in solidarity with Palestine, suggests that they have evolved beyond mere expressions of outrage against genocide; they are increasingly confronting the global order that has enabled —and continues to enable— Israel to persist in its criminal policies against the Palestinian people. This points to the potential for these protests and solidarity movements to develop into enduring social and political currents, thereby increasing the cost of continued complicity with, and enablement of, “Israel”. It is precisely these indicators which have prompted Western governments (the United States, the United Kingdom, Germany, and, especially, France) to employ various tools and strategies of repression and censorship against these protests and acts of solidarity.\n\nBeyond merely disavowing the principles associated with liberal democracies (political, civil, and individual freedoms(, but also actively turning against them to serve the ideologies and interests of political elites and their intricate ties to Israel, evident in their staunch defense of the global system of power, influence, and alliances at the heart of which Israel sits, the manifestations, tools, and forms of repression employed against protest forces indicate that the era of neocolonialism (as a phenomenon persisting across time and space) is reproducing the very same power and hegemonic relations that prevailed during the eighteenth and nineteenth centuries.\n\nThis paper examines the forms, tools, and methods employed by Western states to suppress protest movements in solidarity with the Palestinian people. It highlights a systematic use of tools historically associated with how colonial powers subjugated various peoples. This supports the argument that the solidarity movement with the Palestinian people has evolved into a global uprising against the system of neocolonial hegemony. The acts of repression and persecution reveal a pattern, pointing to a tacit agreement among the governments of these states to prevent these protests from deepening, persisting, or evolving into structural changes within the global order.',
    } },
  { id: 'vlachou', name: 'Stefania Vlachou', lang: 'en',
    title: { ar: 'من الزنازين والأنفاق إلى إعادة التفكير في حقوق الإنسان خارج الفخّ الليبراليّ', en: 'From the Prison Cells and the Tunnels to Rethinking Human Rights Beyond the Liberal Trap' },
    gist: 'Argues for a solidarity rooted in Amílcar Cabral’s "return to the source," treating resistance as primary and international law as contested terrain.',
    abstract: {
      ar: 'لقد بلغ المشروع الاستعماري اليوم لحظةً إباديةً في مسار تطوّره. وفي الوقت ذاته، يشنّ المحور الأمريكي-الإسرائيلي، بتواطؤ من وكلائه، هجوماً على القانون الدولي، وعلى المؤسسات الدولية، وعلى فكرة حقوق الإنسان ذاتها. وتحاجج الورقة بأن لحركة التضامن العالمية دوراً رئيسياً في تصوّر القانون الدولي أداةً للمقاومة لا أداةً في يد القوة الإمبريالية، غير أن ذلك لا يتحقق إلا بتبنّي مقاربة بنيوية متجذّرة في الواقع. فمفهوم أميلكار كابرال "العودة إلى المنبع" يدعو إلى العودة إلى الواقع المُعاش للناس على الأرض، والاعتراف بالمقاومة بوصفها القوة الأساسية، وبالتضامن بوصفه القوة التي تليها. ويخبرنا واقع الفلسطينيين واللبنانيين أن الرأسمالية المتأخرة قد دخلت طوراً جديداً من أطوار الاستخراج الرأسمالي، لم تعد فيه الحروب الاستعمارية أداةً لضمان الاستخراج، بل صارت هي ذاتها آليةً لإنتاج القيمة عبر قتل أجسادنا وجرحها. وتخبرنا الجماهير الشعبية حول العالم بأن ثمة استمرارية في الاستعمار (فلا وجود لـ"استعمار جديد")، وبأن الإبادة جزء مكوِّن في تطوّر الاستعمار الاستيطاني.\n\nوأرى تماثلاً بين خطابٍ يدّعي التعاطف بتشخيصه الوضع على أنه إبادة، بينما يحمّل المقاومة في الوقت ذاته مسؤولية الدمار ويعلن انتهاء صلاحيتها، وخطابٍ قانوني شكلي يلجأ إلى المنظومة القانونية الدولية وسيلةً لمعالجة الانتهاكات الإسرائيلية لحقوق الإنسان، تاركاً في الوقت نفسه المنطقَ البنيوي الاستعماري الذي يجعل الإبادة ممكنة بمنأى عن أي مساس. إن الضرورة التاريخية التي تفرضها الإبادة، والأصوات القادمة من الأنفاق والسجون، تستدعي تضامناً يعطي الأولوية للمقاومة، ويعترف بأن المعركة ضد البنى المشتركة هي معركةٌ مشتركة، وبأن بذور الهجوم الراهن وُلدت بالتزامن مع إنشاء النظام الإسرائيلي (في العام ذاته، 1948، الذي شهد فيه العالم اعتماد الإعلان العالمي لحقوق الإنسان واتفاقية منع جريمة الإبادة الجماعية والمعاقبة عليها)، وبأن القانون الدولي ليس ساحةً محايدة.',
      en: 'The colonial project has now reached a genocidal moment in its development. At the same time, an assault on international law, on the international institutions and on the very idea of human rights is also being perpetrated by the US-Israeli axis with the complicity of its proxies. The paper argues that the global solidarity movement has a major role in envisaging international law as a tool of resistance instead of an instrument of imperial power, but this can only be done by adopting a structural and rooted approach. Amílcar Cabral’s concept of “returning to the source”, calls for a return to the lived reality of the people on the ground, recognizing resistance as the primary force and solidarity as the force that follows. The reality of Palestinians and Lebanese tells us that late capitalism has entered a new phase of capitalist extraction in which colonial wars are no longer a tool to ensure extraction, but the mechanism for value production through the killing and wounding of our own bodies. The popular masses globally tell us that there is a continuity in colonialism (there is no “neo-colonialism”) and that genocide is a formative part in the development of settler colonialism.\n\nI see a parallel between a discourse that claims sympathy by diagnosing the situation as genocidal while simultaneously blaming the resistance for the destruction and declaring it obsolete and a legalistic discourse that turns to the international legal system as a means to address Israeli human rights violations, while leaving untouched the very structural, colonial logics that enable genocide. The historical exigency of the genocide and the voices from the tunnels and the prisons, demands a solidarity that prioritizes resistance, recognizes that the fight against the common structures is shared, that the seeds of the today assault were born in tandem with the creation of the Israeli regime (the same year -1948- that the world witnessed the adoption of the Universal Declaration of Human Rights and of the Genocide Convention) and that international law is not a neutral terrain.',
    } },
  { id: 'jarrar', name: 'خالدة جرار', lang: 'ar',
    title: { ar: 'مقاربات للنضال التحرّريّ: أشكال التضامن العالميّة في تجارب الأسْر', en: 'Approaches to Emancipatory Struggle: Global Forms of Solidarity in Experiences of Captivity' },
    gist: 'تقرأ تجربة الأسرى وإضراباتهم عن الطعام كعدسة لفهم تبادل أشكال النضال والتضامن العالمي بين المجتمعات المضطهدة.',
    abstract: {
      ar: 'تتناول الورقة مفهوم التضامن، أسسه وكيف يمكن أن يتحول الى أداة للتغيير، من خلال قراءة مقاربات لنضالات التحرر وأشكال التضامن العالمية في تجارب الأسر. والانخراط المشترك في حركات التحرر المناهضة للمشروع الاستعماري في فلسطين، ومشروع الهيمنة الرأسمالية في العالم، كجزء من مشروع تحرر أممي يسعى لتحقيق الحرية والعدالة والكرامة وتقرير المصير.\n\nوتفحص هذه الورقة سياق التضامن العالمي وتبادل أشكال النضال بين المجتمعات المضطهدة من خلال السجون وتاريخ الاحتجاجات داخلها عالمياً، وتحاجج أن هذه الأشكال من النضال تُظهر بعداً عالمياً يتعدى تشابه التجارب ويصل إلى تناقل الخبرات وتطوير وسائل نضالية مشتركة. وفي هذا السياق، تتطرق الورقة إلى الإضرابات عن الطعام التي خاضها متضامنون مع فلسطين خلال حرب الإبادة، تحديداً المتضامنون في المملكة المتحدة وفي سجون إسبانيا. وبذلك، تظهر الورقة أن هذا التاريخ الطويل من الاحتجاجات (والاضرابات عن الطعام) يُشكل عدسة لتحليل المقاربات التقاطعية لنضالات التحرر وأشكال التضامن العالمية.',
      en: 'The paper addresses the concept of solidarity, its foundations, and how it can become a tool for change, through a reading of approaches to emancipation struggles and global forms of solidarity in experiences of captivity, and of shared engagement in liberation movements opposing the colonial project in Palestine and the project of capitalist hegemony worldwide, as part of an internationalist liberation project that seeks freedom, justice, dignity, and self-determination.\n\nThe paper examines the context of global solidarity and the exchange of forms of struggle among oppressed communities through prisons and the history of protest within them worldwide. It argues that these forms of struggle reveal a global dimension that goes beyond the similarity of experiences to the transmission of knowledge and the development of shared means of struggle. In this context, the paper discusses the hunger strikes undertaken by people in solidarity with Palestine during the genocidal war, specifically solidarity activists in the United Kingdom and in Spanish prisons. In doing so, it shows that this long history of protest (and of hunger strikes) offers a lens for analysing intersectional approaches to liberation struggles and global forms of solidarity.',
    } },
  { id: 'allahham', name: 'Mohammad Allahham', lang: 'en',
    title: { ar: 'من هو "الشعب"؟ الإقصاء الجندريّ وتقرير المصير وحدود التضامن التحرّريّ مع فلسطين', en: 'Who Are "the People"? Gendered Exclusion, Self-Determination, and the Limits of Emancipatory Solidarity with Palestine' },
    gist: 'Examines how official nationalist discourse constructs "the people" as a masculine subject, using Nancy Fraser’s three dimensions of justice.',
    abstract: {
      ar: 'تواجه حركة التضامن العالمي مع فلسطين اليوم منظومةَ هيمنةٍ تشنّ حرب إبادة على الشعب الفلسطيني، وتستهدف بنى حياته الجماعية. وتحاجج هذه الورقة بأن قدرةَ "الشعب" على الوجود بوصفه جماعةً تحتضن جميع أفرادها، تشكل واحدة من أعمق ما تستهدفه هذه المنظومة. فعلى الصعيد الخارجي، يفتّت الاحتلال الجغرافيا الفلسطينية بين غزة والضفة الغربية والقدس، ويشتّت اللاجئين، ويحول دون قدرة المؤسسات على سنّ تشريعات منصفة جندرياً وإنفاذها، محوّلاً التزاماتٍ مثل اتفاقية سيداو (2014) إلى التزامات بلا تطبيق. أما على الصعيد الداخلي، وبالتفاعل مع ما سبق، فتفحص الورقة فرضية أن الخطاب الوطني الرسمي قد بنى "الشعب" بوصفه ذاتاً ذكورية (مسعد 1995): فبينما كانت النساء الفلسطينيات تاريخياً شريكات مركزيات في النضال الوطني، اختُزلت مكانتهن في الخطاب الرسمي في الإنجاب والإسناد، فيما يؤجّل منطق "المرحلتين" العدالةَ الجندرية باسم أولوية التحرر الوطني. إن التناقض بين مركزية النساء في الممارسة وهامشيتهن في الخطاب هو موضوع البحث، وليس دليلاً على غيابهن. واستناداً إلى أبعاد العدالة الثلاثة عند نانسي فريزر (1997، 2009)، أي إعادة التوزيع والاعتراف والتمثيل، تبيّن الورقة أن الإجابة عن هذا السؤال تعزّز المشروع الوطني وحركة التضامن العالمية معه، ولا تصرف الانتباه عنهما.',
      en: 'The global solidarity movement with Palestine today confronts a system of domination waging a war of annihilation against the Palestinian people and targeting the structures of their collective life. This paper argues that among the deepest targets of these structures is the capacity of "the people" to exist as a collective embracing all its members. Externally, the occupation fragments Palestinian geography between Gaza, the West Bank, and Jerusalem, disperses refugees, and prevents institutions from enacting and enforcing gender-equitable legislation, turning commitments such as CEDAW (2014) into obligations without implementation. Internally, and in interaction with this, the paper examines the hypothesis that official nationalist discourse has constructed "the people" as a masculine subject (Massad 1995): while Palestinian women have historically been central partners in the national struggle, their position within official discourse is reduced to reproduction and support, and the "two-stage" logic defers gender justice in the name of prioritising national liberation. The contradiction between women\'s centrality in practice and their marginality in discourse is the object of inquiry, not evidence of absence. Drawing on Nancy Fraser\'s (1997, 2009) three dimensions of justice, redistribution, recognition, and representation, the paper shows that answering this question strengthens rather than distracts from the national project and its global solidarity movement.',
    } },
  { id: 'husein', name: 'أسيل حسين', lang: 'ar',
    title: { ar: 'حركة التضامن مع فلسطين ومساءلة الشكل القانونيّ لحقوق الإنسان', en: 'The Palestine Solidarity Movement and the Questioning of the Legal Form of Human Rights' },
    gist: 'تقترح مؤشرين لتمييز التضامن التحرري عن التضامن الذي يعيد إنتاج علاقات الهيمنة داخل شبكاته نفسها.',
    abstract: {
      ar: 'تُرجع بعض المقاربات النقدية أزمة حقوق الإنسان إلى ابتعاد ممارساتها عن القواعد الشعبية، ومهننة العمل الحقوقي وتركّز الخبرة والمعرفة فيه لدى فئة من المختصين، وانفصالها عن الحركات الاجتماعية والشعبية، فضلاً عن تجريدها من طابعها السياسي. وبناءً على ذلك، تدعو هذه المقاربات إلى إعادة تسييس العمل الحقوقي، وربطه مجدداً بالحركات الشعبية، وبناء تحالفات عابرة للحدود. غير أن هذه الأطروحات تثير تساؤلاً يتجاوز مجرد كيفية تنفيذها: هل يمكن تفسير أزمة حقوق الإنسان بابتعاد الممارسة الحقوقية عن أفقها التحرري، أم أن ثمة إشكالية أعمق تتعلق بالشكل ذاته الذي تنتظم الحقوق من خلاله؟\n\nتُعد حركة التضامن العالمية مع فلسطين نموذجاً يمكن من خلاله فحص هذه المسألة؛ فقد ربطت تحركاتها واسعة النطاق بين النضال الفلسطيني ونضالات مجتمعات أخرى ضد الظلم والاستغلال والاستعمار، كما وسّعت حضور القضية الفلسطينية في النقاش العام، وأظهرت قدرتها على بناء أشكال من التعبئة والعمل الجماعي العابر للحدود. ومع ذلك، لا يزال جزء كبير من مطالب هذه الحركة موجهاً نحو مؤسسات دولية لا تجد قراراتها طريقها إلى التنفيذ، في حين يواجه المطالبون بإنفاذ القانون ملاحقات وقمعاً. وتكشف هذه المفارقة حدود الاعتماد على "الشرعية القانونية" كمسار لتحقيق التغيير السياسي.\n\nتبحث هذه الورقة في العلاقة بين أزمة حقوق الإنسان و"الشكل القانوني" ذاته. وتستعين بتحليل إيفغيني باشوكانس للشكل القانوني، من خلال بحث العلاقة بين الشكل القانوني، والذات القانونية، وعلاقات تبادل السلع، بالإضافة إلى دور الدولة في ضمان الشروط اللازمة لإعادة إنتاج هذه العلاقات. كما تتساءل الورقة عن الكيفية التي يمكن بها لهذا المنظور أن يساعد في فهم حدود اختزال الحقوق في مجرد مطالب تُوجّه إلى الدولة أو النظام الدولي، وكيف يمكن النظر إلى الحقوق، في المقابل، بوصفها علاقات اجتماعية تتشكل من خلال المشاركة والفعل الجماعي.',
      en: 'Some critical approaches trace the crisis of human rights to the detachment of human rights practices from grassroots movements, the professionalization of human rights work and the concentration of expertise and knowledge in the hands of a group of specialists and the separation of human rights work from social and popular movements, and, more broadly, the loss of their political character. Accordingly, these approaches call for the repoliticization of human rights work, its renewed connection with popular movements, and the building of transnational alliances. These proposals, however, raise a question that goes beyond how they might be implemented: can the crisis of human rights be explained by the distancing of human rights practice from its emancipatory horizon, or is there a deeper problem concerning the very form through which rights are constituted?\n\nThe global solidarity movement with Palestine offers a case through which to examine this question. Its large-scale mobilizations have connected the Palestinian struggle with the struggles of other societies against injustice, exploitation, and colonialism. They have also expanded the presence of the Palestinian cause in public debate and demonstrated the capacity to build forms of mobilization and collective action across borders. Nevertheless, a significant part of the movement’s demands continues to be directed towards international institutions whose decisions remain unimplemented, while those calling for the enforcement of the law face persecution and repression. This contradiction reveals the limits of relying on "legal legitimacy" as a pathway to political change.\n\nStarting from this problem, the paper examines the relationship between the crisis of human rights and the "legal form" itself. It draws on Evgeny Pashukanis’s analysis of the legal form to examine the relationship between the legal form, the legal subject, and relations of commodity exchange, as well as the role of the state in securing the conditions necessary for reproducing these relations. It also asks how this perspective might help us understand the limits of reducing rights to mere claims addressed to the state or the international system, and how rights might instead be understood as social relations constituted through participation and collective action.',
    } },
  { id: 'tawil', name: 'حياة الطويل وإسلام نصر', authors: ['حياة الطويل', 'إسلام نصر'], lang: 'ar',
    title: { ar: 'الحقّ في الصحّة بين الإبادة والسوق: نحو تضامن أمميّ قائم على المنفعة المشتركة وحقوق إنسان تحرّريّة', en: 'The Right to Health between Genocide and the Market: Towards an Internationalist Solidarity based on Common Benefit and Emancipatory Human Rights' },
    gist: 'تجادل بأن تضامن العاملين الصحيين حول العالم مع زملائهم في غزة نموذج لتضامن قائم على مصلحة مشتركة لا إغاثة فقط.',
    abstract: {
      ar: 'كشفت حرب الإبادة على غزة عن الصورة القصوى لنزع الحق في الصحة، في ظل عجز منظومة حقوق الإنسان الدولية عن حمايته، وهذا النزع يتداخل مع النظام العالمي، ففي بلدان المتضامنين أنفسهم يُنتزع الحق ذاته بوسائل ناعمة منها الخصخصة، وتسليع الجسد، و"أمرضة" الحياة اليومية لخلق أسواق جديدة.\n\nتنطلق الورقة من أن التضامن مع فلسطين شكل احتجاجاً على الظرف العالمي برمّته، وتجادل بأن الحق في الصحة أحد أوضح تجليات "المنفعة المشتركة" التي تميّز التضامن عن التعاطف، فالمنطق الذي يجعل حياة الفلسطيني قابلة للإهدار هو، بدرجات وأدوات مختلفة، المنطق ذاته الذي يُخضع حياة الفقراء والعمال حول العالم لحسابات الربح. وتستند الورقة إلى نقد الرأسمالية الطبية، وإلى أطر والرشتاين وهارفي في قراءة النيوليبرالية بوصفها امتداداً للعلاقة الاستعمارية بين المركز والأطراف، وتبني على ما يخلص إليه نقد تسليع الصحة من أن السوق لا يكتفي بتوزيع الرعاية، بل يعيد تعريف من يستحقها ومن يمكن التخلي عنه.\n\nوتتخذ الورقة من تحركات العاملين الصحيين ونقاباتهم حول العالم تضامناً مع زملائهم في غزة حالةً دراسية، بوصفها نموذجاً لتضامن قائم على هوية مهنية ومصلحة مشتركة، يربط بين الدفاع عن المستشفيات في غزة والدفاع عن الصحة العامة في وجه الخصخصة والتقشف حول العالم، وتقارن بين خطاب هذه التحركات وخطاب العمل الإنساني التقليدي، لتبيّن الفرق بين تضامن يكتفي بإغاثة الضحية وتضامن يسائل البنى التي تنتجها.\n\nوتسعى الورقة إلى الإجابة عن الأسئلة الآتية: كيف كشفت الإبادة حدود منظومة حقوق الإنسان الليبرالية في صون الحقوق الاجتماعية والاقتصادية؟ وهل يستطيع التضامن مع فلسطين أن يعيد تعريف الحق في الصحة من حق "إغاثي" إلى حق تحرري يواجه تغوّل الشركات وقوى السوق؟ وما الشروط التنظيمية التي تحوّل تضامن القطاع الصحي من مبادرات متفرقة إلى حركة عالمية مستدامة؟',
      en: 'The genocidal war in Gaza has laid bare the extreme deprivation of the right to health, occurring against a backdrop of an international human rights system that has proven incapable of protecting it. This deprivation is deeply intertwined with the global order; since even within the countries of those expressing solidarity, this same right is being deprived through soft mechanisms—such as privatization, the commodification of the body, and the "medicalization" of everyday life—to create new markets.\n\nThe paper posits that solidarity with Palestine serves as a protest against the global status quo. It argues that the right to health represents a clear instance of "shared benefit”, which distinguishes solidarity from sympathy. For the logic that renders Palestinian lives expendable is, albeit through different degrees and instruments, the same logic that subjects the lives of the poor and the working class worldwide to the calculus of profit.\n\nThis paper draws on critiques of medical capitalism, the frameworks of Wallerstein and Harvey –who interpret neoliberalism as an extension of the colonial relationship between the center and the periphery— and builds on the critique of the commodification of health. It asserts that the market does not merely distribute care; rather, it redefines who is deemed deserving of it and who can be cast aside.\n\nAs a case study, the paper examines the mobilizations of healthcare workers and their unions globally in solidarity with their counterparts in Gaza. This serves as a model of solidarity rooted in professional identity and shared interest, linking the defense of hospitals in Gaza with the defense of public health against privatization and austerity. By comparing the discourse of these movements with that of traditional humanitarian aid, the paper highlights the distinction between solidarity that merely seeks to provide relief to victims and solidarity that interrogates the very structures that produce such victimization.\n\nThe study employs a qualitative, analytical, and comparative methodology in its pursuit to answer the following questions: How has the genocide exposed the limitations of the liberal human rights framework in safeguarding social and economic rights? Can solidarity with Palestine redefine the right to health—shifting it from a framework of "relief" to one of emancipation that challenges the encroachment of corporations and market forces? Furthermore, what organizational conditions are required to transform solidarity within the health sector from fragmented initiatives into a sustainable global movement?',
    } },
  { id: 'checa-hidalgo', name: 'Diego Checa Hidalgo', lang: 'en',
    title: { ar: 'الجامعات في مواجهة الإبادة: التضامن مع فلسطين في مجتمعات التعليم العالي الإسبانيّة', en: 'Universities Against the Genocide: Solidarity with Palestine in the Spanish Higher Education Communities.' },
    gist: 'Traces four phases in Spanish universities’ response to the genocide in Gaza, from ethical statements to collective action.',
    abstract: {
      ar: 'تستكشف هذه الورقة استجابة المجتمعات الأكاديمية الإسبانية للعنف الذي مارسته إسرائيل بحق السكان الفلسطينيين منذ تشرين الأول/أكتوبر 2023 حتى تشرين الأول/أكتوبر 2026. وتحلّل مسار حركة التضامن هذه لفهم إنجازاتها وحدودها، مع تركيز خاص على تطوّر موقف منظومة الجامعات العامة في مواجهة الإبادة في غزة، وعلى الأفعال الجماعية التي طوّرتها بعض قطاعات مجتمعاتها للتأثير في الإبادة الجارية ونظام الأبارتهايد والاحتلال العسكري. ويستند البحث إلى منهجية نوعية تشمل تحليلاً وثائقياً دقيقاً لمصادر أولية وثانوية متنوعة، والملاحظة بالمشاركة. وقد أتاحت الدراسة تحديد أربع مراحل متمايزة في تطوّر موقف الأوساط الأكاديمية الإسبانية خلال هذه الفترة. وتفسّر هذه النتائج المنطق الكامن وراء مواقفها، وتسلّط الضوء على العوامل التي أثّرت في تحوّلاتها، وتُبيّن أثر الفعل الجماعي من أجل فلسطين الذي قادته المجتمعات الجامعية. فضلاً عن ذلك، تشرح الورقة أبرز حدود حركة التضامن هذه، وتؤكد التقاطعات بين هذا النضال والمشكلات العالمية التي يعاني منها المجتمع الإسباني، كأزمات السكن والبيئة والعسكرة والأزمة السياسية.',
      en: 'This paper explores the response of the Spanish academic communities towards the violence deployed by Israel against the Palestinian population from October 2023 to October 2026. It analyses the trajectory of this solidarity movement to understand its achievements and limitations. It focuses, in particular, on the evolution of the position of the public university system in the face of the genocide in Gaza and the collective actions that some sections of its communities developed to influence the ongoing genocide, apartheid, and military occupation. This research is grounded in a qualitative methodology, encompassing a meticulous documentary analysis of assorted primary and secondary sources and participant observation. The study has enabled the identification of four distinct phases in the evolution of the Spanish academy\'s position throughout this period. These findings explain the rationality behind its stances, highlight the issues influencing the changes, and demonstrate the impact of collective action for Palestine from university communities. Moreover, it explains the main limitations of this solidarity movement and stresses the intersections of this struggle and the global problems affecting the Spanish society, such as the housing, environmental, militarization, and political crises.',
    } },
  { id: 'habboob-hindi', name: 'Belén Habboob Martos and Nadia Hindi Mediavilla', authors: ['Belén Habboob Martos', 'Nadia Hindi Mediavilla'], lang: 'en',
    title: { ar: 'حركة التضامن مع فلسطين في جامعة غرناطة: من الاستجابة الأخلاقيّة إلى إعادة التسييس', en: 'Palestine Solidarity Movement at the University of Granada: From Ethical Response to Repoliticisation' },
    gist: 'Analyses how University of Granada mobilisations (2023–2025) moved from ethical empathy to academic boycott and repoliticisation.',
    abstract: {
      ar: 'تحلّل هذه الورقة تحركات مجتمع جامعة غرناطة تضامناً مع فلسطين (2023–2025)، وتفحص كيف تتجاوز هذه الحركة مجرد التعاطف الأخلاقي لتغدو مساراً لإعادة التسييس في مواجهة الظرف النيوليبرالي العالمي، أو ما يسمّيه كارمي بولتون (2024) "صيرورة نكبةً العالم".\n\nوتحلّل الورقة كيف كشف النضال في جامعة غرناطة و"الشبكة الجامعية من أجل فلسطين" (Red Universitaria x Palestina) التحالفات المتشابكة بين الاستعمار والصهيونية والإمبريالية الغربية والأجندة الاجتماعية-الاقتصادية العالمية. فقد دفع النشاط الجامعي الاستجابات الأخلاقية الأولى، والوقوف المؤسسي "على مسافة واحدة"، والحيادَ الأكاديمي الزائف، نحو قطع العلاقات والمقاطعة الأكاديمية. وبذلك كشف تواطؤ المؤسسات العامة مع الشركات متعددة الجنسيات، والصناعات العسكرية ذات الاستخدام المزدوج، والمصارف المموِّلة للتسلّح.\n\nوانطلاقاً من إبستمولوجيا موقعية ونسوية، تحاجج الورقة بأن التحركات الجامعية، عبر فلسطين، تستبق في ممارستها ما تصبو إليه وتطرح نفسها بوصفها عقدةً للمقاومة الأممية. وتربط هذه العقدة بين الإبادة الجماعية والإبادة التعليمية من جهة، والهيمنة الاستعمارية العالمية وديناميات التهميش وتقليص الحرية الأكاديمية والأزمة البنيوية للنموذج النيوليبرالي في أوروبا من جهة أخرى. وتُظهر تجربة جامعة غرناطة أن التضامن مع فلسطين ليس ردّ فعلٍ عابراً على الهمجية، بل هو تمفصل سياسي نقدي يتحدى بنى الهيمنة في الرأسمالية الصهيونية العالمية، ويتطلع نحو آفاق تحرر مشتركة مع شعوب أخرى.',
      en: 'This paper analyses the mobilisations of the University of Granada (UGR) community in solidarity with Palestine (2023–2025). It examines how the movement goes beyond mere ethical empathy to become a process of repoliticisation against the global neoliberal condition, or the becoming-Nakba of the world (Karmy Bolton 2024).\n\nThe paper analyses how the struggle at the UGR and the University Network for Palestine (Red Universitaria x Palestina) exposed the intricate alliances between colonialism, Zionism, Western imperialism and the global socio-economic agenda. University activism pushed the initial ethical responses, institutional equidistance and false academic neutrality towards the severing of ties and academic boycott. In doing so, it revealed the complicity of public institutions with multinational corporations, the dual-use military industry and armed banking.\n\nFrom a situated and feminist epistemology, the paper argues that university mobilisation, through Palestine, prefigures and projects itself as a node of internationalist resistance. This node connects genocide and scholasticide with global colonial domination and the dynamics of precarisation, the curtailment of academic freedom and the structural crisis of the neoliberal model in Europe. The UGR experience shows that solidarity with Palestine is not a fleeting reaction to barbarity. It is a critical political articulation that challenges the structures of domination of global Zionist capitalism and looks towards horizons of emancipation shared with other peoples.',
    } },
  { id: 'tamimi', name: 'Tamara Tamimi', lang: 'en',
    title: { ar: 'تحدّي الحصانة الإسرائيليّة: التضامن بين دول الجنوب، والحشد الجماهيريّ، وحدود التغيير السياسيّ', en: 'Challenging Israeli Impunity: South–South Solidarity, Grassroots Mobilization, and the Limits of Political Change' },
    gist: 'Examines how Global South state initiatives and grassroots mobilisation reinforce, or fail to reinforce, each other against Israeli impunity.',
    abstract: {
      ar: 'تثير التحولات التدريجية في السياسة البريطانية تجاه إسرائيل، إلى جانب تغير الديناميكيات الانتخابية المتعلقة بدعم إسرائيل في الولايات المتحدة، تساؤلات حول الكيفية التي يكتسب بها التضامن تأثيراً سياسياً. كيف ساهم الحراك الشعبي المستمر والمجتمع المدني المنظم في هذه التطورات؟ وهل ولّدت المبادرات القانونية والدبلوماسية لدول الجنوب العالمي ضغوطاً إضافية؟ وما الذي يعيق تحوّل هذه الضغوط إلى تحديات حقيقية أمام الحصانة الإسرائيلية؟ تتنازل هذه الورقة هذه الأسئلة من خلال ركيزتين تأسيسيتين للتضامن: مبادرات دول الجنوب العالمي، والحراك الشعبي وتعبئة المجتمع المدني المنظم على الصعيد الدولي. ودون افتراض وجود تنسيق، يبحث هذا الطرح فيما إذا كانت تأثيرات هذه التحركات تعزز بعضها البعض –وكيف يحدث ذلك- في سياق تحدي دعم دول الشمال العالمي للاستعمار الاستيطاني الإسرائيلي. وتوفر المبادرات القانونية، وحملات المقاطعة وسحب الاستثمارات، وانسحاب المؤسسات من العلاقات التجارية، والضغوط الانتخابية، مساحات لدراسة كيفية انتقال المطالب بين الأفراد والمجتمع المدني والدول.\n\nوبالاستناد إلى النقد النسوي وما بعد الاستعماري للقانون الدولي والتوزيع العالمي للثروة، تموضع الورقة هذه العمليات في سياق علاقات متواصلة من الاستغلال والتبعية. وتجادل الورقة بأن الإمكانات السياسية للتضامن مشروطة بالتوزيع غير المتكافئ للموارد والسلطة المؤسسية، وهو ما يشكّل في آنٍ واحد القدرة على ممارسة الضغط والقدرة على مقاومته. وفي ظل هذه القيود، يوفر القانون الدولي وحقوق الإنسان لغةً تحظى بصدى عالمي يمكن توظيفها في عمليات التعبئة. واستلهاماً من التضامن الدولي ضد نظام الفصل العنصري في جنوب أفريقيا، تبحث الورقة في الظروف التي يمكن فيها لضغوط متنوعة أن تسهم في إحداث تحولات في سياسات الدول، مع التمييز بين التغيرات المؤسسية التدريجية وبين التحول الجذري في العلاقات المادية التي تدعم إفلات إسرائيل من العقاب.',
      en: 'Gradual shifts in British policy towards Israel, alongside changing electoral dynamics surrounding support for Israel in the United States, raise questions about how solidarity acquires political influence. How has sustained grassroots and organized civil society mobilization contributed to these developments? Have Global South states’ legal and diplomatic initiatives generated additional pressures? What constrains the translation of these pressures into substantive challenges to Israeli impunity? This paper examines its questions through two constituent elements of solidarity: Global South state initiatives, grassroots and organized civil society mobilization internationally. Without presuming coordination, it investigates whether and how the effects of these movements reinforce one another in challenging Global North states’ support for Israeli settler colonialism. Legal initiatives, boycott and divestment campaigns, organizational withdrawals from commercial relationships, and electoral pressures provide sites for examining how demands travel among individuals, civil society and states.\n\nDrawing on feminist postcolonial critiques of international law and the global distribution of wealth, the paper locates these processes within the context of continuing relations of extraction and dependence. It argues that solidarity’s political possibilities are conditioned by the unequal distribution of resources and institutional power, which shapes both the capacity to exert pressure and the capacity to resist it. Within such constraints, international law and human rights offer a globally resonant language that can be leveraged for mobilization efforts. Inspired by international solidarity against apartheid in South Africa, the paper examines the conditions under which distinct pressures can contribute to making shifts in state policy, while distinguishing gradual institutional changes from the radical transformation of the material relationships sustaining Israeli impunity.',
    } },
  { id: 'ishaq-qassis', name: 'القسيس منذر اسحق ورفعت قسيس', authors: ['القسيس منذر اسحق', 'رفعت قسيس'], lang: 'ar',
    title: { ar: 'دور المسيحيّين الفلسطينيّين في تحوّلات مواقف الكنائس الغربيّة تجاه القضيّة الفلسطينيّة: كايروس فلسطين نموذجاً', en: 'The Role of Palestinian Christians in Transforming Western Churches’ Positions on the Palestinian Cause: Kairos Palestine as a Model' },
    gist: 'يتناول دور حركة كايروس فلسطين ووثيقتيها في إعادة تشكيل الخطاب اللاهوتي الغربي وحشد التضامن الكنسي.',
    abstract: {
      ar: 'تتناول هذه الورقة أبرز التحوّلات التي شهدتها مواقف بعض الكنائس الغربية تجاه القضية الفلسطينية في السنوات الأخيرة، ولا سيما على صعيد الخطاب اللاهوتي والمواقف الكنسية والمناصرة من أجل العدالة وحقوق الشعب الفلسطيني. وتسلّط الورقة الضوء على دور المسيحيين الفلسطينيين في التأثير على هذه التحوّلات، مع التركيز على حركة كايروس فلسطين ووثيقتَيها الأولى والثانية، وكيف أسهمتا في إعادة تشكيل الخطاب اللاهوتي والكنسي حول فلسطين، وحشد التضامن والمناصرة داخل الكنائس والمجتمعات الغربية. كما تسعى الورقة إلى تقييم أثر هذه الجهود في تغيير المواقف الكنسية، واستشراف آفاق تطوير هذا الدور وتعزيزه في المستقبل.',
      en: 'This paper examines significant shifts in the stances of some Western churches toward the Palestinian cause in recent years, specifically regarding theological discourse, official ecclesiastical positions, and advocacy for justice and rights of the Palestinian people. It highlights the role of Palestinian Christians in influencing these transformations, with a focus on the Kairos Palestine movement and its two documents, exploring how they have contributed to reshaping theological and ecclesiastical discourse on Palestine, while mobilizing solidarity and advocacy within Western churches and societies. Furthermore, the paper assesses the impact of these efforts on changing church positions and explores future prospects for further developing and strengthening this role.',
    } },
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
  'Andrea Sangiovanni', 'Salim Vally',
  // Session chairs, in programme order
  'Basem Izbidi', 'George Giacaman', 'Basil Farraj', 'Lena Meari', 'Rahaf Salahat',
  // Additional participants
  'Nimer Sultany', 'Joyce Kashou',
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
      en: 'Faculty member in the Department of Philosophy and Cultural Studies at Birzeit University, and Director of the Muwatin Institute for Democracy and Human Rights and the Master’s Programme in Democracy and Human Rights. His current research interests are grounded in the tradition of the philosophy of praxis and focus on democratisation, decolonisation and emancipation, the concepts of dignity and everyday life, research ethics, political corruption, and populism.',
    },
  },
  'خالدة جرار': {
    name: { ar: 'خالدة جرار', en: 'Khalida Jarrar' },
    photo: 'assets/people/jarrar.png',
    cutout: true,
    bio: {
      ar: 'باحثة متطوعة في معهد مواطن للديمقراطية وحقوق الإنسان، تعمل على بحث بعنوان "الأبعاد الطبقية والنوع اجتماعية للحركة الأسيرة وانعكاساتها في المشروع التحرري"، وأسيرة سابقة.',
      en: 'Volunteer researcher at the Muwatin Institute. She is working on a study titled “The Class and Gender Dimensions of the Prisoner Movement and Their Reflections on the Liberation Project.” She is a former detainee in Israeli prisons.',
    },
  },
  'أسيل حسين': {
    name: { ar: 'أسيل حسين', en: 'Aseel Hussein' },
    photo: 'assets/people/hussein.png',
    cutout: true,
    bio: {
      ar: 'طالبة ماجستير في برنامج الديمقراطية وحقوق الإنسان في جامعة بيرزيت. تعمل حالياً على إعداد دراسة بعنوان: "مستقبل منظومة حقوق الإنسان وإمكاناتها في سياق التحولات والأزمات المعاصرة للنظام العالمي"، التي تبحث في التحديات التي تواجه منظومة حقوق الإنسان في ظل التحولات الجيوسياسية والأزمات المتصاعدة في النظام العالمي، وإمكانات إعادة التفكير في أدوارها ووظائفها ضمن نظام عالمي متغير ومتحول.',
      en: 'Master’s student in the Democracy and Human Rights Programme at Birzeit University. She is currently preparing a study entitled “The Future of the Human Rights System and Its Possibilities in the Context of Contemporary Transformations and Crises in the World Order.” The study examines the challenges facing the human rights system amid ongoing geopolitical transformations and escalating crises, and explores possibilities for rethinking its roles and functions within a changing global order.',
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
      en: 'Faculty member at the Department of Banking and Finance at Birzeit University since 2016. She completed her PhD at Bond University in Australia. Her research focuses on legal theories of financial development. She served as Director of Financial Analysis in the ICT sector for three years before joining the academic field. She is also an animal rights activist.',
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
  'Salim Vally': {
    photo: 'assets/people/vally.png?v=2',
    cutout: true,
    bio: {
      ar: 'مدير مركز حقوق التعليم والتحوّل، ويشغل كرسيّ تعليم المجتمع والكبار والعمّال، وهو أستاذ زائر في جامعة نيلسون مانديلا. نال الدكتوراه من جامعة كوازولو-ناتال، بعد دراسته في جامعتَي ويتواترسراند ويورك، ودرّس محاضراً زائراً في جامعات يورك وكولومبيا وفيرجينيا وفورت هير. تتناول اهتماماته البحثية السياسات التعليمية والاجتماعية في صلتها بحقوق الإنسان والديمقراطية والعدالة الاجتماعية والاقتصادية.',
      en: 'Director of the Centre for Education Rights and Transformation and Chair in Community, Adult and Worker Education. He is also a visiting professor at the Nelson Mandela Metropolitan University. He studied at Wits and York universities and completed his doctorate at UKZN, and has been a visiting lecturer at the universities of York, Columbia, Virginia and Fort Hare. His scholarly interests include educational and social policy as they relate to human rights, democracy and socio-economic justice.',
    },
  },
  // Links in a bio are written [text](url): they open in the popup; the short bio on a card shows the text only
  'Jannis Julien Grimm': {
    photo: 'assets/people/grimm.png?v=2',
    cutout: true,
    bio: {
      ar: 'مدير مجموعة البحث الفضاءات الراديكالية في مركز INTERACT للأبحاث متعدّدة التخصّصات في السلام والنزاع في جامعة برلين الحرّة، وباحث مشارك في معهد دراسات الاحتجاج والحركات الاجتماعية (ipb) في برلين. يتناول عمله ديناميّات العنف السياسي وقمع الدولة، وظروف السياسة الراديكالية وآثارها، والمقاومة العنيفة واللاعنفية، وعمليّات التعبئة العابرة للحدود في مواجهة العنف. نال الدكتوراه في العلوم السياسية من مدرسة برلين للدراسات العليا في الثقافات والمجتمعات المسلمة. وبعدها شارك في إدارة مشروع SAFEResearch في جامعة غوتنبرغ لوضع معايير لإجراء بحث آمن وأخلاقي في سياقات النزاع.',
      en: 'Director of the Research Group Radical Spaces at the INTERACT Center for Interdisciplinary Peace and Conflict Research at Freie Universität Berlin and an associate researcher at the Institute for the Study of Protest and Social Movements (ipb) in Berlin. His work focuses on the dynamics of political violence and state repression, the condition and effects of radical politics and (non)violent resistance as well as transnational mobilization processes in response to violence. He holds a PhD in political science from the Berlin Graduate Muslim Cultures and Societies. After his doctoral studies, he served as a co-director of the SAFEResearch project at the University of Gothenburg to develop standards for the conduct of safe and ethical research in conflict contexts.',
    },
  },
  'Diego Checa Hidalgo': {
    photo: 'assets/people/checa-hidalgo.png',
    cutout: true,
    bio: {
      ar: 'مؤرّخ وأكاديمي إسباني، أستاذ في دائرة التاريخ المعاصر ومدير [معهد دراسات السلام والنزاعات](http://www.ugr.es/en/staff/diego-checa-hidalgo) في جامعة غرناطة. تتناول أبحاثه تاريخ المقاومة اللاعنفية، وبناء السلام، وتحويل النزاعات الدولية.',
      en: 'Spanish historian, professor in the Department of Contemporary History and director of the [Institute of Peace and Conflict Studies](http://www.ugr.es/en/staff/diego-checa-hidalgo) at the University of Granada. His research focuses on the history of nonviolent resistance, peacebuilding, and international conflict transformation.',
    },
  },
  'Tamara Tamimi': {
    photo: 'assets/people/tamimi.png',
    cutout: true,
    bio: {
      ar: 'باحثة ومستشارة فلسطينية من مواليد القدس. حاصلة على الماجستير في قانون حقوق الإنسان من كلية الدراسات الشرقية والأفريقية (SOAS) في جامعة لندن، وتُعدّ حالياً أطروحة دكتوراه في القانون الدولي والقضية الفلسطينية في كلية الحقوق بجامعة كوينز في بلفاست. تقدّم استشارات لمؤسسات فلسطينية ودولية في البحث والمناصرة وتحليل الاقتصاد السياسي، وفي تطوير البرامج وتقييمها في مجالات المساواة بين الجنسين والقانون الدولي وحقوق الإنسان. ويتركّز عملها على الحق في التعليم، وحقوق الإقامة، والتراث الثقافي، والتحوّل الديمقراطي، والسياسات الاجتماعية.',
      en: 'Palestinian researcher and consultant, born in Jerusalem. She holds an MA in Human Rights Law from SOAS, University of London, and is pursuing a PhD in international law and the Palestine question at Queen’s University Belfast School of Law. She advises Palestinian and international organisations on research, advocacy and political economy analysis, and on programme development and evaluation in gender equality, international law and human rights. Her work focuses on the right to education, residency rights, cultural heritage, democratisation and social policy.',
    },
  },
  'Andrea Sangiovanni': {
    photo: 'assets/people/sangiovanni.png',
    cutout: true,
    bio: {
      ar: 'أستاذ الفلسفة في كينغز كوليدج لندن، وتتركّز أبحاثه في الفلسفة الأخلاقية والقانونية والسياسية المعاصرة. نال البكالوريوس والدكتوراه من جامعة هارفارد. وقبل انضمامه إلى دائرة الفلسفة في كينغز كوليدج عام 2007، كان زميلاً بحثياً في كلية بيمبروك بجامعة كامبريدج (2005–2007). وبين عامَي 2018 و2020 شغل منصب أستاذ النظرية الاجتماعية والسياسية في معهد الجامعة الأوروبية في فييزولي. قاد مشروعاً بحثياً حول التضامن في أوروبا بتمويل من مجلس البحوث الأوروبي (2018–2024). من مؤلّفاته «التضامن: طبيعته وأسسه وقيمته» (منشورات جامعة مانشستر، 2024، بوصول مفتوح)، الذي يضمّ خمس مقالات نقدية لكاثرين لو وسالي شولتز وراينر فورست وأفري كولرز وجاريد هولي، و«[إنسانية بلا كرامة: المساواة الأخلاقية والاحترام وحقوق الإنسان](http://www.hup.harvard.edu/catalog.php?isbn=9780674049215&content=reviews)» (منشورات جامعة هارفارد، 2017) حول فكرة المساواة الأخلاقية وأهميتها لحقوق الإنسان.',
      en: 'Professor of Philosophy at King’s College London, working mainly in contemporary moral, legal and political philosophy. He received his BA and PhD from Harvard University. Before joining the Philosophy Department at KCL in 2007, he was Randall Dillard Research Fellow at Pembroke College, University of Cambridge (2005–2007). From 2018 to 2020 he was Professor of Social and Political Theory at the European University Institute, Fiesole. He led an ERC-funded project (Consolidator Grant, 2018–2024) on solidarity in Europe. He is the author of “Solidarity: Nature, Grounds, and Value” (Manchester University Press, 2024, open access), which includes five critical essays by Catherine Lu, Sally Scholz, Rainer Forst, Avery Kolers and Jared Holley, and “[Humanity without Dignity: Moral Equality, Respect, and Human Rights](http://www.hup.harvard.edu/catalog.php?isbn=9780674049215&content=reviews)” (Harvard University Press, 2017), on the idea of moral equality and its importance for human rights.',
    },
  },
  'القسيس منذر اسحق': {
    photo: 'assets/people/isaac.png',
    cutout: true,
    bio: {
      ar: 'قسّ ولاهوتي فلسطيني مسيحي، يرعى اليوم كنيسة الميلاد الإنجيلية اللوثرية في بيت لحم والكنيسة اللوثرية في بيت ساحور. وهو العميد الأكاديمي لكلية بيت لحم للكتاب المقدّس، ومدير مؤتمرات «المسيح عند الحاجز» المعروفة والمؤثّرة، وتشغله قضايا اللاهوت الفلسطيني. درس الهندسة المدنية في جامعة بيرزيت، ثم نال الماجستير في الدراسات الكتابية من كلية وستمنستر اللاهوتية، والدكتوراه من مركز أكسفورد لدراسات الرسالة.',
      en: 'Munther Isaac is a Palestinian Christian pastor and theologian. He now pastors the Evangelical Lutheran Christmas Church in Bethlehem and the Lutheran Church in Beit Sahour. He is also the academic dean of Bethlehem Bible College, and is the director of the highly acclaimed and influential Christ at the Checkpoint conferences. Munther is passionate about issues related to the Palestinian theology. Munther originally studied civil engineering in Birzeit University in Palestine. He then obtained a Master in Biblical Studies from Westminster Theological Seminary and then a PhD from the Oxford Centre for Mission Studies.',
    },
  },
  'رفعت قسيس': {
    photo: 'assets/people/rifat-kassis.png',
    cutout: true,
    bio: {
      ar: 'ناشط فلسطيني في مجال حقوق الإنسان، وناشط سياسي ومجتمعي، وكاتب ومحاضر. اعتقلته إسرائيل وسجنته مرّات عدّة. وُلد في بيت ساحور لعائلة فلسطينية مسيحية، وأسّس عام 1991 الفرع الفلسطيني للمنظمة الدولية لحقوق الطفل، الحركة العالمية للدفاع عن الأطفال (DCI)، وانتُخب عام 2005 رئيساً للحركة الدولية، ثم أُعيد انتخابه لولاية أخرى في تشرين الأول/أكتوبر 2008. وفي عام 2014 أنهى عمله مديراً عاماً للحركة العالمية للدفاع عن الأطفال – فلسطين، وانتقل مؤقتاً إلى الأردن لقيادة برنامج الاتحاد اللوثري العالمي هناك.',
      en: 'Rifat Kassis is a Palestinian human rights and political and community activist. He is an author and speaker. He has been arrested and imprisoned several times by Israel. Born in Beit Sahour to a Palestinian Christian family, he founded in 1991 the Palestinian section of the international child rights organization, Defence for Children International (DCI) and in 2005 he was elected President of the international movement. In October 2008, he was re-elected President for another term. In 2014, he concluded his work as General Director of Defense for Children International Palestine and moved temporarily to Jordan to lead the Lutheran World Federation program there.',
    },
  },
  'Sardar Saadi': {
    photo: 'assets/people/saadi.png',
    cutout: true,
    bio: {
      ar: 'أنثروبولوجي اجتماعي ثقافي متخصّص في الشرق الأوسط، ويركّز خصوصاً على السياسة والمجتمع الكرديّين. نال الدكتوراه في الأنثروبولوجيا الاجتماعية الثقافية من جامعة تورنتو عام 2020، بدعم من منحة جوزيف-أرمان بومباردييه من مجلس أبحاث العلوم الاجتماعية والإنسانية الكندي (SSHRC). تناولت أطروحته الديناميّات الحضرية للنضال الكردي من أجل تقرير المصير في ديار بكر، كردستان، وتنظر في انتقال المواجهة بين الحركة الكردية والدولة التركية من الجبال إلى المدينة، وكيف حوّل ذلك السياسة الكردية نحو إقامة حكم ذاتي ديمقراطي كردي في المنطقة وتطوير أشكال جديدة من التعامل مع الدولة.',
      en: 'Sociocultural anthropologist specializing in the Middle East, with a particular focus on Kurdish politics and society. He earned his PhD in Sociocultural Anthropology from the University of Toronto in 2020, supported by a SSHRC Joseph-Armand Bombardier scholarship. His dissertation examined the urban dynamics of the Kurdish struggle for self-determination in Diyarbakir, Kurdistan. This study looks at the shift of confrontation between the Kurdish movement and the Turkish state from mountains to the city, and how it has transformed Kurdish politics toward establishing a Kurdish democratic autonomy in the region and developing new forms of engagement with the state.',
    },
  },
  'Nadia Hindi Mediavilla': {
    photo: 'assets/people/hindi-mediavilla.png',
    cutout: true,
    bio: {
      ar: 'باحثة وأكاديمية إسبانية-عراقية، وأستاذة في قسم الدراسات السامية في جامعة غرناطة في إسبانيا. وُلدت في بغداد عام 1977، وتتخصّص في الدراسات العربية والإسلامية، مع تركيز خاص على الحركات النسوية في العالم العربي.',
      en: 'Nadia Hindi Mediavilla is a Spanish-Iraqi scholar, researcher, and professor in the Department of Semitic Studies at the University of Granada in Spain. Born in Baghdad in 1977, she specializes in Arab and Islamic studies with a particular focus on feminist movements in the Arab world.',
    },
  },
  'حسن ايوب': {
    photo: 'assets/people/ayoub.png',
    cutout: true,
    bio: {
      ar: 'رئيس دائرة العلوم السياسية في جامعة النجاح الوطنية. تتركّز أبحاثه على التحوّلات في النظام السياسي الدولي، والسياسة الخارجية الأمريكية، والسياسة الفلسطينية، ويعمل في التدريب المهني في مجالات حلّ النزاعات والحكم الرشيد والديمقراطية وحقوق الإنسان. عمل في العام الأكاديمي 2020–2021 باحثاً زائراً في مركز دراسات الشرق الأوسط في جامعة دنفر، حيث صمّم مساقاً عن السلام والنزاع في الشرق الأوسط ودرّسه. ومن أبحاثه الحديثة «سياسات إدارة ترامب تجاه فلسطين: ذروة قوة الصهيونية المسيحية» المنشور في مجلة «دراسات» الصادرة عن الجامعة الأردنية.',
      en: 'Head of the Political Science Department at An-Najah National University. His research focuses on shifts in the international political system, American foreign policy and Palestinian politics, and he is active in professional training on conflict resolution, good governance, democracy and human rights. In the 2020–2021 academic year he was a visiting scholar at the Centre for Middle East Studies at the University of Denver, where he designed and taught a course on peace and conflict in the Middle East. His recent work includes “Trump Administration Policies Toward Palestine: The Climax of Christian-Zionist Power”, published in Dirasat, the University of Jordan journal.',
    },
  },
  'Belén Habboob Martos': {
    photo: 'assets/people/habboob-martos.png',
    cutout: true,
    bio: {
      ar: 'باحثة إسبانية في مرحلة ما قبل الدكتوراه وأنثروبولوجية اجتماعية في [جامعة غرناطة](http://www.ugr.es/en/staff/belen-habboob-martos)، تتخصّص في فلسطين وبلاد الشام ودراسات المرأة والنوع الاجتماعي. تعمل ضمن الكادر التدريسي والبحثي قيد التأهيل (بعقد ما قبل الدكتوراه FPU) في قسم الأنثروبولوجيا الاجتماعية.',
      en: 'Belén Habboob Martos is a Spanish predoctoral researcher and social anthropologist at the [University of Granada (UGR)](http://www.ugr.es/en/staff/belen-habboob-martos), specializing in Palestine, the Levant, and women\'s and gender studies. She works as a teaching and research staff member in training (FPU predoctoral contract) in the Department of Social Anthropology.',
    },
  },
  'Basil Farraj': {
    photo: 'assets/people/farraj.png',
    cutout: true,
    bio: {
      ar: 'مدير معهد إبراهيم أبو لغد للدراسات الدولية، وأستاذ مساعد في دائرة الفلسفة والدراسات الثقافية في جامعة بيرزيت. نال الدكتوراه في الأنثروبولوجيا وعلم الاجتماع من معهد جنيف للدراسات العليا، وتتناول أبحاثه تقاطعات الذاكرة والمقاومة والفن لدى الأسرى وغيرهم ممّن يقع عليهم العنف. أجرى أبحاثاً في عدّة بلدان، منها تشيلي وكولومبيا وفلسطين.',
      en: 'Basil Farraj is the Director of the Ibrahim Abu Lughod Institute of International Studies and an assistant professor at the Department of Philosophy and Cultural Studies at Birzeit University. He holds a PhD in Anthropology and Sociology from the Geneva Graduate Institute, and his research addresses the intersections of memory, resistance, and art by prisoners and others at the receiving end of violence. Basil has conducted research in several countries, including Chile, Colombia, and Palestine.',
    },
  },
  'Lena Meari': {
    photo: 'assets/people/meari.webp',
    cutout: true,
    bio: {
      ar: 'أستاذة مساعدة في الأنثروبولوجيا في دائرة العلوم الاجتماعية والسلوكية ومعهد دراسات المرأة في جامعة بيرزيت. تشمل اهتماماتها الجغرافيا السياسية لإنتاج المعرفة، والنظرية النسوية لنزع الاستعمار، والحركات الثورية، ومنهجيات نزع الاستعمار. وتتركّز أبحاثها على تشكّل الذاتية الثورية في السياقات الاستعمارية، وعلى ممارسات الصمود لدى الأسرى السياسيين الفلسطينيين.',
      en: 'Assistant Professor of Anthropology in the Department of Social and Behavioral Sciences and the Institute of Women’s Studies at Birzeit University. Her interests include the geopolitics of knowledge production, decolonial feminist theory, revolutionary movements, and decolonising methodologies. Her research focuses on the formation of revolutionary subjectivity in colonial contexts and the practices of sumud among Palestinian political prisoners.',
    },
  },
  'George Giacaman': {
    photo: 'assets/people/giacaman.png',
    cutout: true,
    bio: {
      ar: 'أكاديمي ومفكّر فلسطيني، ومن أبرز المثقفين الفلسطينيين في مجال الفكر السياسي والنقدي في السياق العربي. ساهم على نطاق واسع في تطوير الفكر السياسي والاجتماعي في فلسطين، وتميّز بتحليلاته النقدية للنيوليبرالية وسياسات الدولة وأطروحات ما بعد الحداثة، وله حضور بارز في النقاشات الفكرية حول القضية الفلسطينية وسبل مقاومة الاحتلال الإسرائيلي. يشغل منصب المدير العام لمؤسسة الدراسات الفلسطينية منذ عام 2020.',
      en: 'Palestinian academic and thinker, and one of the foremost Palestinian intellectuals in the field of political and critical thought in the Arab context. He has contributed widely to the development of political and social thought in Palestine, and is known for his critical analyses of neoliberalism, state policies and the theses of postmodernism. He is a prominent voice in intellectual debates on the Palestinian cause and on the means of resisting the Israeli occupation. He has been Director General of the Institute for Palestine Studies since 2020.',
    },
  },
  'طلال شهوان': {
    photo: 'assets/people/shahwan.webp',
    cutout: true,
  },
  'Bram J. De Smet': {
    photo: 'assets/people/de-smet.webp',
    cutout: true,
  },
  'Basem Izbidi': {
    photo: 'assets/people/izbidi.webp?v=2',
    cutout: true,
    bio: {
      en: 'Teaches in the Department of Political Science and the Master’s programme in Democracy and Human Rights at Birzeit University. He holds a PhD in political theory from the University of Cincinnati. His research covers Hamas, state-building, political reform, democratisation, and the relationship between the West and the Islamic world. He is co-author of “The West and the Muslim World: The Muslim Position” (IFA, 2004) and co-editor of “Popular Protest in the New Middle East: Islamism and Post-Islamist Politics” (I.B. Tauris, 2014).',
    },
  },
  'ياسمين الجعبة': {
    photo: 'assets/people/jubeh.webp?v=2',
    cutout: true,
    bio: {
      en: 'Trainee researcher and Master’s student in the Democracy and Human Rights Programme at Birzeit University, currently working on a study titled “Transformations of Language and Consciousness among the Palestinian Elite under British Colonial Rule.”',
    },
  },
  'Santosh Kumar': {
    photo: 'assets/people/kumar.webp?v=2',
    cutout: true,
  },
  'Rahaf Salahat': {
    photo: 'assets/people/salahat.webp',
    cutout: true,
  },
  'Mohammad Allahham': {
    photo: 'assets/people/allahham.webp',
    cutout: true,
  },
  'حياة الطويل': {
    photo: 'assets/people/altaweel.webp',
    cutout: true,
  },
  'إسلام نصر': {
    photo: 'assets/people/islam.webp',
    cutout: true,
    bio: {
      ar: 'باحث في العلوم الاجتماعية، وحاصل على درجة الماجستير في علم الاجتماع من جامعة بيرزيت.',
    },
  },
  'Eman AlAsah': {
    bio: {
      ar: 'إيمان العصا باحثة أكاديمية ومنسقة في مبادرة كرامة، وأستاذة غير متفرغة في دائرة الفلسفة والدراسات الثقافية في جامعة بيرزيت، متخصصة في دراسات ما بعد الاستعمار والدراسات الثقافية. حاصلة على درجة الماجستير من جامعة دورهام، ودرجة الدكتوراه في دراسات ما بعد الاستعمار من جامعة نورثمبريا في نيوكاسل. تتركز اهتماماتها البحثية على قضايا الاستعمار وما بعد الاستعمار وإنتاج المعرفة.',
      en: 'Eman AlAsah is an academic researcher and coordinator at the Dignity Initiative and an adjunct faculty member in the Department of Philosophy and Cultural Studies at Birzeit University. She specializes in postcolonial and cultural studies. She holds a Master’s degree from Durham University and a PhD in Postcolonial Studies from Northumbria University in Newcastle. Her research interests focus on colonialism and post-colonialism and the production of knowledge.',
    },
  },
  'Nimer Sultany': {
    photo: 'assets/people/sultany.webp',
    cutout: true,
    bio: {
      en: 'Dr Nimer Sultany is Professor of Law. He holds a Doctor of Juridical Science degree from Harvard Law School and was the recipient of the British Academy Fellowship and a Postdoctoral Fellowship at SUNY Buffalo Law School. Dr Sultany serves as the chair of the Centre for Palestine Studies and served as the elected chair of the Academic Assembly. He also serves as the Editor-in-Chief of the Palestine Yearbook of International Law, a leading journal for critical scholarship on Palestine and international law.',
    },
  },
  'Joyce Kashou': {
    photo: 'assets/people/kashou.webp',
    cutout: true,
    bio: {
      ar: 'مسؤولة البرامج في معهد مواطن للديمقراطية وحقوق الإنسان في جامعة بيرزيت. حاصلة على درجة الماجستير في المساواة وحقوق الإنسان من جامعة غلاسغو ودرجة ماجستير ثانية في التنمية والنوع الاجتماعي من جامعة بيرزيت.',
      en: 'Programmes Officer at Muwatin Institute for Democracy and Human Rights – Birzeit University. Holds two MA degrees in Equality and Human Rights from the University of Glasgow, and Gender and Development from Birzeit University. Ms. Kashou has previously worked as a researcher focusing on social and political research.',
    },
  },
};

// Bio text with [text](url) links: as HTML links (popup), or as plain text (cards)
const BIO_LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
const bioPlain = (s) => String(s).replace(BIO_LINK, '$1');
const bioLinked = (s) => escName(s).replace(BIO_LINK, '<a href="$2" target="_blank" rel="noopener">$1</a>');

// Everyone's name in both languages, spelt as in the final programme. Keys are the names used above.
const NAMES = {
  'مضر قسيس': ['مضر قسّيس', 'Mudar Kassis'],
  'طلال شهوان': ['طلال شهوان', 'Talal Shahwan'],
  'Andrea Sangiovanni': ['أندريا سانجوفاني', 'Andrea Sangiovanni'],
  'Salim Vally': ['سليم فالي', 'Salim Vally'],
  'Basem Izbidi': ['باسم الزبيدي', 'Basem Ezbidi'],   // spelt Ezbidi in the final programme (EN 261119)
  'George Giacaman': ['جورج جقمان', 'George Giacaman'],
  'Basil Farraj': ['باسل فرّاج', 'Basil Farraj'],
  'Lena Meari': ['لينة ميعاري', 'Lena Meari'],
  'Rahaf Salahat': ['رهف صلاحات', 'Rahaf Salahat'],
  'Jannis Julien Grimm': ['يانيس جوليان غريم', 'Jannis Julien Grimm'],
  'Bram J. De Smet': ['برام دي سميت', 'Bram J. De Smet'],
  'ياسمين الجعبة': ['ياسمين جعبة', 'Yasmeen Jubeh'],
  'Santosh Kumar': ['سانتوش كمار', 'Santosh Kumar'],
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
  'Thalia Kruger': ['ثاليا كروجر', 'Thalia Kruger'],
  'Eman AlAsah': ['إيمان العصا', 'Eman AlAsah'],
  'إسلام نصر': ['إسلام نصر', 'Islam Nasr'],
  'Nimer Sultany': ['نمر سلطاني', 'Nimer Sultany'],
  'Joyce Kashou': ['جويس كاشو', 'Joyce Kashou'],
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

// Sorting participants by family name, in the page language. The key is the last part of the written
// name (minus any leading title); a few compound surnames get an explicit key so they sort on the
// right part (e.g. the first of two Spanish surnames). For Arabic, tashkeel and a leading "ال" are
// dropped so names sort by the root letter.
const SORT_FAMILY = {
  'Bram J. De Smet': { ar: 'دي سميت', en: 'De Smet' },
  'Diego Checa Hidalgo': { ar: 'تشيكا', en: 'Checa' },
  'Belén Habboob Martos': { ar: 'حبوب', en: 'Habboob' },
  'Nadia Hindi Mediavilla': { ar: 'هندي', en: 'Hindi' },
};
const stripTashkeel = (s) => s.replace(/[ً-ْٰـ]/g, '');
const familyKey = (person, lang) => {
  const ov = SORT_FAMILY[person];
  let key = (ov && ov[lang]) || nameIn(person, lang).trim().split(/\s+/).pop();
  if (lang === 'ar') key = stripTashkeel(key).replace(/^ال/, '').replace(/^[أإآ]/, 'ا');
  return key;
};
const byFamily = (lang) => (p, q) =>
  familyKey(p.person, lang).localeCompare(familyKey(q.person, lang), lang === 'ar' ? 'ar' : 'en');

// The first lines of the bio on a photo card, in both languages (the toggle shows one; CSS trims it to a few lines)
// The opening of a bio for a card: cut at a word boundary so it fits beside the photo (the popup has the rest)
const cardSnippet = (text, max = 85) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s،,.;:]+$/, '') + '…';
};
const cardBio = (p) => {
  if (!p.bio) return '';
  const one = (lang) => {
    const b = typeof p.bio === 'string' ? { text: p.bio, lang: null } : bioFor(p, lang);
    return b ? `<span class="card-bio" data-i18n="${lang}"${b.lang ? ` lang="${b.lang}" dir="${b.lang === 'ar' ? 'rtl' : 'ltr'}"` : ''}>${escName(cardSnippet(bioPlain(b.text)))}</span>` : '';
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
    ar: { speaking: 'المداخلة', abstract: 'الملخص', close: 'إغلاق', prev: 'السابق', next: 'التالي', readAbstract: 'الملخص', back: 'العودة إلى', prevAbs: 'الملخص السابق', nextAbs: 'الملخص التالي' },
    en: { speaking: 'Intervention', abstract: 'Abstract', close: 'Close', prev: 'Previous participant', next: 'Next participant', readAbstract: 'Abstract', back: 'Back to', prevAbs: 'Previous abstract', nextAbs: 'Next abstract' },
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
  const openProfile = (person, a = { noPaper: true, lang: 'ar' }) => {
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
    const bioTag = bio ? `<p class="profile-bio"${bio.lang ? ` lang="${bio.lang}" dir="${dirOf(bio.lang)}"` : ''}>${bioLinked(bio.text)}</p>` : '';
    // "Intervention": the paper title, which opens its abstract
    const t = a.noPaper ? null : titleIn(a, lang);
    const role = a.noPaper ? roleOf(person, lang) : null;
    const paperTag = a.noPaper ? (role ? `
      <div class="profile-paper-card is-role">
        <span class="profile-kicker">${ui.speaking}</span>
        <span class="profile-paper-quote">${esc(role)}</span>
      </div>` : '') : `
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
    dlg.querySelector('.profile-paper-card')?.addEventListener('click', (e) => { e.preventDefault(); openAbstract(a, person); });
    show();
    const img = dlg.querySelector('.profile-body .profile-cutout');
    if (img) { fitFloat(); if (!img.complete) img.addEventListener('load', fitFloat, { once: true }); }
  };

  // What someone without a paper does at the conference, read from the programme below
  // (opening remarks, a keynote, or chairing a session), in the given language
  const roleOf = (person, lang) => {
    const tag = `{{${person}}}`;
    for (const day of DAYS) {
      for (const item of day.items) {
        if (item.chair === person) {
          const s = item[lang];
          return lang === 'ar'
            ? `رئاسة ${s.label.replace(/:$/, '')}: ${s.title}`
            : `Chair, ${s.label.replace(/:$/, '')}: ${s.title}`;
        }
        if (item.keynote && item.ar.includes(tag)) {
          return lang === 'ar' ? item.ar.replace(`كلمة ${tag} `, 'الكلمة ') : item.en.replace(` by ${tag}`, '');
        }
        if (item.lines && item.lines.ar.some((l) => l.includes(tag))) return lang === 'ar' ? 'كلمة افتتاحيّة' : item.en;
      }
    }
    return null;
  };

  // An abstract's card: title, the authors (each opens their card), and the abstract itself.
  // `from` is the person whose card it was opened from; the sheet then offers a way back to that card.
  const openAbstract = (a, from = null) => {
    const lang = uiLang();
    const ui = T[lang];
    const t = titleIn(a, lang);
    // The full abstract in the page language (falling back to the other one), else the gist
    const full = a.abstract && (typeof a.abstract === 'string'
      ? { text: a.abstract, lang: a.lang }
      : a.abstract[lang] ? { text: a.abstract[lang], lang }
      : { text: a.abstract[lang === 'ar' ? 'en' : 'ar'], lang: lang === 'ar' ? 'en' : 'ar' });
    const text = full ? full.text : a.gist;
    const textLang = full ? full.lang : a.lang;
    const body = text
      ? `<div class="abstract-text" lang="${textLang}" dir="${dirOf(textLang)}">${text.split(/\n\s*\n/).map((para) => `<p>${esc(para)}</p>`).join('')}</div>`
      : `<div class="abstract-text is-empty">${pendingGist[lang]}</div>`;
    dlg.className = 'profile-dialog abstract-dialog';
    // A sheet of paper on the backdrop: long abstracts lengthen the sheet and the whole view scrolls, like a page
    dlg.innerHTML = `
      <article class="abstract-sheet">
        <button class="profile-close" type="button" aria-label="${ui.close}">×</button>
        ${from ? `<button class="abstract-back" type="button"><span aria-hidden="true" dir="ltr">${lang === 'ar' ? '›' : '‹'}</span> ${ui.back} ${esc(nameIn(from, lang))}</button>` : ''}
        <header class="abstract-head">
          <span class="profile-kicker">${ui.abstract}</span>
          <h3 class="abstract-title" lang="${t ? t.lang : lang}" dir="${dirOf(t ? t.lang : lang)}">${esc(t ? t.text : pendingLabel[lang])}</h3>
          <p class="abstract-names">${speakersHtml(a, lang)}</p>
        </header>
        ${body}
      </article>`;
    dlg.scrollTop = 0;
    dlg.querySelectorAll('.abstract-names .person-link').forEach((b) => {
      b.addEventListener('click', () => openProfile(b.dataset.person, a));
    });
    dlg.querySelector('.abstract-back')?.addEventListener('click', () => openProfile(from, a));
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
  const PEOPLE = []; // the participants in display order; filled (and re-sorted) by renderParticipants
  const participantCards = [];
  const seenPerson = new Set();

  for (const a of ALL_ENTRIES) {
    if (participantsEl) {
      for (const person of authorsOf(a)) {
        if (seenPerson.has(person)) continue;
        seenPerson.add(person);
        const card = document.createElement('div');
        card.className = 'participant-card';
        const prof = PROFILES[person];
        if (prof && prof.cutout) {
          // Photo card: the photo floats under the name and the bio wraps around the person's outline
          card.classList.add('has-cutout');
          const media = `<img class="cutout" src="${esc(prof.photo)}" alt="" style="shape-outside: url('${esc(prof.photo)}')">`;
          card.innerHTML = `
            <button class="person-btn" type="button">
              <span class="name" lang="${a.lang}" dir="${dirOf(a.lang)}">${nameHtml(person)}</span>
              <span class="card-figure">${media}${cardBio(prof)}${prof.bio ? `<span class="card-more"><span data-i18n="ar">المزيد</span><span data-i18n="en" lang="en" dir="ltr">Read more</span></span>` : ''}</span>
            </button>`;
        } else {
          // Placeholder card (no photo yet): a large initial and the name, centred, the same size as a
          // photo card, so the list stays one even alphabetical grid. It becomes a photo card once added.
          card.classList.add('is-placeholder');
          const av = prof && prof.photo
            ? `<img class="ph-avatar ph-photo" src="${esc(prof.photo)}" alt="" loading="lazy">`
            : `<span class="ph-avatar" aria-hidden="true"><span data-i18n="ar">${esc(initialOf(nameIn(person, 'ar')))}</span><span data-i18n="en">${esc(initialOf(nameIn(person, 'en')))}</span></span>`;
          card.innerHTML = `
            <button class="person-btn" type="button">
              ${av}
              <span class="name" lang="${a.lang}" dir="${dirOf(a.lang)}">${nameHtml(person)}</span>
            </button>`;
        }
        card.querySelector('.person-btn').addEventListener('click', () => openProfile(person, a));
        participantCards.push({ person, a, card, photo: !!(prof && prof.cutout) });
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

  // Participants: one even grid, everyone in a single list ordered alphabetically by family name, in the
  // page language (re-sorting on toggle). Photo cards and placeholder cards are the same size; the popup's
  // previous / next step through the same order.
  if (participantsEl) {
    const renderParticipants = (lang) => {
      const ordered = participantCards.slice().sort(byFamily(lang));
      // --i is the card's place in the list; the stylesheet turns it into the
      // entrance delay so the grid cascades instead of landing all at once
      ordered.forEach((x, i) => x.card.style.setProperty('--i', i));
      participantsEl.replaceChildren(...ordered.map((x) => x.card));
      PEOPLE.length = 0;
      for (const x of ordered) PEOPLE.push({ person: x.person, a: x.a });
    };
    renderParticipants(uiLang());
    document.addEventListener('langchange', (e) => renderParticipants(e.detail || uiLang()));
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
          papers: ['kumar', 'kruger'] },
        { time: '13:30', ar: 'غداء', en: 'Lunch' },
        { time: '14:15', chair: 'Basil Farraj',
          ar: { label: 'الجلسة الثالثة:', title: 'إرهاصات وتداعيات التضامن', chairLabel: 'رئيس الجلسة:' },
          en: { label: 'Session III:', title: 'The Precursors and Repercussions of Solidarity', chairLabel: 'Chair:' },
          papers: ['saadi', 'vlachou', 'jarrar', 'ayoub'] },
      ],
    },
    {
      ar: 'اليوم الثاني - الأربعاء، 16 كانون الأوّل/ديسمبر 2026',
      en: 'Second Day - Wednesday, 16 December 2026',
      items: [
        { time: '10:00', ar: 'قهوة', en: 'Morning Coffee and Registration' },
        { time: '10:30', keynote: true,
          ar: 'كلمة {{Salim Vally}} المفتاحيّة: أكثر من انجذاب فطريّ: فلسطين، وانكشاف الليبراليّة، وواجب المقاومة العالميّة',
          en: 'Keynote Address by {{Salim Vally}}: More Than a Visceral Tug: Palestine, the Unravelling of Liberalism and the Imperative for Global Resistance' },
        { time: '11:15', chair: 'Lena Meari',
          ar: { label: 'الجلسة الرابعة:', title: 'التضامن حول الحقوق', chairLabel: 'رئيسة الجلسة:' },
          en: { label: 'Session IV:', title: 'Solidarity Around Rights', chairLabel: 'Chair:' },
          papers: ['allahham', 'husein', 'tawil', 'hindi-arqawi-sadeq'] },
        { time: '13:15', ar: 'غداء', en: 'Lunch' },
        { time: '14:00', chair: 'Rahaf Salahat',
          ar: { label: 'الجلسة الخامسة:', title: 'أنماط تضامنيّة متجدّدة', chairLabel: 'رئيسة الجلسة:' },
          en: { label: 'Session V:', title: 'Emerging Forms of Solidarity', chairLabel: 'Chair:' },
          papers: ['checa-hidalgo', 'habboob-hindi', 'ishaq-qassis', 'tamimi'] },
      ],
    },
  ];

  // The abstracts are listed in the programme's session order. Taking the order from DAYS
  // rather than from the order of ABSTRACTS keeps the two in step on their own: change a
  // session's papers above and the Abstracts section follows. A paper that is not on the
  // programme (a withdrawn one) keeps its card and is listed after the others.
  if (abstractsEl) {
    const order = DAYS.flatMap((d) => d.items.flatMap((i) => i.papers || []));
    const rank = new Map(order.map((id, i) => [id, i]));
    const rankOf = (el) => (rank.has(el.id.slice(4)) ? rank.get(el.id.slice(4)) : Infinity);
    [...abstractsEl.children]
      .sort((a, b) => rankOf(a) - rankOf(b))
      .forEach((el, i) => { el.style.setProperty('--i', i); abstractsEl.appendChild(el); });
  }

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
    ambient = !reduce;

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
  // Phones have no pinned scroll, so there the threads play on their own when the page opens
  const INTRO_DELAY = 250;
  const INTRO_LEN = 3600;
  const progress = () => {
    if (reduce) return 1;
    if (mobileQuery.matches) return clamp((performance.now() - loadedAt - INTRO_DELAY) / INTRO_LEN);
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
  current = reduce ? progress() : 0; // ease in from empty on load (desktop: towards the scroll position; phones: the intro)
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
