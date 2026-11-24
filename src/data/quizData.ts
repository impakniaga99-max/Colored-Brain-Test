export type BrainColor = 'G' | 'R' | 'P' | 'B';
export type QuizSection = '1a' | '1b';
export type LanguageMode = 'both' | 'ms' | 'en';

export interface QuizOption {
  color: BrainColor;
  ms: string;
  en: string;
}

export interface QuizQuestion {
  id: number;
  section: QuizSection;
  ms: string;
  en: string;
  options: QuizOption[];
}

export interface ColorProfile {
  key: BrainColor;
  title: string;
  shortName: string;
  englishName: string;
  processingStyle: string;
  hex: string;
  lightBg: string;
  borderHex: string;
  textClass: string;
  bgClass: string;
  softBgClass: string;
  borderClass: string;
  traits: string[];
  description: string;
  workplaceTip: string;
}

export const QUIZ_DATA: QuizQuestion[] = [
  // Bahagian 1A (1-10)
  {
    id: 1,
    section: '1a',
    ms: 'Saya rasa lebih selesa mengendali projek baru apabila saya...',
    en: 'I feel more at ease in a new project when I am...',
    options: [
      {
        color: 'G',
        ms: 'Cetusan idea yang baik untuk mendapatkan gambaran menyeluruh yang baik.',
        en: 'Coming up with good ideas to get a good overview.',
      },
      {
        color: 'P',
        ms: 'Mengumpul data di sekeliling usaha yang dibuat.',
        en: 'Gathering all the facts surrounding the effort.',
      },
      {
        color: 'R',
        ms: 'Mewujudkan rancangan untuk pelaksanaan kejayaan projek tersebut.',
        en: 'Creating a plan for its successful implementation.',
      },
      {
        color: 'B',
        ms: 'Mengenali mereka yang terlibat langsung dengan projek ini.',
        en: 'Getting to know the other people involved on the project with me.',
      },
    ],
  },
  {
    id: 2,
    section: '1a',
    ms: 'Saya menghadapi kekhuatiran bekerja dengan orang lain apabila saya...',
    en: 'I have the most anxiety working with others when I am...',
    options: [
      {
        color: 'G',
        ms: 'Tidak dapat mengatasi perbezaan dan bergerak ke hadapan.',
        en: 'Unable to get past differences and move forward.',
      },
      {
        color: 'P',
        ms: 'Diminta untuk membuat keputusan tanpa menganalisa fakta terlebih dahulu.',
        en: 'Asked to make decisions without reviewing the facts.',
      },
      {
        color: 'R',
        ms: 'Diminta untuk membuat keputusan tanpa maklumat secukupnya.',
        en: 'Asked to make decisions without enough information.',
      },
      {
        color: 'B',
        ms: 'Tidak dapat menzahirkan perasaan sebenar yang saya rasa.',
        en: 'Unable to express the way I truly feel.',
      },
    ],
  },
  {
    id: 3,
    section: '1a',
    ms: 'Saya percaya bahawa keberkesanan berpasukan dapat diperolehi apabila...',
    en: 'I believe team effectiveness will be enhanced when...',
    options: [
      {
        color: 'G',
        ms: 'Ahli pasukan mencuba cara baru untuk menghasilkan perkara baru.',
        en: 'People try new ways to do new things.',
      },
      {
        color: 'R',
        ms: 'Setiap ahli mempunyai nilai yang kuat untuk mereka ikuti.',
        en: 'Members have strong values to guide them.',
      },
      {
        color: 'P',
        ms: 'Setiap ahli mematuhi peranan masing-masing.',
        en: 'People adhere to their roles.',
      },
      {
        color: 'B',
        ms: 'Komunikasi peribadi antara setiap ahli dizahirkan.',
        en: 'Personal communication with others is established.',
      },
    ],
  },
  {
    id: 4,
    section: '1a',
    ms: 'Kekuatan utama saya ialah...',
    en: 'My greatest strengths are...',
    options: [
      {
        color: 'G',
        ms: 'Kebolehan untuk menyahut cabaran baru dan menghasilkan penyelesaian yang kreatif.',
        en: 'The ability to take on new challenges and come out with creative solutions.',
      },
      {
        color: 'R',
        ms: 'Memastikan objektif tercapai di dalam setiap situasi yang memerlukan fakta dan analisa yang sesuai.',
        en: 'To be completely objective in a solution with the right facts and proper analysis.',
      },
      {
        color: 'P',
        ms: 'Kebolehan untuk menyerap perincian untuk membina rancangan yang praktikal.',
        en: 'The ability to absorb details to formulate a practical plan.',
      },
      {
        color: 'B',
        ms: 'Mempunyai firasat untuk mengesan perasaan orang lain.',
        en: 'To intuitively pick up on the feelings of others.',
      },
    ],
  },
  {
    id: 5,
    section: '1a',
    ms: 'Saya bekerja dengan lebih baik dalam kumpulan apabila...',
    en: 'I work better in a team if I am...',
    options: [
      {
        color: 'G',
        ms: 'Bertukar pendapat secara aktif dengan orang lain.',
        en: 'Actively involved with others in exchanging ideas.',
      },
      {
        color: 'R',
        ms: 'Bekerja dalam suasana teratur dengan garis panduan yang jelas.',
        en: 'Working in a structured environment with clear guidelines.',
      },
      {
        color: 'P',
        ms: 'Bekerja ke arah menghasilkan matlamat yang tepat.',
        en: 'Working towards a precise practical outcome.',
      },
      {
        color: 'B',
        ms: 'Berhubung dengan ahli lain pada peringkat peribadi.',
        en: 'Connecting with others at a personal level.',
      },
    ],
  },
  {
    id: 6,
    section: '1a',
    ms: 'Saya mendapat kefahaman lebih apabila...',
    en: 'I learn the most when...',
    options: [
      {
        color: 'G',
        ms: 'Diberi kebebasan untuk meneroka secara kreatif dan tidak tertakluk kepada peraturan tetap.',
        en: 'Have freedom to explore creatively and not confined to fixed rules.',
      },
      {
        color: 'R',
        ms: 'Mengkaji dan mencipta struktur yang menyokong perspektif jangka panjang.',
        en: 'Study and create structures that support long term perspectives.',
      },
      {
        color: 'P',
        ms: 'Mengumpul maklumat sebanyak mungkin untuk pelaksanaan tindakan yang terancang.',
        en: 'Gather as much information as possible to take well planned actions.',
      },
      {
        color: 'B',
        ms: 'Membantu orang lain menyelesaikan masalah.',
        en: 'Help people solve their problems.',
      },
    ],
  },
  {
    id: 7,
    section: '1a',
    ms: 'Apabila berlaku kesilapan, saya...',
    en: 'When something goes wrong, I...',
    options: [
      {
        color: 'G',
        ms: 'Lihat kepada keadaan dan individu di dalam persekitaran situasi tersebut.',
        en: 'Look at the circumstances and people surrounding the situation.',
      },
      {
        color: 'R',
        ms: 'Melihat kepada kepincangan operasi atau pengurusan.',
        en: 'Look for the flaws in operation or planning.',
      },
      {
        color: 'P',
        ms: 'Lihat situasi serta kepentingan setiap bahagian tersebut.',
        en: 'Look at the situation and the importance of each of its parts.',
      },
      {
        color: 'B',
        ms: 'Lihat kepada apa tindakan yang mungkin menyebabkan masalah itu berlaku (tanggungjawab peribadi).',
        en: 'Look at the possibility of how my actions may have contributed to the problem.',
      },
    ],
  },
  {
    id: 8,
    section: '1a',
    ms: 'Saya suka situasi yang membenarkan...',
    en: 'I like a situation that would allow...',
    options: [
      {
        color: 'G',
        ms: 'Menjana idea-idea kreatif bagi membina perkara yang lebih baik.',
        en: 'The development of new ideas for the creation of something better.',
      },
      {
        color: 'R',
        ms: 'Struktur persekitaran yang boleh diharapkan.',
        en: 'A reliable, structured environment.',
      },
      {
        color: 'P',
        ms: 'Proses yang teratur untuk memastikan kesempurnaan kerja.',
        en: 'A systematic process of getting things done.',
      },
      {
        color: 'B',
        ms: 'Diberikan peluang untuk ekspresi kreatif dan hubungan manusia.',
        en: 'Opportunities for creative expression.',
      },
    ],
  },
  {
    id: 9,
    section: '1a',
    ms: 'Saya tahu saya capai tugasan baik apabila...',
    en: 'I know I did a good job when...',
    options: [
      {
        color: 'G',
        ms: 'Saya secepat mungkin dapat mengumpul bersama dan menyelesaikan secara berkesan tugasan yang samar.',
        en: 'I pulled others together to quickly and effectively finish an unclear task.',
      },
      {
        color: 'R',
        ms: 'Saya mentadbir untuk mendapat penjelasan kepada projek jangka panjang.',
        en: 'I have managed to gain further clarity to a long term project.',
      },
      {
        color: 'P',
        ms: 'Saya mengetahui saya berjaya memberikan cadangan yang praktikal untuk perancangan.',
        en: 'I know I served a practical purpose in the greater plan.',
      },
      {
        color: 'B',
        ms: 'Pihak lain rasa gembira.',
        en: 'Others feel good.',
      },
    ],
  },
  {
    id: 10,
    section: '1a',
    ms: 'Bila pihak lain rasa muram, saya akan...',
    en: 'When others around me are feeling fairly poor, I tend to...',
    options: [
      {
        color: 'G',
        ms: 'Bantu mereka untuk mengatasinya.',
        en: 'Try to help them get over it.',
      },
      {
        color: 'R',
        ms: 'Simpan sahaja pada diri dan berikan ruang kepada mereka.',
        en: 'Keep to myself to give them space.',
      },
      {
        color: 'P',
        ms: 'Bantu mereka fokus kembali kepada peranan mereka.',
        en: 'Help them focus on their role.',
      },
      {
        color: 'B',
        ms: 'Bersimpati dengan masalah mereka dan sama libat rasa seperti apa mereka rasakan.',
        en: 'Sympathize with them and feel what they feel.',
      },
    ],
  },
  // Bahagian 1B (11-15)
  {
    id: 11,
    section: '1b',
    ms: 'Saya belajar paling baik apabila saya...',
    en: 'I learn best when I am...',
    options: [
      {
        color: 'G',
        ms: 'Banyak melakukan ujikaji.',
        en: 'Actively experimenting.',
      },
      {
        color: 'R',
        ms: 'Mempelajari melalui pembentangan yang berstruktur dan jelas.',
        en: 'Learning off a clear, structured presentation.',
      },
      {
        color: 'P',
        ms: 'Menyedari sepenuhnya sebab-sebab untuk mempelajari sesuatu bahan (sistematik).',
        en: 'Fully aware of the reasons for learning the material.',
      },
      {
        color: 'B',
        ms: 'Berhubung dengan orang lain.',
        en: 'Interacting with others.',
      },
    ],
  },
  {
    id: 12,
    section: '1b',
    ms: 'Perkataan TERBAIK yang menggambarkan diri saya...',
    en: 'A word that BEST describes me...',
    options: [
      {
        color: 'G',
        ms: 'Spontan.',
        en: 'Spontaneous.',
      },
      {
        color: 'R',
        ms: 'Menganalisa.',
        en: 'Analytical.',
      },
      {
        color: 'P',
        ms: 'Sistematik / teratur.',
        en: 'Systematic.',
      },
      {
        color: 'B',
        ms: 'Berempati / penuh perasaan.',
        en: 'Empathic.',
      },
    ],
  },
  {
    id: 13,
    section: '1b',
    ms: 'Apabila mengendalikan aktiviti atau projek baru, saya cenderung untuk...',
    en: 'When approaching a new activity or project, my first inclination is to...',
    options: [
      {
        color: 'G',
        ms: 'Melihat dari sudut pandangan menyeluruh (big picture) dan kenal pasti apa yang perlu dari masa ke semasa.',
        en: "Look at it from an overall 'big picture' perspective and figure it out as I go along.",
      },
      {
        color: 'R',
        ms: 'Menganalisa setiap bahagian aktiviti atau projek bagi mendapatkan cara terbaik untuk melaksanakannya.',
        en: 'Analyze the parts of the activity or project to find the best way to do it.',
      },
      {
        color: 'P',
        ms: 'Mengumpul sebanyak mungkin maklumat berhubung projek berkenaan.',
        en: 'Gather as much information about it as possible.',
      },
      {
        color: 'B',
        ms: 'Melihat mereka yang terlibat sama dan mencari sinergi yang boleh diwujudkan.',
        en: 'Look at the other people involved and see what synergy can be established.',
      },
    ],
  },
  {
    id: 14,
    section: '1b',
    ms: 'Yang manakah adalah TERBAIK menceritakan tentang proses untuk mengambil tindakan?',
    en: 'Which BEST describes the process for taking action?',
    options: [
      {
        color: 'G',
        ms: 'Dapatkan sedikit maklumat dahulu, bertindak dengan cepat, kemudian lihat hasilnya dan perbetulkan.',
        en: 'Get a little information, act on it quickly, then see the result and adjust.',
      },
      {
        color: 'R',
        ms: 'Dapatkan maklumat, analisa dengan berhati-hati, seterusnya mengambil tindakan yang sewajarnya.',
        en: 'Get information, analyze it carefully, then take the appropriate action.',
      },
      {
        color: 'P',
        ms: 'Dapatkan maklumat secukupnya untuk memahami secara sepenuhnya, lakukan semakan dan kemudian wujudkan perancangan untuk pelaksanaan.',
        en: 'Get enough information to understand fully, review it, then set a plan for implementation.',
      },
      {
        color: 'B',
        ms: 'Kaji situasi, dapatkan maklumat dan hubungkaitkan dengan pengalaman peribadi, ambil tindakan ringan dahulu dan lihat bagaimana rasanya sebelum meneruskan tindakan.',
        en: 'Review the situation, get some information and relate it to personal experience, take small actions, and see how it feels before proceeding.',
      },
    ],
  },
  {
    id: 15,
    section: '1b',
    ms: 'Faktor UTAMA penting di dalam komunikasi yang berkesan adalah apabila...',
    en: 'The MOST important factor to effective communication is when...',
    options: [
      {
        color: 'G',
        ms: 'Orang memberi maklum balas atas idea yang dizahirkan anda kepada mereka yang terlibat.',
        en: 'People give you feedback on your ideas as you express them.',
      },
      {
        color: 'R',
        ms: 'Seseorang memberi penerangan yang panjang dan lengkap berkaitan sesuatu perkara.',
        en: 'A person gives a long and complete explanation of the subject.',
      },
      {
        color: 'P',
        ms: 'Seseorang yang memberikan perincian berhubung sesuatu perkara di dalam bentuk butiran.',
        en: 'Someone gives an itemized deliberation of the subject in bullet points.',
      },
      {
        color: 'B',
        ms: "Pihak lain bersikap seperti mereka prihatin dengan apa yang saya katakan.",
        en: "The other person appears like they really care about what I'm talking about.",
      },
    ],
  },
];

