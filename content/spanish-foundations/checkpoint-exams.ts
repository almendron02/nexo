import type { ConceptId, FillBlock, StoryFillBlock } from "@/content/schemas";

type ExamQuestion = {
  before: string;
  after: string;
  answer: string;
  accepted?: string[];
  concepts: ConceptId[];
  feedback: string;
};

type ModuleExam = {
  module: number;
  title: string;
  concepts: ConceptId[];
  questions: ExamQuestion[];
};

function moduleBlock(checkpoint: number, exam: ModuleExam): FillBlock {
  if (exam.questions.length !== 10) {
    throw new Error(`Checkpoint ${checkpoint}, Module ${exam.module} must contain exactly 10 questions.`);
  }

  return {
    id: `cp${checkpoint}-module-${exam.module}`,
    type: "fill",
    conceptIds: exam.concepts,
    eyebrow: `Module ${exam.module} · 20 points`,
    heading: exam.title,
    prompt: "Complete all ten items from memory. Each question is worth 2 points; your first answer determines the grade.",
    items: exam.questions.map((question, index) => ({
      id: `cp${checkpoint}-m${exam.module}-q${index + 1}`,
      before: question.before,
      after: question.after,
      answer: question.answer,
      accepted: question.accepted ?? [question.answer],
      conceptIds: question.concepts,
      feedback: question.feedback,
    })),
  };
}

