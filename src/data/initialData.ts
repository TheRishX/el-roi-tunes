import { Category, Song } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'worship',
    name: 'Worship',
    icon: 'church',
    trackCount: 420,
    languages: ['EN', 'HI'],
    description: 'Devotional, praise, and uplifting congregational worship anthems.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQLzW3wp-5CVEDHZ3_derHqxo8k9IhPAe83DiKk-Ok61Q0vwvQOYvuWHfdYmCTQahMwGO1N4hKNP9DUfESZW9i4TXfm2ZXsOx_PPNPCX4kZyx53m6u4iKwA7Cx8mrg0zBUb_WAzVzs8fHDkY9QKldVzUnmos5dRAF354Afsj2K_7Q_0s20sebobqBaWzuuffg94bO6flfi9UA-_wsJ0rnWoPLtH7cf5ZRarVUATjruYyNu4ZXnjPV5',
    isPopular: true,
  },
  {
    id: 'pop',
    name: 'Pop',
    icon: 'graphic_eq',
    trackCount: 235,
    languages: ['EN', 'HI'],
    description: 'Contemporary melodic tunes with inspiring, meaningful lyrics.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHq0O4bRo-T7yYlpG18pFD81-YH7yyGJKx6ONrJKXqjcQ04iH9wOsdb-fBLGAtVP-cuczTBrtWQlPnSx3n2xUVZ2H7kH1V3Hrb1r1pAe-S72L8dDmJksXsqmKTfejHF5wT-nsccQdxfiMR_pX9QCk6AcQzq_r1t5ojifvwfpYo41r1pLGhAGowNjuAj_xrPfWjQIdyBurY9pqy4IGeNkiMqRjxS51zdDSCGhA4LiIELrVo10-g2Vsl',
  },
  {
    id: 'gospel',
    name: 'Gospel',
    icon: 'hands_clapping',
    trackCount: 310,
    languages: ['EN'],
    description: 'Joyful choral and soulful heritage harmonies and traditional gospel tracks.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWXWTaT-gQwxlMCrkR3IUyOMXW7mG41IcKwY4MDbZOQaBY1Kra2dqVUAycOmyF3whCguW0olyZZ2UMh-qiFnQBiGQ0WtvVkIzgrL42rxWeHG8gOtCwkQLJhNwmvLpefw6ML0n0qYaRb_hJTCpMUPCgwykoOvhVi7IF2YbsKy3yqMcr_4iuQdlGN9xmAUc8yO4kq1Pi6Yg2M7c5aiADNJp4pG5sUVw0wZKSrCsZsJJp2oTAnm6NPiwc',
  },
  {
    id: 'rock',
    name: 'Rock',
    icon: 'music_cast',
    trackCount: 156,
    languages: ['EN'],
    description: 'Driving acoustic rhythms and energetic electric guitar arrangements.',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'traditional',
    name: 'Traditional',
    icon: 'library_music',
    trackCount: 89,
    languages: ['EN', 'NE'],
    description: 'Centuries-old timeless hymns with organ, piano, and rich four-part harmony.',
    coverImage: 'https://images.unsplash.com/photo-1520523839898-50712825e617?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'instrumental',
    name: 'Instrumental',
    icon: 'queue_music',
    trackCount: 204,
    languages: ['NONE'],
    description: 'Peaceful acoustic guitar, soothing grand piano, and meditative strings.',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  },
];