export const COLOR_ORDER: BrainColor[] = ['G', 'R', 'P', 'B'];

export const COLOR_PROFILES: Record<BrainColor, ColorProfile> = {
  G: {
    key: 'G',
    title: 'HIJAU (Green — Chaotic / Random Processing)',
    shortName: 'HIJAU',
    englishName: 'Green Brain',
    processingStyle: 'Chaotic / Random Processing',
    hex: '#059669',
    lightBg: '#ECFDF5',
    borderHex: '#A7F3D0',
    textClass: 'text-emerald-700',
    bgClass: 'bg-emerald-600',
    softBgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-300',
    traits: [
      'Nothing is connected (Pemprosesan tidak linear)',
      'Must act to understand (Perlu bertindak untuk faham)',
      'Need feedback (Perlu maklum balas)',
      'See big picture (Melihat gambaran besar)',
      'Find alternatives (Mencari alternatif)',
    ],
    description:
      'Pemprosesan Hijau (Chaotic) berfungsi secara rawak, mengumpul maklumat dalam serpihan yang tidak berurutan. Anda cenderung untuk mengambil tindakan dengan cepat (Action First) berdasarkan pandangan "gambaran besar" dan memproses maklumat sambil berjalan. Anda sangat kreatif, spontan, dan gemar mencari penyelesaian alternatif.',
    workplaceTip:
      'Berikan ruang untuk eksperimen pantas, maklum balas segera atas idea, dan objektif gambaran besar sebelum menyusun prosedur terperinci.',
  },
  R: {
    key: 'R',
    title: 'MERAH (Red — Linear Processing)',
    shortName: 'MERAH',
    englishName: 'Red Brain',
    processingStyle: 'Linear Processing',
    hex: '#DC2626',
    lightBg: '#FEF2F2',
    borderHex: '#FECACA',
    textClass: 'text-red-700',
    bgClass: 'bg-red-600',
    softBgClass: 'bg-red-50',
    borderClass: 'border-red-300',
    traits: [
      'Need clarity (Perlu kejelasan)',
      'Must see objective (Mesti melihat objektif)',
      'See logic (Melihat logik)',
      'Must analyze (Mesti menganalisis)',
      'Find structure (Mencari struktur)',
    ],
    description:
      'Pemprosesan Merah (Linear) memerlukan kejelasan dan struktur. Anda memproses maklumat secara berurutan, menganalisis fakta dengan teliti, dan mencari logik yang objektif. Anda hanya mengambil tindakan selepas analisis mendalam, merancang untuk jangka panjang, dan mementingkan garis panduan yang jelas.',
    workplaceTip:
      'Sediakan objektif yang jelas, struktur pelan jangka panjang, dan masa mencukupi untuk analisis rasional sebelum meminta keputusan.',
  },
  P: {
    key: 'P',
    title: 'UNGU (Purple — Relational Processing)',
    shortName: 'UNGU',
    englishName: 'Purple Brain',
    processingStyle: 'Relational Processing',
    hex: '#7C3AED',
    lightBg: '#F5F3FF',
    borderHex: '#DDD6FE',
    textClass: 'text-violet-700',
    bgClass: 'bg-violet-600',
    softBgClass: 'bg-violet-50',
    borderClass: 'border-violet-300',
    traits: [
      'Must have information (Mesti ada maklumat)',
      'All data is linked (Semua data dipautkan)',
      'Need details (Perlu perincian)',
      'Find system (Mencari sistem)',
      'Find options (Mencari pilihan)',
    ],
    description:
      'Pemprosesan Ungu (Relational) menjadikan maklumat sebagai keutamaan. Anda memerlukan data yang lengkap dan terperinci untuk melihat bagaimana setiap bahagian saling berkait. Anda mengambil masa untuk membuat keputusan bagi memastikan prosesnya sistematik, teratur, dan mempunyai pelan pelaksanaan yang praktikal.',
    workplaceTip:
      'Bentangkan fakta secara terperinci dalam bentuk butiran tersusun serta jelaskan kaitan antara setiap peranan dan sistem.',
  },
  B: {
    key: 'B',
    title: 'BIRU (Blue — Intuitive Processing)',
    shortName: 'BIRU',
    englishName: 'Blue Brain',
    processingStyle: 'Intuitive Processing',
    hex: '#2563EB',
    lightBg: '#EFF6FF',
    borderHex: '#BFDBFE',
    textClass: 'text-blue-700',
    bgClass: 'bg-blue-600',
    softBgClass: 'bg-blue-50',
    borderClass: 'border-blue-300',
    traits: [
      'Everything is connected (Semua perkara berhubung)',
      'Feel environment (Merasai persekitaran)',
      'Insightful of surroundings (Berwawasan terhadap persekitaran)',
      'Multi-tasking (Multi-tugas)',
      'Intuitive of others (Intuitif terhadap orang lain)',
    ],
    description:
      'Pemprosesan Biru (Intuitive) menghubungkan semua perkara, termasuk emosi dan pengalaman lalu, untuk membentuk gerak hati. Anda sangat berempati, peka terhadap perasaan orang lain, dan memahami dinamik persekitaran sosial. Komunikasi berkesan bagi anda memerlukan hubungan peribadi dan keikhlasan.',
    workplaceTip:
      'Mulakan komunikasi dengan membina kepercayaan peribadi dan keserasian pasukan agar kerjasama berjalan lancar.',
  },
};