const checkpointOneModules: ModuleExam[] = [
  {
    module: 0,
    title: "Start Here: sound, stress, and first exchanges",
    concepts: ["learning_cycle", "spanish_vowels", "spanish_consonants", "stress_rules", "accent_marks", "greeting_chunks"],
    questions: [
      { before: "Yo ", after: " la idea. (I understand)", answer: "entiendo", concepts: ["learning_cycle"], feedback: "Entiendo names the first job in the learning cycle: making meaning clear." },
      { before: "Yo ", after: " sin mirar la respuesta. (I practice)", answer: "practico", concepts: ["learning_cycle"], feedback: "Practico describes controlled work after the pattern is understood." },
      { before: "Yo ", after: " una frase nueva. (I produce)", answer: "produzco", concepts: ["learning_cycle"], feedback: "Produzco means creating Spanish without copying the model." },
      { before: "c", after: "sa (house)", answer: "a", concepts: ["spanish_vowels"], feedback: "Casa uses the stable Spanish a sound." },
      { before: "v", after: "no (wine)", answer: "i", concepts: ["spanish_vowels"], feedback: "Vino uses the stable Spanish i sound in its first syllable." },
      { before: "The written h in hola is ", after: ".", answer: "silent", concepts: ["spanish_consonants"], feedback: "Spanish h is silent, so hola begins directly with the vowel." },
      { before: "ni", after: "o (boy)", answer: "ñ", accepted: ["ñ"], concepts: ["spanish_consonants"], feedback: "Niño uses ñ, a separate Spanish letter." },
      { before: "ca", after: "o (car)", answer: "rr", concepts: ["spanish_consonants"], feedback: "Carro uses rr to distinguish it from caro." },
      { before: "Write the word with its stress mark: ", after: " (pencil)", answer: "lápiz", concepts: ["stress_rules", "accent_marks"], feedback: "Lápiz carries a written accent because its stress breaks the default consonant-ending pattern." },
      { before: "Hola. Me ", after: " Ana.", answer: "llamo", concepts: ["greeting_chunks"], feedback: "Me llamo is the complete high-frequency chunk for giving your name." },
    ],
  },
  {
    module: 1,
    title: "Nouns, articles, gender, and number",
    concepts: ["noun_gender", "gender_patterns", "articles_indefinite", "articles_definite", "noun_number", "noun_phrase"],
    questions: [
      { before: "", after: " casa (a house)", answer: "una", concepts: ["articles_indefinite", "noun_gender"], feedback: "Casa is feminine singular, so the indefinite article is una." },
      { before: "", after: " libro (a book)", answer: "un", concepts: ["articles_indefinite", "noun_gender"], feedback: "Libro is masculine singular, so use un." },
      { before: "", after: " problema (the problem)", answer: "el", concepts: ["gender_patterns", "articles_definite"], feedback: "Problema is a common masculine noun ending in -ma, so use el." },
      { before: "", after: " mano (the hand)", answer: "la", concepts: ["gender_patterns", "articles_definite"], feedback: "Mano is a high-frequency feminine exception, so use la." },
      { before: "la ciudad → las ", after: "", answer: "ciudades", concepts: ["noun_number"], feedback: "A noun ending in a consonant adds -es: ciudades." },
      { before: "el libro → ", after: " libros", answer: "los", concepts: ["articles_definite", "noun_number"], feedback: "The masculine plural definite article is los." },
      { before: "una clase → ", after: " clases", answer: "unas", concepts: ["articles_indefinite", "noun_number"], feedback: "The feminine plural indefinite article is unas." },
      { before: "", after: " estudiantes están aquí. (the students; mixed or unspecified group)", answer: "Los", accepted: ["los"], concepts: ["articles_definite", "noun_phrase"], feedback: "Los is the conventional plural article for a masculine or mixed group." },
      { before: "Quiero ", after: " café. (some coffee, not a specific one)", answer: "un", concepts: ["articles_indefinite", "noun_phrase"], feedback: "Un introduces one nonspecific café." },
      { before: "", after: " profesora de español está aquí. (the identified teacher)", answer: "La", accepted: ["la"], concepts: ["articles_definite", "noun_phrase"], feedback: "La marks a specific feminine singular noun phrase." },
    ],
  },
  {
    module: 2,
    title: "Adjective meaning, position, and agreement",
    concepts: ["adjective_function", "adjective_gender", "adjective_number", "adjective_position", "adjective_agreement"],
    questions: [
      { before: "una casa ", after: " (white)", answer: "blanca", concepts: ["adjective_gender", "adjective_agreement"], feedback: "Blanca agrees with feminine singular casa." },
      { before: "dos libros ", after: " (interesting)", answer: "interesantes", concepts: ["adjective_number", "adjective_agreement"], feedback: "Interesante adds -s to agree with plural libros." },
      { before: "las escuelas ", after: " (modern)", answer: "modernas", concepts: ["adjective_gender", "adjective_number"], feedback: "Modernas marks feminine plural to match las escuelas." },
      { before: "un profesor ", after: " (patient)", answer: "paciente", concepts: ["adjective_gender"], feedback: "Paciente has one singular form for masculine and feminine nouns." },
      { before: "unas clases ", after: " (easy)", answer: "fáciles", accepted: ["fáciles", "faciles"], concepts: ["adjective_number", "accent_marks"], feedback: "Fácil adds -es and keeps its written accent in the plural: fáciles." },
      { before: "Mi amiga es ", after: ". (Mexican)", answer: "mexicana", concepts: ["nationality_agreement", "adjective_agreement"], feedback: "Mexicana agrees with the feminine singular subject mi amiga." },
      { before: "Mis amigos son ", after: ". (Colombian)", answer: "colombianos", concepts: ["nationality_agreement", "adjective_number"], feedback: "Colombianos agrees with the masculine or mixed plural subject." },
      { before: "In the neutral description una mesa grande, the adjective normally comes ", after: " the noun.", answer: "after", concepts: ["adjective_position"], feedback: "Descriptive adjectives normally follow the noun in a neutral noun phrase." },
      { before: "El agua está ", after: ". (cold)", answer: "fría", accepted: ["fría", "fria"], concepts: ["adjective_agreement"], feedback: "Fría agrees with the feminine noun agua even though singular agua commonly takes el." },
      { before: "Son estudiantes ", after: ". (responsible)", answer: "responsables", concepts: ["adjective_number", "adjective_agreement"], feedback: "Responsable adds -s for a plural subject and does not change for gender." },
    ],
  },
  {
    module: 3,
    title: "Subject pronouns and ser for identity",
    concepts: ["subject_pronouns", "ser_forms", "profession_article", "nationality_agreement", "relationships", "ser_identity", "ser_classification", "ser_origin"],
    questions: [
      { before: "Yo ", after: " estudiante.", answer: "soy", concepts: ["ser_forms", "ser_identity"], feedback: "Yo selects soy for identity or classification." },
      { before: "Tú ", after: " de México.", answer: "eres", concepts: ["ser_forms", "ser_origin"], feedback: "Tú selects eres; origin is expressed with ser + de." },
      { before: "Ana ", after: " ingeniera.", answer: "es", concepts: ["profession_article", "ser_classification"], feedback: "A neutral profession statement uses es without an article." },
      { before: "Nosotros ", after: " amigos.", answer: "somos", concepts: ["ser_forms", "relationships"], feedback: "Nosotros selects somos to identify the relationship." },
      { before: "Ustedes ", after: " profesores.", answer: "son", concepts: ["ser_forms", "ser_classification"], feedback: "Ustedes selects son throughout Latin American Spanish." },
      { before: "María y Elena = ", after: "", answer: "ellas", concepts: ["subject_pronouns"], feedback: "Ellas refers to a group identified as entirely feminine." },
      { before: "Carlos y yo = ", after: "", answer: "nosotros", concepts: ["subject_pronouns"], feedback: "A group that includes the speaker uses nosotros or nosotras." },
      { before: "Ella es ", after: ". (Peruvian)", answer: "peruana", concepts: ["nationality_agreement"], feedback: "Peruana agrees with the feminine singular subject ella." },
      { before: "¿De dónde ", after: " usted?", answer: "es", concepts: ["ser_forms", "ser_origin"], feedback: "Formal singular usted uses the third-person form es." },
      { before: "Ellos ", after: " mis hermanos.", answer: "son", concepts: ["ser_identity", "relationships"], feedback: "Son identifies the plural relationship: they are my brothers." },
    ],
  },
  {
    module: 4,
    title: "Estar, ser, and hay",
    concepts: ["estar_forms", "estar_state", "estar_location", "ser_vs_estar_selection", "ser_estar_meaning_change", "hay_existence", "hay_vs_estar"],
    questions: [
      { before: "Yo ", after: " cansado hoy.", answer: "estoy", concepts: ["estar_forms", "estar_state"], feedback: "Yo selects estoy for a current state." },
      { before: "Tú ", after: " en la biblioteca.", answer: "estás", accepted: ["estás", "estas"], concepts: ["estar_forms", "estar_location"], feedback: "Tú selects estás to locate an identified person." },
      { before: "Los libros ", after: " en la mesa.", answer: "están", accepted: ["están", "estan"], concepts: ["estar_forms", "estar_location"], feedback: "The identified plural books are located with están." },
      { before: "", after: " una farmacia cerca. (there is)", answer: "Hay", accepted: ["hay"], concepts: ["hay_existence"], feedback: "Hay introduces something that exists in the scene." },
      { before: "Hay una farmacia. La farmacia ", after: " al lado del banco.", answer: "está", accepted: ["está", "esta"], concepts: ["hay_vs_estar", "estar_location"], feedback: "After hay introduces it, estar locates the now-identified pharmacy." },
      { before: "La fiesta ", after: " en mi casa mañana.", answer: "es", concepts: ["ser_vs_estar_selection"], feedback: "The location of a scheduled event is expressed with ser." },
      { before: "Ana ", after: " lista para salir. (ready)", answer: "está", accepted: ["está", "esta"], concepts: ["ser_estar_meaning_change", "estar_state"], feedback: "Estar lista means ready in this context." },
      { before: "Ana ", after: " lista. (clever)", answer: "es", concepts: ["ser_estar_meaning_change", "ser_classification"], feedback: "Ser lista describes cleverness as a characteristic." },
      { before: "Nosotros ", after: " contentos.", answer: "estamos", concepts: ["estar_forms", "estar_state"], feedback: "Nosotros selects estamos for the state contentos." },
      { before: "No ", after: " restaurantes abiertos aquí. (there are no)", answer: "hay", concepts: ["hay_existence"], feedback: "No hay denies the existence or presence of restaurants." },
    ],
  },
];