export const INITIAL_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Abide With Me',
    artist: 'Classic Hymns (Henry Francis Lyte)',
    category: 'Worship',
    language: 'English',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkRsq75lkNRquIvb0r9qSaocbTi8MbwChQIVEQAgQCb_LssUAd3gb3GWm7enjNdN49s7f-aSza84xUN3zrb0-jRVgz4efTqyDEw2qBs7QqY3JMe1AVtrN6JtkP3kEYL-JCgFG6RWJoHVV--RsCXaxO7RKG_8lURukoxFJliAiugNUgoeyZ785PSZMx_EKRrae0auEg8H9nfUdEAOseILshsK69w7PZnzvkcAma6lsZrFI-7UVZTRxs',
    defaultKey: 'Eb',
    bpm: 72,
    tempo: '4/4',
    isPinned: true,
    isFavorite: true,
    views: 4520,
    year: 1847,
    status: 'Approved',
    uploadedBy: 'Elder Thomas',
    createdAt: '2026-08-20',
    videoUrl: 'https://www.youtube.com/watch?v=deJDkU6qiGE',
    lyrics: `Abide with me; fast falls the eventide;
The darkness deepens; Lord, with me abide.
When other helpers fail and comforts flee,
Help of the helpless, O abide with me.

Swift to its close ebbs out life's little day;
Earth's joys grow dim; its glories pass away;
Change and decay in all around I see;
O Thou who changest not, abide with me.

I need Thy presence every passing hour;
What but Thy grace can foil the tempter's power?
Who, like Thyself, my guide and stay can be?
Through cloud and sunshine, Lord, abide with me.

I fear no foe, with Thee at hand to bless;
Ills have no weight, and tears no bitterness.
Where is death's sting? Where, grave, thy victory?
I triumph still, if Thou abide with me.`,
    chordsLyrics: `[Eb]Abide with [Bb]me; fast [Eb]falls the [Ab]even[Eb]tide;
The [Eb]darkness [Bb]deepens; [Eb]Lord, with [Bb]me a[Eb]bide.
[Eb]When other [Ab]helpers [Eb]fail and [Fm]comforts [Bb]flee,
[Eb]Help of the [Bb]helpless, [Eb]O a[Ab]bide [Bb]with [Eb]me.

[Eb]Swift to its [Bb]close ebbs [Eb]out life's [Ab]little [Eb]day;
Earth's [Eb]joys grow [Bb]dim; its [Eb]glories [Bb]pass a[Eb]way;
[Eb]Change and de[Ab]cay in [Eb]all a[Fm]round I [Bb]see;
[Eb]O Thou who [Bb]changest [Eb]not, a[Ab]bide [Bb]with [Eb]me.

[Eb]I need Thy [Bb]presence [Eb]every [Ab]passing [Eb]hour;
What [Eb]but Thy [Bb]grace can [Eb]foil the [Bb]tempter's [Eb]power?
[Eb]Who, like Thy[Ab]self, my [Eb]guide and [Fm]stay can [Bb]be?
[Eb]Through cloud and [Bb]sunshine, [Eb]Lord, a[Ab]bide [Bb]with [Eb]me.`,
    timestamps: [
      { time: 0, text: 'Abide with me; fast falls the eventide;' },
      { time: 8, text: 'The darkness deepens; Lord, with me abide.' },
      { time: 16, text: 'When other helpers fail and comforts flee,' },
      { time: 24, text: 'Help of the helpless, O abide with me.' },
      { time: 32, text: "Swift to its close ebbs out life's little day;" },
      { time: 40, text: 'Earth’s joys grow dim; its glories pass away;' },
      { time: 48, text: 'Change and decay in all around I see;' },
      { time: 56, text: 'O Thou who changest not, abide with me.' },
    ],
  },
  {
    id: 'song-2',
    title: 'How Great Thou Art',
    artist: 'Worship Collection (Stuart K. Hine)',
    category: 'Worship',
    language: 'English',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdUtn3Ul4e4utcVPxTw2gOXEVyc2YkFF1W1TJeSmOc4Qd03amtI_C7HeJLN80klNlkj1hec1bUHAJ4Ee5o5isFMflyD7N2VEw6n6Nu_k2amwCupvXbzFjf4asLNZq7jwcarBeeOOcbPXlkjetneKFtOFgpHpYhv1EYPcQ2FK7xiN80PjN-CDWfSkWPIuVffZ6CSXDRf9-UwVaEH5LCJO1XmMAnr8W0ADgMlOs1A9eTmonh5pSY9aJ9',
    defaultKey: 'A',
    bpm: 78,
    tempo: '4/4',
    isPinned: true,
    isFavorite: true,
    views: 8910,
    year: 1949,
    status: 'Approved',
    uploadedBy: 'Grace Choir',
    createdAt: '2026-08-18',
    videoUrl: 'https://www.youtube.com/watch?v=Cc0QVWzCv14',
    lyrics: `O Lord, my God, when I in awesome wonder
Consider all the worlds Thy Hands have made;
I see the stars, I hear the rolling thunder,
Thy power throughout the universe displayed.

Then sings my soul, My Saviour God, to Thee,
How great Thou art, how great Thou art.
Then sings my soul, My Saviour God, to Thee,
How great Thou art, how great Thou art!

And when I think of God, His Son not sparing;
Sent Him to die, I scarce can take it in;
That on the Cross, my burden gladly bearing,
He bled and died to take away my sin.

When Christ shall come, with shout of acclamation,
And take me home, what joy shall fill my heart!
Then I shall bow in humble adoration,
And then proclaim: "My God, how great Thou art!"`,
    chordsLyrics: `O [A]Lord my God, when [D]I in awesome wonder
Con[A]sider all the [E]worlds Thy hands have [A]made;
I see the [A]stars, I hear the [D]rolling thunder,
Thy [A]power through[E]out the universe dis[A]played.

[Chorus]
Then sings my [A]soul, My [D]Saviour God, to [A]Thee,
How great Thou [Bm]art, [E]how great Thou [A]art.
Then sings my [A]soul, My [D]Saviour God, to [A]Thee,
How great Thou [Bm]art, [E]how great Thou [A]art!`,
    timestamps: [
      { time: 0, text: 'O Lord, my God, when I in awesome wonder' },
      { time: 7, text: 'Consider all the worlds Thy Hands have made;' },
      { time: 14, text: 'I see the stars, I hear the rolling thunder,' },
      { time: 21, text: 'Thy power throughout the universe displayed.' },
      { time: 28, text: 'Then sings my soul, My Saviour God, to Thee,' },
      { time: 35, text: 'How great Thou art, how great Thou art.' },
    ],
  },
  {
    id: 'song-3',
    title: 'Amazing Grace',
    artist: 'Gospel Roots (John Newton)',
    category: 'Gospel',
    language: 'English',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAix7pcmB0633QWOS_Hgqc4FtNe8lY5h0ybcwd0im0EZutoLKBvT-eNOaNuF8klXls8XKZ7_4m0MmdxtoIgBL1Ympv7n0m9Sy6jjLvSjFI2f8hUpRJtCM70lDsqSfF2Z9sJ4lDDuPKSq_i2IafYpuqZ8T1sV4M7W9RrEIl9vgJEmgNBT4pffnej6PALvGONxxOvbtqgq8KY3_KkkTDA2--5q2iHzNgqukrWeXK0KUxza4bVs5zJtU2N',
    defaultKey: 'G',
    bpm: 66,
    tempo: '3/4',
    isPinned: true,
    isFavorite: false,
    views: 12430,
    year: 1779,
    status: 'Approved',
    uploadedBy: 'Community Archivist',
    createdAt: '2026-08-15',
    videoUrl: 'https://www.youtube.com/watch?v=CDdvReNKKuk',
    lyrics: `Amazing grace! How sweet the sound
That saved a wretch like me!
I once was lost, but now am found;
Was blind, but now I see.

'Twas grace that taught my heart to fear,
And grace my fears relieved;
How precious did that grace appear
The hour I first believed.

Through many dangers, toils and snares,
I have already come;
'Tis grace hath brought me safe thus far,
And grace will lead me home.

When we've been there ten thousand years,
Bright shining as the sun,
We've no less days to sing God's praise
Than when we'd first begun.`,
    chordsLyrics: `A[G]mazing grace! How [C]sweet the [G]sound
That saved a wretch like [D]me!
I [G]once was lost, but [C]now am [G]found;
Was [Em]blind, but [D]now I [G]see.

'Twas [G]grace that taught my [C]heart to [G]fear,
And grace my fears re[D]lieved;
How [G]precious did that [C]grace ap[G]pear
The [Em]hour I [D]first be[G]lieved.`,
    timestamps: [
      { time: 0, text: 'Amazing grace! How sweet the sound' },
      { time: 6, text: 'That saved a wretch like me!' },
      { time: 12, text: 'I once was lost, but now am found;' },
      { time: 18, text: 'Was blind, but now I see.' },
    ],
  },
  {
    id: 'song-4',
    title: 'Dil Diyan Gallan',
    artist: 'Atif Aslam',
    category: 'Pop',
    language: 'Hindi',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVpGe73EtGVUvytYCRE7Hi5pwf13ZmNCDhTepgjpHzcKoCZ5N3kVCWvGEejV2TKgP039Zic-KnxcoBAv8ex4QS9Rjv0JVd4EpnaJkkjflYbZjBES_gGiVS2ddIRgJTzxPF8enF4Z5Q-wlSmpXi6UKGQKVg3W9vIwQWCkWaM7q4UhYPfssG3zODCVzjtSuT-C2KvbvIBj3MLWZcAzVH9WvY4SNDAeTxVd0wuKigIXAmKSLBjK_KJ9qu',
    defaultKey: 'C',
    bpm: 84,
    tempo: '4/4',
    isPinned: false,
    isFavorite: true,
    views: 15300,
    year: 2017,
    status: 'Approved',
    uploadedBy: 'Aarav Sharma',
    createdAt: '2026-08-19',
    videoUrl: 'https://www.youtube.com/watch?v=SAcpESN_Fk4',
    lyrics: `Kachi doriyon, doriyon, doriyon se
Mainu tu baandh le
Pakki yaariyon, yaariyon, yaariyon mein
Honde na faasley

Eh naraazgi kaagzi saari teri
Mere sohneya sun le meri
Dil diyan gallan
Karaange naal naal beh ke
Akh naale akh nu mila ke
Dil diyan gallan haaye...
Karaange roz roz beh ke
Sacchiyan mohabbataan nibha ke

Sataaye mainu kyun
Dikhaaye mainu kyun
Aiven jhoothi-moothi rus ke rusaa ke
Dil diyan gallan
Karaange naal naal beh ke
Akh naale akh nu mila ke`,
    chordsLyrics: `[C]Kachi doriyon, doriyon, [Am]doriyon se
[F]Mainu tu baandh [G]le
[C]Pakki yaariyon, yaariyon, [Am]yaariyon mein
[F]Honde na faas[G]ley

Eh na[C]raazgi kaagzi [Am]saari teri
Mere [F]sohneya sun le [G]meri
[C]Dil diyan gallan
Karaange [Am]naal naal beh ke
[F]Akh naale akh nu mi[G]la ke
[C]Dil diyan gallan haaye...
Karaange [Am]roz roz beh ke
[F]Sacchiyan mohabbataan ni[G]bha ke`,
    timestamps: [
      { time: 0, text: 'Kachi doriyon, doriyon, doriyon se' },
      { time: 6, text: 'Mainu tu baandh le' },
      { time: 11, text: 'Pakki yaariyon, yaariyon, yaariyon mein' },
      { time: 17, text: 'Honde na faasley' },
      { time: 22, text: 'Dil diyan gallan karaange naal naal beh ke' },
    ],
  },
  {
    id: 'song-5',
    title: 'Midnight City',
    artist: 'M83',
    category: 'Pop',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    defaultKey: 'B',
    bpm: 105,
    tempo: '4/4',
    isPinned: false,
    isFavorite: false,
    views: 6420,
    year: 2011,
    status: 'Approved',
    uploadedBy: 'Alex Chen',
    createdAt: '2026-08-12',
    videoUrl: 'https://www.youtube.com/watch?v=dX3k_QDnzHE',
    lyrics: `Waiting in a car
Waiting for a ride in the dark
The night city grows
Look and see her eyes, they glow

Waiting in a car
Waiting for a ride in the dark
Drinking in the lounge
Following the neon signs

Waiting for a roar
Looking at the mutating skyline
The city is my church
It wraps me in the sparkling twilight`,
    chordsLyrics: `[Bm] [G] Waiting in a car
[D] [A] Waiting for a ride in the dark
[Bm] [G] The night city grows
[D] [A] Look and see her eyes, they glow

[Bm] [G] Waiting in a car
[D] [A] Waiting for a ride in the dark
[Bm] [G] Drinking in the lounge
[D] [A] Following the neon signs

[Bm] [G] Waiting for a roar
[D] [A] Looking at the mutating skyline
[Bm] [G] The city is my church
[D] [A] It wraps me in the sparkling twilight`,
    timestamps: [
      { time: 0, text: 'Waiting in a car' },
      { time: 4, text: 'Waiting for a ride in the dark' },
      { time: 9, text: 'The night city grows' },
      { time: 14, text: 'Look and see her eyes, they glow' },
      { time: 19, text: 'The city is my church' },
      { time: 24, text: 'It wraps me in the sparkling twilight' },
    ],
  },
  {
    id: 'song-6',
    title: 'Ae Dil Hai Mushkil',
    artist: 'Arijit Singh (Pritam)',
    category: 'Pop',
    language: 'Hindi',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYV1T_fgnXrEuDH9iErS2hNl0z8r5_n_0P2hT9tHWtyNH-XOQbWTe3wK59JuhNbeluOY6MDOT1c2vinW50J-tevIgKAauYl6V4QU9F3CBb_pbsiwpNMFPnIfFGMTlPqxDRqxymT-SHx1GJ4wQdTFupEfqEU-RdRpGL20PdMXD2xXcGBuyvNu1mP7TdkUyUZUMCe_yAg-F1v3TyALCyWVIihcXvQ0UaWDWDZbPzX4_626hKc8iqiMHV',
    defaultKey: 'F#m',
    bpm: 82,
    tempo: '4/4',
    isPinned: false,
    isFavorite: true,
    views: 18400,
    year: 2016,
    status: 'Approved',
    uploadedBy: 'Arijit Fandom',
    createdAt: '2026-08-16',
    videoUrl: 'https://www.youtube.com/watch?v=6FURuLYrR_Q',
    lyrics: `Tu safar mera
Hai tu hi meri manzil
Tere bina guzara
Ae dil hai mushkil

Tu mera Khuda
Tu hi duaa mein shaamil
Tere bina guzara
Ae dil hai mushkil

Mujhe aazmaati hai teri kami
Meri har kami ko hai tu laazmi
Junoon hai mera
Banoon main tere qaabil
Tere bina guzara
Ae dil hai mushkil`,
    chordsLyrics: `[F#m]Tu safar mera
Hai [D]tu hi meri manzil
[E]Tere bina guzara
[F#m]Ae dil hai mushkil

[F#m]Tu mera Khuda
Tu [D]hi duaa mein shaamil
[E]Tere bina guzara
[F#m]Ae dil hai mushkil

[D]Mujhe aazmaati hai [E]teri kami
[D]Meri har kami ko hai [E]tu laazmi
[F#m]Junoon hai mera
Ba[D]noon main tere qaabil
[E]Tere bina guzara
[F#m]Ae dil hai mushkil`,
    timestamps: [
      { time: 0, text: 'Tu safar mera, hai tu hi meri manzil' },
      { time: 7, text: 'Tere bina guzara ae dil hai mushkil' },
      { time: 14, text: 'Tu mera Khuda, tu hi duaa mein shaamil' },
      { time: 21, text: 'Tere bina guzara ae dil hai mushkil' },
    ],
  },
  {
    id: 'song-7',
    title: 'Tujh Mein Rab Dikhta Hai',
    artist: 'Roop Kumar Rathod (Salim-Sulaiman)',
    category: 'Worship',
    language: 'Hindi',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUgIUKzi4kD0La6COnUxNE9yDo2Fu1uQ_EKrLwHrgQ_zhbD7Go1m7PaTgQUpPnpnxDs-Ynf4jWV2I9oDHzBeYi7nQaMWReb9hnF7DeQa1OfCD3BAEB7L97GTIQFIklg_JoOb25Ov6Oy5uWht36LLzieW6bJQbq-2wmFdC_HPagGEZDrh3k_9m7xl5pwDA7mxebc5KrRDGSJJPZVB_D3EwWxpog4uRPZAX74IPn3Pkhp6xbJE3Q-WAq',
    defaultKey: 'D',
    bpm: 76,
    tempo: '4/4',
    isPinned: false,
    isFavorite: false,
    views: 11200,
    year: 2008,
    status: 'Approved',
    uploadedBy: 'Rathod Classics',
    createdAt: '2026-08-10',
    videoUrl: 'https://www.youtube.com/watch?v=qoq8B8ThgEM',
    lyrics: `Tu hi toh jannat meri, tu hi mera junoon
Tu hi toh mannat meri, tu hi rooh ka sukoon
Tu hi ankhiyon ki thandak, tu hi dil ki hai dastak
Aur kuch na jaanu main, bas itna hi jaanu

Tujh mein Rab dikhta hai
Yaara main kya karoon
Tujh mein Rab dikhta hai
Yaara main kya karoon
Sajde sar jhukta hai
Yaara main kya karoon
Tujh mein Rab dikhta hai
Yaara main kya karoon`,
    chordsLyrics: `[D]Tu hi toh jannat meri, [G]tu hi mera junoon
[D]Tu hi toh mannat meri, [G]tu hi rooh ka sukoon
[Em]Tu hi ankhiyon ki thandak, [A]tu hi dil ki hai dastak
[G]Aur kuch na jaanu main, [A]bas itna hi jaanu

[D]Tujh mein Rab dikhta hai
[G]Yaara main kya ka[D]roon
[D]Tujh mein Rab dikhta hai
[G]Yaara main kya ka[D]roon
[Bm]Sajde sar jhukta hai
[A]Yaara main kya ka[D]roon`,
    timestamps: [
      { time: 0, text: 'Tu hi toh jannat meri, tu hi mera junoon' },
      { time: 6, text: 'Tu hi toh mannat meri, tu hi rooh ka sukoon' },
      { time: 12, text: 'Tujh mein Rab dikhta hai, yaara main kya karoon' },
    ],
  },
  {
    id: 'song-8',
    title: 'Prabhu Ko Prem (प्रभुको प्रेम)',
    artist: 'Nepali Christian Hymnal',
    category: 'Worship',
    language: 'Nepali',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    defaultKey: 'G',
    bpm: 70,
    tempo: '3/4',
    isPinned: false,
    isFavorite: true,
    views: 3820,
    year: 1995,
    status: 'Approved',
    uploadedBy: 'Pastor Bishal',
    createdAt: '2026-08-21',
    videoUrl: 'https://www.youtube.com/watch?v=3kFqXf0tQzM',
    lyrics: `प्रभुको प्रेम कति महान् छ
आकाश भन्दा उच्च छ
समुन्द्र भन्दा गहिरो छ
संसारलाई उहाँले यस्तो प्रेम गर्नुभयो

(कोरस)
हाल्लेलुयाह गाउँछौँ हामी
प्रभुको महिमा गरौँ
उहाँको अनुग्रह सदा रहिरहन्छ
हाम्रो जीवन उहाँकै हो

क्रूसमा उहाँले ज्यान दिनुभयो
हाम्रा पाप सबै क्षमा गर्नुभयो
नयाँ जीवन दिनुभयो
सदा उहाँको साथमा जिउनेछौँ`,
    chordsLyrics: `[G]प्रभुको प्रेम [C]कति महान् [G]छ
[Em]आकाश भन्दा [D]उच्च छ
[G]समुन्द्र भन्दा [C]गहिरो [G]छ
संसारलाई [D]उहाँले यस्तो [G]प्रेम गर्नुभयो

[Chorus]
[G]हाल्लेलुयाह [C]गाउँछौँ [G]हामी
[Em]प्रभुको महिमा [D]गरौँ
[G]उहाँको अनुग्रह [C]सदा रहि[G]रहन्छ
हाम्रो [D]जीवन उहाँकै [G]हो`,
    timestamps: [
      { time: 0, text: 'प्रभुको प्रेम कति महान् छ' },
      { time: 6, text: 'आकाश भन्दा उच्च छ' },
      { time: 12, text: 'हाल्लेलुयाह गाउँछौँ हामी' },
    ],
  },
  {
    id: 'song-9',
    title: '10,000 Reasons (Bless the Lord)',
    artist: 'Matt Redman & Jonas Myrin',
    category: 'Worship',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80',
    defaultKey: 'G',
    bpm: 73,
    tempo: '4/4',
    isPinned: false,
    isFavorite: false,
    views: 22100,
    year: 2011,
    status: 'Approved',
    uploadedBy: 'Worship Leader Joy',
    createdAt: '2026-08-14',
    videoUrl: 'https://www.youtube.com/watch?v=DXDGE_lRI0E',
    lyrics: `Bless the Lord, O my soul, O my soul
Worship His holy name
Sing like never before, O my soul
I'll worship Your holy name

The sun comes up, it's a new day dawning
It's time to sing Your song again
Whatever may pass, and whatever lies before me
Let me be singing when the evening comes

You're rich in love, and You're slow to anger
Your name is great, and Your heart is kind
For all Your goodness I will keep on singing
Ten thousand reasons for my heart to find`,
    chordsLyrics: `[Chorus]
Bless the [C]Lord, O my [G]soul, [D/F#]O my [Em]soul
[C]Worship His [G]holy [D]name
Sing like [C]never be[Em]fore, [C] [D]O my [Em]soul
I'll [C]worship Your [D]holy [G]name

[Verse 1]
The [C]sun comes [G]up, it's a [D]new day [Em]dawning
[C]It's time to [G]sing Your [D]song a[Em]gain
What[C]ever may [G]pass, and what[D]ever lies be[Em]fore me
[C2]Let me be [G]singing when the [D]evening [G]comes`,
    timestamps: [
      { time: 0, text: 'Bless the Lord, O my soul, O my soul' },
      { time: 7, text: 'Worship His holy name' },
      { time: 14, text: 'The sun comes up, it’s a new day dawning' },
    ],
  },
  {
    id: 'song-10',
    title: 'Morning Contemplation',
    artist: 'David P.',
    category: 'Instrumental',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
    defaultKey: 'C',
    bpm: 60,
    tempo: '4/4',
    isPinned: false,
    isFavorite: false,
    views: 410,
    year: 2026,
    status: 'Pending',
    uploadedBy: 'David P.',
    createdAt: '2026-08-24',
    lyrics: `[Instrumental Piano Composition]
Calm morning reflection with gentle piano arpeggios and cello accompaniment.
Ideal for quiet prayer, meditation, and scripture reading.`,
    chordsLyrics: `[C] [G/B] [Am] [F]
[C] [G/B] [F] [C]
[Am] [Em] [F] [G]
[C] [F] [G] [C]`,
  },
  {
    id: 'song-11',
    title: 'Echoes of Grace',
    artist: 'Sarah M.',
    category: 'Worship',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
    defaultKey: 'D',
    bpm: 68,
    tempo: '4/4',
    isPinned: false,
    isFavorite: false,
    views: 890,
    year: 2026,
    status: 'Approved',
    uploadedBy: 'Sarah M.',
    createdAt: '2026-08-24',
    lyrics: `In the silence of the morning light
Your grace falls like fresh dew.
Every heartbeat sings of Your mercy,
Making all things new.`,
    chordsLyrics: `[D]In the silence of the [G]morning light
Your [D]grace falls like fresh [A]dew.
[Bm]Every heartbeat [G]sings of Your mercy,
[Em]Making [A]all things [D]new.`,
  },
  {
    id: 'song-12',
    title: 'Silent Waters',
    artist: 'System Admin',
    category: 'Instrumental',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    defaultKey: 'F',
    bpm: 58,
    tempo: '4/4',
    isPinned: false,
    isFavorite: false,
    views: 1120,
    year: 2026,
    status: 'Approved',
    uploadedBy: 'System Admin',
    createdAt: '2026-08-23',
    lyrics: `He leads me beside the still waters.
He restores my soul;
He leads me in paths of righteousness
For His name's sake.`,
    chordsLyrics: `[F]He leads me beside the [Bb]still waters.
[F]He restores my [C]soul;
[Dm]He leads me in [Bb]paths of righteousness
[Gm]For His [C]name's [F]sake.`,
  },
];
