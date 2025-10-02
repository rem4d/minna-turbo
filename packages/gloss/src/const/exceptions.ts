export const exceptionList = [
  "〜に",
  "〜を",
  "〜で",
  "〜の",
  "〜と",
  "〜って",
  "〜よう",
  "〜ものだ",
  "〜ように",
  "〜も",
  "〜られる",
  "〜そうだ",
  "〜から",
  "〜こと",
  "〜し",
  "〜して",
  "〜になる",
  "〜く",
  "〜が",
  "〜より",
  "〜なんだ",
] as const;

export type ExceptionType = (typeof exceptionList)[number];

export const promptMap: Record<ExceptionType, string> = {
  "〜に": `
1. a particle that indicates a point of time at which something takes place (at, in, on)
Example: 私は毎朝６時半に送ります。
2. an indirect object maker (to, for)
Example: 私は母に手紙をよく書く。
3. a particle that indicates an agent or a source in passive, cuasative, morau / te morau and other receiving constructions (by, from)
Example: 一男は友達に手紙を読まれた。
4. a particle that indicates the surface of something upon which some action directly takes place (on, onto)
Example:　子供が紙に絵お描きました。
5. a particle which indicates purpose when something moves from one place to another (to do something, in order to do smth)
Example: 私はデパートへ贈り物を買いに行った。
6. a particle which indicates the location where something or someone exists (in, at, on)
Example: 私のクラスには中国人の学生がいます。
7. a particle which indicates a place towards which something or someone moves (to, toward)
Example: 私は昨日サンフランシスコに行きました。
 `,
  "〜を": `
1. a particle which marks a direct object
Example: 私は日本語を勉強しています。
2. a particle which indicates a space in / on / across / through / along with someone or something moves (in, on, across, through, along, over)
Example: 私は五番街を歩いた。
3. a particle that marks the location from which some movement begins
Example: 私は朝７時半に家を出ます。
4. a particle that marks the cause of some human emotion
Example: ミラさんは父の死を悲しました。
`,
  "〜で": `
1. a particle derived from て-form of です that indicates a weak casual relationship (and, because of, due to, because)
Example: 明日は期末試験で大変です。
2. a particle which indicates the use of something for doing something (by, for, from, in, on, using, with)
Example: 日本人ははしでご飯を食べる。
3. a particle which indicates location, except for location of existence (at, in, on)
Example: ゆり子さんはデパートで働いています。
4. a particle which indicates the time when something terminates or the amount of time a period of activity has taken (at, on, in)
Example: 春学期は5月10日で終わる。
`,
  "〜の": `
1. a particle which, with a preceding noun phrase, forms a phrase to modify a following noun phrase ('s, of, in, at, for, by, from)
Example: これは先生の本です。
2. a dependent indefinite pronoun
Example: 私は大木のを書いました。
3. a nominalizer which is used when the nominalized sentences expresses a directly perceptible event (that ~, to do something, doing something)
Example: 日本語を教えるのは難しです。
4. a sentence-final particle used by a female speaker or a child to indicate an explanation or emotive emphasis
Example: どうして泣いているの？
`,
  "〜と": `
1. a particle which lists things exhaustively (and)
Example: マイクとミラとは学生です。
2. a particle marking the NP which maintains a reciprocal relationship with the subject of a clause (with; as; from)
Example: 私はアンさんと一緒にパーティーに行った。
3. a particle which marks a quotation, sound or the manner in which something/someone does sth/so (that; with the sound of; in the manner of)
Example: ヒルさんは私に日本語で「こんにちは」と言った。
4. a subordinate conjunction which marks a condition that brings about an noncontrollable event or state (if; when)
Example: ニューヨークに行くと面白い店がたくさんあります。
`,
  "〜って": `
1. a colloquial topic-introducer (Speaking of 〜)
Example: アメリカ人ってフットボールが好きですね。
2. a colloquial quotation marker (that)
ジェーンは踊らないって。
`,
  "〜よう": `
1. a noun-forming suffix which means a way (of doing sth) (a/the way to; a/the way of -ing)
Example: 日本語があんなに下手じゃどうしょうもない。
2. an auxiliary verb that expresses the writer's conjecture about some potentiality or his certainity about given state or affairs (probably; likely; must be; should; ought)
Example: あのタワーに上れば、街全体がよく見えよう。
`,
  "〜ものだ": `
1. exclamatory expression of surprise or strong feeling (because; how could ~!; used to; should like to; should)
Example: よくあんな男とデート出来るものだ!
2. identifying expression (the one that ~; thing that ~; something which ~;)
Example: 小田さんはまだ小身ものである。
`,
  "〜ように": `
1. indicates purpose or goal
Example: 良い席が取れるように早く来た。
2. indicates resemblance, manner, or "as if"
Example: 丸でわたし自身がしたように。
3. tell someone to do something
Example: 先生は学生に宿題をするように言った。
`,
  "〜も": `
1. a particle which indicates that a proposition about the preceding element X is also true when another similar proposition is true (too; also)
Example: その前の木曜も行った。
2. a marker which indicates emphasis (even; as many/ much/ long ...as; (not) even (one); (not) any)
Example: ここにはコドモは一人もいません。
`,
  "〜られる": `
1. passive Voice
2. Potential Form
`,
  "〜そうだ": `
1. hearsay ("I hear that...", "It is said that...")
2. conjunction ("Looks like...", "Seems like...", "About to...")
`,
  "〜から": `
1. a particle that indicates a starting point or a source (from; since; out of)
Example: このバスはニューヨークから来た。
2. after / since a point in time at which something takes place (after; having done sth; since time)
Example: 私は友達に電話してからうちを出た。
3. a subordinate conjunction which expresses a reason or cause (so; since; because)
Example: 春子は十七だからまだお酒を飲めない。
`,
  "〜こと": `
1. 〜こと as a nominalizer, or intangible thing, or a general sense
2. ことがある - There WAS a time when ~ (someone has done something; someone has had an experience doing something; there was a time when something)
3. ことがある - There ARE times when ~ (there is a time when something)
4. ことが出来る - Doing something is possible (can; be able to)
5. ことになる - An event takes place as if spontaneously (it will be decided that ~; come about ~; be arranged that ~; turn out that ~)
6. ことにする - A volitional decision to do something (decide to)
7. ことは〜が - Speaking of proposition X, X is certainly true (indeed one does something alright, (but ~); indeed ~ (but ~); do ~ (but ~))
Example: 私のアパートは駅に近くて便利なことは便利ですが，家貸がとても高いです。
`,
  "〜し": `
1. indicates action in polite form.
2. conjunctive particle, used to list multiple actions, reasons, or qualities.
`,
  "〜して": `
1. verb in te-form
2. indicates reason or means (e.g.　〜どうして)
`,
  "〜になる": `
1. 〜になる - becomes or turns into
2. 〜ことになる - be decided that
3. 〜になると  - when comes
4. 〜お〜になる - polite description of outgroup person's action
5. 〜そうになる - on the verge of
6. 〜ようになる - reach the point where
`,
  "〜く": `
1. adverbial form of i-adjective
2. part of a verb
`,
  "〜が": `
1. a particle that indicates the subject
2. a disjunctive coordinate conjunction that combines two sentences
`,
  "〜より": `
1. a particle which indicates that s.t. / s.o. is being compared to s.t. / s.o. (than; rather ~ than ~; more ~ than ~)
2. a particle which indicates a set point in terms of space or time (in ~ of; inside; outside; before; after)
  `,
  "〜なんだ": `
1. explanatory ending
2. "what"
  `,
};

// type predicate
export const isValidGloss = (kana: string): kana is ExceptionType => {
  const found = exceptionList.filter((e) => e === kana);

  return found.length > 0;
};