const checkpointTwoModules: ModuleExam[] = [
  {
    module: 5,
    title: "Questions that request precise information",
    concepts: ["question_structure", "question_words_identity", "question_words_context", "question_reason_quantity"],
    questions: [
      { before: "¿", after: " te llamas? —Me llamo Ana.", answer: "Cómo", accepted: ["cómo", "como"], concepts: ["question_words_identity"], feedback: "Cómo asks for the person’s name in ¿Cómo te llamas?" },
      { before: "¿De ", after: " eres? —Soy de Perú.", answer: "dónde", accepted: ["dónde", "donde"], concepts: ["question_words_context", "ser_origin"], feedback: "De dónde requests origin." },
      { before: "¿", after: " estudias español? —Porque quiero viajar.", answer: "Por qué", accepted: ["por qué", "por que"], concepts: ["question_reason_quantity"], feedback: "Por qué asks for a reason; porque begins the answer." },
      { before: "¿", after: " libros hay? —Hay cinco.", answer: "Cuántos", accepted: ["cuántos", "cuantos"], concepts: ["question_reason_quantity"], feedback: "Cuántos agrees with libros and asks for a quantity." },
      { before: "¿A ", after: " hora empieza la clase?", answer: "qué", accepted: ["qué", "que"], concepts: ["question_words_context", "clock_time"], feedback: "A qué hora asks for an exact time." },
      { before: "¿", after: " es tu profesora? —La señora Ruiz.", answer: "Quién", accepted: ["quién", "quien"], concepts: ["question_words_identity"], feedback: "Quién asks for the identity of one person." },
      { before: "¿Con ", after: " practicas? —Con Elena.", answer: "quién", accepted: ["quién", "quien"], concepts: ["question_words_context"], feedback: "The preposition con remains before quién." },
      { before: "¿", after: " prefieres, té o café?", answer: "Cuál", accepted: ["cuál", "cual"], concepts: ["question_words_identity"], feedback: "Cuál asks the listener to select from known alternatives." },
      { before: "¿", after: " estudias? —En la biblioteca.", answer: "Dónde", accepted: ["dónde", "donde"], concepts: ["question_words_context"], feedback: "Dónde requests a location." },
      { before: "¿", after: " es el examen? —El lunes.", answer: "Cuándo", accepted: ["cuándo", "cuando"], concepts: ["question_words_context"], feedback: "Cuándo requests a day or time." },
    ],
  },
  {
    module: 6,
    title: "Numbers, dates, clock time, and routines",
    concepts: ["numbers_basic", "numbers_large", "dates_calendar", "clock_time", "time_expressions"],
    questions: [
      { before: "Tengo ", after: " años. (22)", answer: "veintidós", accepted: ["veintidós", "veintidos"], concepts: ["numbers_basic"], feedback: "Twenty-two is written as the single word veintidós." },
      { before: "Hay ", after: " personas. (47)", answer: "cuarenta y siete", concepts: ["numbers_large"], feedback: "Above thirty, tens and units connect with the separate word y." },
      { before: "", after: " estudiantes (100)", answer: "cien", concepts: ["numbers_large"], feedback: "Exact one hundred uses cien." },
      { before: "", after: " libros (105)", answer: "ciento cinco", concepts: ["numbers_large"], feedback: "A number that continues after one hundred begins with ciento." },
      { before: "La presentación es el doce ", after: " septiembre.", answer: "de", concepts: ["dates_calendar"], feedback: "De connects the day number and the month." },
      { before: "Hoy ", after: " martes.", answer: "es", concepts: ["dates_calendar"], feedback: "Hoy es identifies the current day." },
      { before: "", after: " la una.", answer: "Es", accepted: ["es"], concepts: ["clock_time"], feedback: "One o’clock uses the singular frame es la una." },
      { before: "", after: " las cuatro y media.", answer: "Son", accepted: ["son"], concepts: ["clock_time"], feedback: "Hours after one use the plural frame son las." },
      { before: "La reunión empieza ", after: " las seis.", answer: "a", concepts: ["clock_time"], feedback: "A las places an event at an exact hour." },
      { before: "Estudio ", after: " la mañana.", answer: "por", concepts: ["time_expressions"], feedback: "Por la mañana names a broad part of the day." },
    ],
  },
  {
    module: 7,
    title: "Regular verbs in the present",
    concepts: ["infinitive_structure", "present_ar", "present_er", "present_ir", "present_negation", "present_sentence"],
    questions: [
      { before: "Yo ", after: " español. (hablar)", answer: "hablo", concepts: ["present_ar"], feedback: "The yo form of a regular -ar verb ends in -o." },
      { before: "Tú ", after: " en casa. (trabajar)", answer: "trabajas", concepts: ["present_ar"], feedback: "The tú form of a regular -ar verb ends in -as." },
      { before: "Nosotros ", after: " cada día. (estudiar)", answer: "estudiamos", concepts: ["present_ar"], feedback: "The nosotros form of a regular -ar verb ends in -amos." },
      { before: "Ella ", after: " café. (comer)", answer: "come", concepts: ["present_er"], feedback: "The third-person singular form of regular -er verbs ends in -e." },
      { before: "Ustedes ", after: " mucho. (aprender)", answer: "aprenden", concepts: ["present_er"], feedback: "Ustedes selects the -en ending for regular -er verbs." },
      { before: "Yo ", after: " en Lima. (vivir)", answer: "vivo", concepts: ["present_ir"], feedback: "The yo form of a regular -ir verb ends in -o." },
      { before: "Nosotros ", after: " la puerta. (abrir)", answer: "abrimos", concepts: ["present_ir"], feedback: "The nosotros form of a regular -ir verb ends in -imos." },
      { before: "Ellos ", after: " mensajes. (escribir)", answer: "escriben", concepts: ["present_ir"], feedback: "Ellos selects the -en ending for regular -ir verbs." },
      { before: "Yo ", after: " trabajo los domingos. (do not)", answer: "no", concepts: ["present_negation"], feedback: "No normally goes directly before the conjugated verb." },
      { before: "In quiero estudiar, only ", after: " is conjugated.", answer: "quiero", concepts: ["infinitive_structure"], feedback: "The first verb carries the subject; estudiar remains an infinitive." },
    ],
  },
  {
    module: 8,
    title: "Stem-changing and essential irregular verbs",
    concepts: ["stem_change", "querer_poder", "tener_expressions", "hacer_poner", "venir_salir_oir", "saber_conocer", "ir_forms"],
    questions: [
      { before: "Yo ", after: " aprender español. (querer)", answer: "quiero", concepts: ["querer_poder", "stem_change"], feedback: "Querer changes e→ie in the yo form: quiero." },
      { before: "Tú ", after: " venir mañana. (poder)", answer: "puedes", concepts: ["querer_poder", "stem_change"], feedback: "Poder changes o→ue in the tú form: puedes." },
      { before: "Nosotros ", after: " ayuda. (preferir)", answer: "preferimos", concepts: ["stem_change"], feedback: "Present-tense nosotros normally keeps the infinitive stem: preferimos." },
      { before: "Yo ", after: " hambre. (tener)", answer: "tengo", concepts: ["tener_expressions"], feedback: "Tengo carries the common expression tener hambre." },
      { before: "Yo ", after: " la tarea. (hacer)", answer: "hago", concepts: ["hacer_poner"], feedback: "The irregular yo form of hacer is hago." },
      { before: "Yo ", after: " el libro aquí. (poner)", answer: "pongo", concepts: ["hacer_poner"], feedback: "The irregular yo form of poner is pongo." },
      { before: "Yo ", after: " de México. (venir)", answer: "vengo", concepts: ["venir_salir_oir"], feedback: "The irregular yo form of venir is vengo." },
      { before: "Yo ", after: " música. (oír)", answer: "oigo", concepts: ["venir_salir_oir"], feedback: "The irregular yo form of oír is oigo." },
      { before: "Yo ", after: " a Ana. (know a person)", answer: "conozco", concepts: ["saber_conocer"], feedback: "Conocer expresses familiarity with a person." },
      { before: "Nosotros ", after: " a la biblioteca. (ir)", answer: "vamos", concepts: ["ir_forms"], feedback: "The nosotros form of ir is vamos." },
    ],
  },
  {
    module: 9,
    title: "Plans, obligations, purpose, and time with hace",
    concepts: ["near_future", "tener_que", "verb_patterns", "para_infinitive", "hace_time"],
    questions: [
      { before: "Yo ", after: " a estudiar esta noche. (ir)", answer: "voy", concepts: ["near_future", "ir_forms"], feedback: "Voy a + infinitive expresses the speaker’s near-future plan." },
      { before: "Nosotros ", after: " a viajar mañana. (ir)", answer: "vamos", concepts: ["near_future"], feedback: "Vamos a + infinitive expresses our plan." },
      { before: "Ana ", after: " que trabajar hoy. (tener)", answer: "tiene", concepts: ["tener_que"], feedback: "Tener que agrees with Ana; the required action remains an infinitive." },
      { before: "Ustedes ", after: " que llegar temprano. (tener)", answer: "tienen", concepts: ["tener_que"], feedback: "Ustedes selects tienen in tener que." },
      { before: "Quiero ", after: " español. (to speak)", answer: "hablar", concepts: ["verb_patterns", "infinitive_structure"], feedback: "After querer, the second action remains in the infinitive." },
      { before: "Estudio ", after: " trabajar con la comunidad.", answer: "para", concepts: ["para_infinitive"], feedback: "Para + infinitive expresses the purpose of studying." },
      { before: "Viajamos para ", after: " a la familia. (to see)", answer: "ver", concepts: ["para_infinitive"], feedback: "The action after para remains an infinitive." },
      { before: "Estudio español desde ", after: " dos años.", answer: "hace", concepts: ["hace_time"], feedback: "Desde hace states how long an ongoing situation has lasted." },
      { before: "Llegué ", after: " tres días. (three days ago)", answer: "hace", concepts: ["hace_time"], feedback: "Hace + time after a completed event means ago." },
      { before: "Después de ", after: ", voy a descansar. (to work)", answer: "trabajar", concepts: ["verb_patterns", "near_future"], feedback: "After a preposition such as de, the verb remains an infinitive." },
    ],
  },
];

const checkpointThreeModules: ModuleExam[] = [
  {
    module: 10,
    title: "Direct objects, personal a, and object pronouns",
    concepts: ["direct_objects", "personal_a", "direct_object_pronouns", "object_pronoun_position"],
    questions: [
      { before: "Veo ", after: " Ana todos los días.", answer: "a", concepts: ["personal_a"], feedback: "A specific person used as a direct object normally takes personal a." },
      { before: "Busco ", after: " mi profesor.", answer: "a", concepts: ["personal_a"], feedback: "The specific human direct object mi profesor takes personal a." },
      { before: "Compro el libro. → ", after: " compro.", answer: "Lo", accepted: ["lo"], concepts: ["direct_object_pronouns"], feedback: "Lo replaces the masculine singular direct object el libro." },
      { before: "Leo la carta. → ", after: " leo.", answer: "La", accepted: ["la"], concepts: ["direct_object_pronouns"], feedback: "La replaces the feminine singular direct object la carta." },
      { before: "Necesito los documentos. → ", after: " necesito.", answer: "Los", accepted: ["los"], concepts: ["direct_object_pronouns"], feedback: "Los replaces a masculine plural direct object." },
      { before: "Vemos las películas. → ", after: " vemos.", answer: "Las", accepted: ["las"], concepts: ["direct_object_pronouns"], feedback: "Las replaces a feminine plural direct object." },
      { before: "Ana me llama. The direct object pronoun is ", after: ".", answer: "me", concepts: ["direct_objects"], feedback: "Me receives the action of llama directly." },
      { before: "Voy a comprar el libro. → Voy a ", after: ".", answer: "comprarlo", concepts: ["object_pronoun_position"], feedback: "An object pronoun may attach to the infinitive: comprarlo." },
      { before: "Estoy leyendo la carta. → Estoy ", after: ".", answer: "leyéndola", accepted: ["leyéndola", "leyendola"], concepts: ["object_pronoun_position"], feedback: "The pronoun may attach to the gerund; the written accent preserves stress." },
      { before: "No ", after: " conozco. (I do not know him)", answer: "lo", concepts: ["object_pronoun_position", "present_negation"], feedback: "The object pronoun stays immediately before the conjugated verb, after no." },
    ],
  },
  {
    module: 11,
    title: "Indirect objects and gustar-style structures",
    concepts: ["indirect_objects", "indirect_object_pronouns", "gustar_structure", "gusta_gustan", "gustar_verbs", "combined_pronouns"],
    questions: [
      { before: "Doy el libro a Ana. → ", after: " doy el libro.", answer: "Le", accepted: ["le"], concepts: ["indirect_object_pronouns"], feedback: "Le marks Ana as the recipient." },
      { before: "Escribimos a nuestros amigos. → ", after: " escribimos.", answer: "Les", accepted: ["les"], concepts: ["indirect_object_pronouns"], feedback: "Les marks the plural recipients nuestros amigos." },
      { before: "A mí ", after: " gusta el café.", answer: "me", concepts: ["gustar_structure"], feedback: "Me marks the speaker as the experiencer." },
      { before: "A Ana ", after: " gustan los libros.", answer: "le", concepts: ["gustar_structure", "gusta_gustan"], feedback: "Le marks Ana; gustan agrees with the plural thing liked." },
      { before: "A nosotros nos ", after: " viajar.", answer: "gusta", concepts: ["gusta_gustan"], feedback: "An infinitive counts as a singular idea, so use gusta." },
      { before: "A ellos les ", after: " las clases.", answer: "interesan", concepts: ["gustar_verbs", "gusta_gustan"], feedback: "Interesan agrees with the plural subject las clases." },
      { before: "A usted ", after: " falta tiempo.", answer: "le", concepts: ["indirect_object_pronouns", "gustar_verbs"], feedback: "Formal usted takes the indirect object pronoun le." },
      { before: "Doy el libro a Ana. → ", after: " lo doy.", answer: "Se", accepted: ["se"], concepts: ["combined_pronouns"], feedback: "Le changes to se before the direct object pronoun lo." },
      { before: "Mandamos las cartas a ellos. → Se ", after: " mandamos.", answer: "las", concepts: ["combined_pronouns"], feedback: "Las replaces the feminine plural direct object cartas." },
      { before: "¿A ti ", after: " gusta bailar?", answer: "te", concepts: ["gustar_structure"], feedback: "Te marks tú as the experiencer in a gustar construction." },
    ],
  },
  {
    module: 12,
    title: "Reflexive, reciprocal, and daily-routine meaning",
    concepts: ["reflexive_pronouns", "daily_routine", "reflexive_position", "reflexive_change", "reciprocal_reflexive"],
    questions: [
      { before: "Yo ", after: " levanto a las siete.", answer: "me", concepts: ["reflexive_pronouns", "daily_routine"], feedback: "Yo takes the reflexive pronoun me." },
      { before: "Tú ", after: " duchas por la mañana.", answer: "te", concepts: ["reflexive_pronouns", "daily_routine"], feedback: "Tú takes the reflexive pronoun te." },
      { before: "Ana ", after: " acuesta tarde.", answer: "se", concepts: ["reflexive_pronouns", "daily_routine"], feedback: "Third-person singular Ana takes se." },
      { before: "Nosotros ", after: " preparamos para salir.", answer: "nos", concepts: ["reflexive_pronouns"], feedback: "Nosotros takes the reflexive pronoun nos." },
      { before: "Ustedes ", after: " despiertan temprano.", answer: "se", concepts: ["reflexive_pronouns", "stem_change"], feedback: "Ustedes takes se; despiertan carries the stem change." },
      { before: "Voy a levantar", after: " temprano. (myself)", answer: "me", concepts: ["reflexive_position"], feedback: "The reflexive pronoun may attach to the infinitive: levantarme." },
      { before: "Me voy a ", after: " temprano. (get up)", answer: "levantar", concepts: ["reflexive_position"], feedback: "The pronoun may instead precede the conjugated verb unit." },
      { before: "Ana lava el carro: the action is ", after: ", not reflexive.", answer: "nonreflexive", accepted: ["nonreflexive", "not reflexive"], concepts: ["reflexive_change"], feedback: "The car, not Ana, receives the washing." },
      { before: "Ana se lava: the action is ", after: ".", answer: "reflexive", concepts: ["reflexive_change"], feedback: "The subject Ana also receives the action." },
      { before: "Elena y Marta ", after: " ayudan. (each other)", answer: "se", concepts: ["reciprocal_reflexive"], feedback: "With a plural subject, se can express reciprocal action: each other." },
    ],
  },
  {
    module: 13,
    title: "Negatives, prepositions, sequence, and connectors",
    concepts: ["negative_words", "double_negation", "core_prepositions", "sequence_prepositions", "clause_connectors"],
    questions: [
      { before: "No veo a ", after: ". (anyone)", answer: "nadie", concepts: ["negative_words", "double_negation"], feedback: "After the verb, nadie normally appears with pre-verbal no." },
      { before: "", after: " viene hoy. (Nobody)", answer: "Nadie", accepted: ["nadie"], concepts: ["negative_words"], feedback: "A negative word before the verb does not need an additional no." },
      { before: "No tengo ", after: " libro. (not any)", answer: "ningún", accepted: ["ningún", "ningun"], concepts: ["negative_words", "double_negation"], feedback: "Ningún precedes a masculine singular noun after no." },
      { before: "No estudio francés ", after: " alemán. (nor)", answer: "ni", concepts: ["negative_words"], feedback: "Ni adds another negative alternative." },
      { before: "El libro está ", after: " la mesa. (on)", answer: "sobre", concepts: ["core_prepositions"], feedback: "Sobre expresses position on top of a surface." },
      { before: "Voy ", after: " México. (toward/to)", answer: "a", concepts: ["core_prepositions"], feedback: "Movement toward a destination uses a." },
      { before: "Este regalo es ", after: " ti. (for)", answer: "para", concepts: ["core_prepositions"], feedback: "Para identifies the intended recipient." },
      { before: "", after: " de estudiar, descanso. (After)", answer: "Después", accepted: ["después", "despues"], concepts: ["sequence_prepositions"], feedback: "Después de + infinitive orders the second action after the first." },
      { before: "Estudio español ", after: " quiero viajar. (because)", answer: "porque", concepts: ["clause_connectors"], feedback: "Porque introduces the reason." },
      { before: "Estoy cansado; ", after: ", voy a terminar. (nevertheless)", answer: "sin embargo", concepts: ["clause_connectors"], feedback: "Sin embargo marks contrast between the state and the decision." },
    ],
  },
  {
    module: 14,
    title: "Present subjunctive in purpose, influence, and reaction",
    concepts: ["subjunctive_purpose", "subjunctive_forms", "subjunctive_influence", "subjunctive_reactions", "subjunctive_connectors"],
    questions: [
      { before: "Quiero que tú ", after: " temprano. (arrive)", answer: "llegues", concepts: ["subjunctive_influence", "subjunctive_forms"], feedback: "A changed-subject desire uses the present subjunctive llegues." },
      { before: "La profesora pide que nosotros ", after: ". (study)", answer: "estudiemos", concepts: ["subjunctive_influence", "subjunctive_forms"], feedback: "Pedir que influences another subject, so estudiar becomes estudiemos." },
      { before: "Me alegra que Ana ", after: " aquí. (be)", answer: "esté", accepted: ["esté", "este"], concepts: ["subjunctive_reactions", "subjunctive_forms"], feedback: "An emotional reaction frames the second clause with subjunctive esté." },
      { before: "Dudo que ellos ", after: " tiempo. (have)", answer: "tengan", concepts: ["subjunctive_reactions", "subjunctive_forms"], feedback: "Doubt triggers the subjunctive tengan in the dependent clause." },
      { before: "No creo que Marta ", after: ". (come)", answer: "venga", concepts: ["subjunctive_reactions", "subjunctive_forms"], feedback: "Denied belief frames the proposition with subjunctive venga." },
      { before: "Hablo despacio para que ustedes ", after: ". (understand)", answer: "entiendan", concepts: ["subjunctive_purpose", "subjunctive_forms"], feedback: "Para que with a second subject takes subjunctive entiendan." },
      { before: "Voy a salir antes de que ", after: ". (rain)", answer: "llueva", concepts: ["subjunctive_connectors"], feedback: "Antes de que introduces a pending event with subjunctive llueva." },
      { before: "Te llamo cuando ", after: " a casa. (I arrive, future)", answer: "llegue", concepts: ["subjunctive_connectors"], feedback: "Cuando referring to a future pending arrival takes subjunctive llegue." },
      { before: "Es importante que ustedes ", after: " la verdad. (know)", answer: "sepan", concepts: ["subjunctive_influence", "subjunctive_forms"], feedback: "An impersonal evaluation plus que takes the subjunctive sepan." },
      { before: "Busco un libro que ", after: " ejercicios claros. (have; not identified)", answer: "tenga", concepts: ["subjunctive_reactions", "subjunctive_forms"], feedback: "An indefinite, not-yet-identified book is described with subjunctive tenga." },
    ],
  },
];

export const checkpointOneBlocks = checkpointOneModules.map((exam) => moduleBlock(1, exam));
export const checkpointTwoBlocks = checkpointTwoModules.map((exam) => moduleBlock(2, exam));
export const checkpointThreeBlocks = checkpointThreeModules.map((exam) => moduleBlock(3, exam));

type StoryBlankInput = Omit<Extract<StoryFillBlock["verses"][number]["parts"][number], { type: "blank" }>, "type" | "accepted" | "feedback" | "conceptIds"> & {
  accepted?: string[];
  tense: "preterite" | "imperfect";
};

const text = (value: string) => ({ type: "text" as const, text: value });
const blank = ({ id, answer, infinitive, accepted, tense }: StoryBlankInput) => ({
  type: "blank" as const,
  id,
  answer,
  accepted: accepted ?? [answer, answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "")],
  infinitive,
  conceptIds: tense === "preterite" ? ["preterite_function", "preterite_narration"] as ConceptId[] : ["imperfect_function", "imperfect_description"] as ConceptId[],
  feedback: tense === "preterite" ? "The preterite advances a completed event in the story." : "The imperfect establishes a state, description, or action already in progress.",
});

export const checkpointFourStory: StoryFillBlock = {
  id: "cp4-creation-story",
  type: "story-fill",
  conceptIds: ["preterite_function", "preterite_ar", "preterite_er_ir", "preterite_irregular", "imperfect_function", "imperfect_forms", "preterite_imperfect", "past_narration"],
  eyebrow: "Final checkpoint · 2 points per blank",
  heading: "Complete the past-tense story.",
  prompt: "Fill every past-tense verb. The infinitive beside each blank tells you the verb; the narrative tells you whether the form is preterite or imperfect. Your raw points are normalized to a percentage out of 100.",
  sourceNote: "Original instructional adaptation of Genesis 1:1–27, based on the public-domain Reina-Valera 1909 text.",
  sourceHref: "https://ebible.org/spaRV1909/GEN01.htm",
  verses: [
    { number: 1, parts: [text("Al comienzo, Dios "), blank({ id: "cp4-q1", answer: "creó", infinitive: "crear", tense: "preterite" }), text(" el cielo y la tierra.")] },
    { number: 2, parts: [text("La tierra "), blank({ id: "cp4-q2", answer: "estaba", infinitive: "estar", tense: "imperfect" }), text(" desordenada y vacía. La oscuridad "), blank({ id: "cp4-q3", answer: "cubría", infinitive: "cubrir", tense: "imperfect" }), text(" las aguas profundas, mientras el Espíritu de Dios se "), blank({ id: "cp4-q4", answer: "movía", infinitive: "moverse", tense: "imperfect" }), text(" sobre ellas.")] },
    { number: 3, parts: [text("Entonces Dios "), blank({ id: "cp4-q5", answer: "dijo", infinitive: "decir", tense: "preterite" }), text(": «Que exista la luz», y la luz "), blank({ id: "cp4-q6", answer: "apareció", infinitive: "aparecer", tense: "preterite" }), text(".")] },
    { number: 4, parts: [text("Dios "), blank({ id: "cp4-q7", answer: "vio", infinitive: "ver", tense: "preterite" }), text(" que la luz "), blank({ id: "cp4-q8", answer: "era", infinitive: "ser", tense: "imperfect" }), text(" buena y la "), blank({ id: "cp4-q9", answer: "separó", infinitive: "separar", tense: "preterite" }), text(" de la oscuridad.")] },
    { number: 5, parts: [text("A la luz la "), blank({ id: "cp4-q10", answer: "llamó", infinitive: "llamar", tense: "preterite" }), text(" día, y a la oscuridad la "), blank({ id: "cp4-q11", answer: "llamó", infinitive: "llamar", tense: "preterite" }), text(" noche. "), blank({ id: "cp4-q12", answer: "Cayó", infinitive: "caer", tense: "preterite" }), text(" la tarde y "), blank({ id: "cp4-q13", answer: "llegó", infinitive: "llegar", tense: "preterite" }), text(" la mañana: ese "), blank({ id: "cp4-q14", answer: "fue", infinitive: "ser", tense: "preterite" }), text(" el primer día.")] },
    { number: 6, parts: [text("Dios "), blank({ id: "cp4-q15", answer: "dijo", infinitive: "decir", tense: "preterite" }), text(": «Que haya un espacio entre las aguas para separarlas».")] },
    { number: 7, parts: [text("Así "), blank({ id: "cp4-q16", answer: "sucedió", infinitive: "suceder", tense: "preterite" }), text(". Dios "), blank({ id: "cp4-q17", answer: "hizo", infinitive: "hacer", tense: "preterite" }), text(" el espacio y "), blank({ id: "cp4-q18", answer: "separó", infinitive: "separar", tense: "preterite" }), text(" las aguas de abajo de las aguas de arriba.")] },
    { number: 8, parts: [text("Dios "), blank({ id: "cp4-q19", answer: "llamó", infinitive: "llamar", tense: "preterite" }), text(" cielo a ese espacio. "), blank({ id: "cp4-q20", answer: "Cayó", infinitive: "caer", tense: "preterite" }), text(" la tarde y "), blank({ id: "cp4-q21", answer: "llegó", infinitive: "llegar", tense: "preterite" }), text(" la mañana: ese "), blank({ id: "cp4-q22", answer: "fue", infinitive: "ser", tense: "preterite" }), text(" el segundo día.")] },
    { number: 9, parts: [text("Dios "), blank({ id: "cp4-q23", answer: "dijo", infinitive: "decir", tense: "preterite" }), text(": «Que las aguas bajo el cielo se junten en un lugar y que aparezca la tierra seca». Así "), blank({ id: "cp4-q24", answer: "sucedió", infinitive: "suceder", tense: "preterite" }), text(".")] },
    { number: 10, parts: [text("Dios "), blank({ id: "cp4-q25", answer: "llamó", infinitive: "llamar", tense: "preterite" }), text(" tierra a la parte seca y mares al conjunto de las aguas. Dios "), blank({ id: "cp4-q26", answer: "vio", infinitive: "ver", tense: "preterite" }), text(" que aquello "), blank({ id: "cp4-q27", answer: "era", infinitive: "ser", tense: "imperfect" }), text(" bueno.")] },
    { number: 11, parts: [text("Luego Dios "), blank({ id: "cp4-q28", answer: "dijo", infinitive: "decir", tense: "preterite" }), text(": «Que la tierra produzca plantas, hierbas con semilla y árboles con fruto, cada uno según su especie». Así "), blank({ id: "cp4-q29", answer: "sucedió", infinitive: "suceder", tense: "preterite" }), text(".")] },
    { number: 12, parts: [text("La tierra "), blank({ id: "cp4-q30", answer: "produjo", infinitive: "producir", tense: "preterite" }), text(" plantas, hierbas con semilla y árboles con fruto, cada uno según su especie. Dios "), blank({ id: "cp4-q31", answer: "vio", infinitive: "ver", tense: "preterite" }), text(" que aquello "), blank({ id: "cp4-q32", answer: "era", infinitive: "ser", tense: "imperfect" }), text(" bueno.")] },
    { number: 13, parts: [text("La tarde "), blank({ id: "cp4-q33", answer: "cayó", infinitive: "caer", tense: "preterite" }), text(" y la mañana "), blank({ id: "cp4-q34", answer: "llegó", infinitive: "llegar", tense: "preterite" }), text(": ese "), blank({ id: "cp4-q35", answer: "fue", infinitive: "ser", tense: "preterite" }), text(" el tercer día.")] },
    { number: 14, parts: [text("Dios "), blank({ id: "cp4-q36", answer: "dijo", infinitive: "decir", tense: "preterite" }), text(": «Que haya luces en el cielo para separar el día de la noche y para señalar estaciones, días y años.")] },
    { number: 15, parts: [text("Que brillen desde el cielo y alumbren la tierra». Así "), blank({ id: "cp4-q37", answer: "sucedió", infinitive: "suceder", tense: "preterite" }), text(".")] },
    { number: 16, parts: [text("Dios "), blank({ id: "cp4-q38", answer: "hizo", infinitive: "hacer", tense: "preterite" }), text(" las dos grandes luces: la mayor para gobernar el día y la menor para gobernar la noche. También "), blank({ id: "cp4-q39", answer: "hizo", infinitive: "hacer", tense: "preterite" }), text(" las estrellas.")] },
    { number: 17, parts: [text("Dios las "), blank({ id: "cp4-q40", answer: "colocó", infinitive: "colocar", tense: "preterite" }), text(" en el cielo para alumbrar la tierra,")] },
    { number: 18, parts: [text("gobernar el día y la noche y separar la luz de la oscuridad. Dios "), blank({ id: "cp4-q41", answer: "vio", infinitive: "ver", tense: "preterite" }), text(" que aquello "), blank({ id: "cp4-q42", answer: "era", infinitive: "ser", tense: "imperfect" }), text(" bueno.")] },
    { number: 19, parts: [text("La tarde "), blank({ id: "cp4-q43", answer: "cayó", infinitive: "caer", tense: "preterite" }), text(" y la mañana "), blank({ id: "cp4-q44", answer: "llegó", infinitive: "llegar", tense: "preterite" }), text(": ese "), blank({ id: "cp4-q45", answer: "fue", infinitive: "ser", tense: "preterite" }), text(" el cuarto día.")] },
    { number: 20, parts: [text("Dios "), blank({ id: "cp4-q46", answer: "dijo", infinitive: "decir", tense: "preterite" }), text(": «Que las aguas se llenen de seres vivos y que las aves vuelen sobre la tierra y bajo el cielo».")] },
    { number: 21, parts: [text("Dios "), blank({ id: "cp4-q47", answer: "creó", infinitive: "crear", tense: "preterite" }), text(" los grandes animales del mar, todos los seres que se mueven en el agua y todas las aves, cada uno según su especie. Dios "), blank({ id: "cp4-q48", answer: "vio", infinitive: "ver", tense: "preterite" }), text(" que aquello "), blank({ id: "cp4-q49", answer: "era", infinitive: "ser", tense: "imperfect" }), text(" bueno.")] },
    { number: 22, parts: [text("Entonces los "), blank({ id: "cp4-q50", answer: "bendijo", infinitive: "bendecir", tense: "preterite" }), text(" y les "), blank({ id: "cp4-q51", answer: "dijo", infinitive: "decir", tense: "preterite" }), text(": «Sean fecundos, multiplíquense y llenen los mares; que también se multipliquen las aves sobre la tierra».")] },
    { number: 23, parts: [text("La tarde "), blank({ id: "cp4-q52", answer: "cayó", infinitive: "caer", tense: "preterite" }), text(" y la mañana "), blank({ id: "cp4-q53", answer: "llegó", infinitive: "llegar", tense: "preterite" }), text(": ese "), blank({ id: "cp4-q54", answer: "fue", infinitive: "ser", tense: "preterite" }), text(" el quinto día.")] },
    { number: 24, parts: [text("Dios "), blank({ id: "cp4-q55", answer: "dijo", infinitive: "decir", tense: "preterite" }), text(": «Que la tierra produzca seres vivos según su especie: animales domésticos, animales salvajes y seres que se arrastran». Así "), blank({ id: "cp4-q56", answer: "sucedió", infinitive: "suceder", tense: "preterite" }), text(".")] },
    { number: 25, parts: [text("Dios "), blank({ id: "cp4-q57", answer: "hizo", infinitive: "hacer", tense: "preterite" }), text(" los animales salvajes, los domésticos y los que se arrastran por el suelo, cada uno según su especie. Dios "), blank({ id: "cp4-q58", answer: "vio", infinitive: "ver", tense: "preterite" }), text(" que aquello "), blank({ id: "cp4-q59", answer: "era", infinitive: "ser", tense: "imperfect" }), text(" bueno.")] },
    { number: 26, parts: [text("Después Dios "), blank({ id: "cp4-q60", answer: "dijo", infinitive: "decir", tense: "preterite" }), text(": «Hagamos al ser humano a nuestra imagen y semejanza. Que gobierne sobre los peces, las aves, los animales domésticos, los salvajes y todos los que se arrastran por el suelo».")] },
    { number: 27, parts: [text("Dios "), blank({ id: "cp4-q61", answer: "creó", infinitive: "crear", tense: "preterite" }), text(" al ser humano a su imagen; a imagen de Dios lo "), blank({ id: "cp4-q62", answer: "creó", infinitive: "crear", tense: "preterite" }), text("; hombre y mujer los "), blank({ id: "cp4-q63", answer: "creó", infinitive: "crear", tense: "preterite" }), text(".")] },
  ],
};
