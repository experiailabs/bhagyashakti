// Temple Ledger: editorial journal content is calm, practical, bilingual, and framed as belief-based reflection rather than promised outcomes.

export type JournalPost = {
  slug: string;
  labelEn: string;
  labelHi: string;
  titleEn: string;
  titleHi: string;
  excerptEn: string;
  excerptHi: string;
  bodyEn: string[];
  bodyHi: string[];
  keywords: string[];
};

export const journalPosts: JournalPost[] = [
  {
    slug: "laal-kitaab-remedies",
    labelEn: "Framework note",
    labelHi: "पद्धति नोट",
    titleEn: "What Laal Kitaab remedies are meant to do",
    titleHi: "लाल किताब के उपाय किस तरह मदद करते हैं",
    excerptEn: "A concise look at how traditional remedy prompts can become small, repeatable practices when paired with context and a calendar rhythm.",
    excerptHi: "जब पारंपरिक उपायों को संदर्भ और कैलेंडर की लय के साथ जोड़ा जाता है, तो वे छोटे और दोहराए जा सकने वाले अभ्यास बन सकते हैं।",
    bodyEn: [
      "Laal Kitaab is often discussed through simple, symbolic actions: an offering, a donation, a household practice, or a repeated act of attention. The useful starting point is not a promise of a fixed result. It is the question of how a small action can create a pause, a reminder, and a more deliberate response to a difficult season.",
      "A thoughtful remedy plan gives the action context. It explains what the practice is meant to reflect on, how often it is suggested, and how to review the experience without turning astrology into a guarantee. A calendar file can then place that action on days the person can realistically remember.",
      "BhavishyaShakti treats these practices as belief-based guidance. Outcomes vary, and any remedy should sit alongside practical decisions, professional advice where needed, and personal consent.",
    ],
    bodyHi: [
      "लाल किताब की चर्चा अक्सर सरल और प्रतीकात्मक कार्यों के माध्यम से होती है: अर्पण, दान, घर से जुड़ी कोई आदत या ध्यान का दोहराया गया अभ्यास। उपयोगी शुरुआत किसी निश्चित परिणाम के वादे से नहीं, बल्कि इस सवाल से होती है कि छोटा कदम किसी कठिन समय में विराम, याद और अधिक सोच-समझकर प्रतिक्रिया कैसे बना सकता है।",
      "एक अच्छी उपाय योजना हर कदम का संदर्भ देती है। वह बताती है कि अभ्यास किस बात पर चिंतन के लिए है, कितनी बार सुझाया गया है और बिना किसी गारंटी के अनुभव की समीक्षा कैसे की जा सकती है। कैलेंडर फाइल इस कदम को उन दिनों में रख सकती है जिन्हें व्यक्ति वास्तव में याद रख सके।",
      "भविष्यशक्ति इन अभ्यासों को विश्वास-आधारित मार्गदर्शन के रूप में देखता है। परिणाम अलग-अलग हो सकते हैं और किसी भी उपाय के साथ व्यावहारिक निर्णय, जरूरत पड़ने पर विशेषज्ञ सलाह और व्यक्तिगत सहमति जरूरी है।",
    ],
    keywords: ["Laal Kitaab remedies", "Lal Kitab astrology", "astrology remedies India", "लाल किताब उपाय"],
  },
  {
    slug: "vedic-astrology-career",
    labelEn: "Career clarity",
    labelHi: "करियर स्पष्टता",
    titleEn: "Using Vedic astrology as a reflection tool for career decisions",
    titleHi: "करियर निर्णयों के लिए वैदिक ज्योतिष को चिंतन के रूप में देखें",
    excerptEn: "The useful question is not only what a chart says, but which next action it helps you examine with patience and consistency.",
    excerptHi: "सवाल सिर्फ यह नहीं कि कुंडली क्या कहती है, बल्कि यह भी कि वह आपको धैर्य और निरंतरता के साथ कौन-सा अगला कदम देखने में मदद करती है।",
    bodyEn: [
      "Career decisions rarely arrive as a single yes-or-no moment. They are usually made from several smaller observations: energy, skills, responsibilities, timing, and the opportunities available in the present. Vedic astrology can be used as a reflective lens that helps a person name the questions they are already carrying.",
      "A useful career reading should translate that lens into grounded prompts. What skill deserves a deeper investment? Which conversation needs preparation? What should be reviewed at the end of a month? These questions do not replace career research or financial planning; they give the practice a structure for noticing patterns and choosing the next step.",
      "The strongest rhythm is usually modest: one weekly reflection, one practical action, and one monthly review. Calendar reminders make that rhythm visible, while a personalised report records why each action was chosen.",
    ],
    bodyHi: [
      "करियर से जुड़े निर्णय अक्सर एक ही हां या ना के क्षण में नहीं लिए जाते। वे ऊर्जा, कौशल, जिम्मेदारियों, समय और वर्तमान अवसरों जैसी कई छोटी बातों से बनते हैं। वैदिक ज्योतिष को एक चिंतन के लेंस की तरह इस्तेमाल किया जा सकता है, जो उन सवालों को नाम देने में मदद करे जिन्हें व्यक्ति पहले से लेकर चल रहा है।",
      "एक उपयोगी करियर रीडिंग इस लेंस को जमीन से जुड़े सवालों में बदलती है। किस कौशल में ज्यादा निवेश करना चाहिए? किस बातचीत की तैयारी जरूरी है? महीने के अंत में क्या समीक्षा करना है? ये सवाल करियर रिसर्च या वित्तीय योजना की जगह नहीं लेते; वे पैटर्न देखने और अगला कदम चुनने की एक संरचना देते हैं।",
      "सबसे मजबूत लय अक्सर छोटी होती है: हर सप्ताह एक चिंतन, एक व्यावहारिक कदम और हर महीने एक समीक्षा। कैलेंडर रिमाइंडर इस लय को सामने रखते हैं और व्यक्तिगत रिपोर्ट बताती है कि हर कदम क्यों चुना गया।",
    ],
    keywords: ["Vedic astrology career", "career astrology India", "career clarity remedies", "वैदिक ज्योतिष करियर"],
  },
  {
    slug: "calendar-remedy-rhythm",
    labelEn: "Practical rhythm",
    labelHi: "व्यावहारिक लय",
    titleEn: "Why a calendar can make a remedy easier to follow",
    titleHi: "कैलेंडर उपाय को निभाना आसान क्यों बनाता है",
    excerptEn: "Reminders create a visible place for practice. They turn an intention into a sequence of small actions you can review.",
    excerptHi: "रिमाइंडर अभ्यास के लिए एक स्पष्ट जगह बनाते हैं। वे संकल्प को छोटे, समीक्षा योग्य कदमों में बदलते हैं।",
    bodyEn: [
      "Many personal practices fail for a simple reason: they remain an intention without a place in the day. A calendar reminder does not create discipline on its own, but it removes one layer of friction. The person no longer has to remember what to do and when to begin.",
      "For a remedy plan, the calendar can hold different types of moments: a morning mantra, a weekly donation, a monthly reflection, or a reminder to review what felt sustainable. The goal is not to fill every day with ritual. It is to give the chosen actions a realistic rhythm.",
      "Calendar integration also makes the plan easier to discuss. A person can see the practice, adjust the timing, and keep the parts that fit their life. That is why BhavishyaShakti pairs a pointed report with a calendar file across the selected three, six, or twelve-month window.",
    ],
    bodyHi: [
      "कई व्यक्तिगत अभ्यास एक सरल कारण से छूट जाते हैं: वे संकल्प बने रहते हैं, दिनचर्या में उनकी जगह नहीं बनती। कैलेंडर रिमाइंडर अपने आप अनुशासन नहीं बनाता, लेकिन एक रुकावट कम कर देता है। व्यक्ति को हर बार यह याद नहीं करना पड़ता कि क्या करना है और कब शुरू करना है।",
      "उपाय योजना के कैलेंडर में अलग-अलग तरह के समय हो सकते हैं: सुबह का मंत्र, साप्ताहिक दान, मासिक चिंतन या यह देखने का रिमाइंडर कि कौन-सा अभ्यास टिकाऊ लगा। लक्ष्य हर दिन को अनुष्ठान से भरना नहीं, बल्कि चुने हुए कदमों को वास्तविक लय देना है।",
      "कैलेंडर इंटीग्रेशन योजना को समझना भी आसान बनाता है। व्यक्ति अभ्यास देख सकता है, समय बदल सकता है और अपनी जिंदगी में फिट होने वाले हिस्से रख सकता है। इसी वजह से भविष्यशक्ति चुनी हुई तीन, छह या बारह महीने की अवधि में स्पष्ट रिपोर्ट के साथ कैलेंडर फाइल देता है।",
    ],
    keywords: ["astrology calendar reminders", "remedy calendar India", "daily astrology remedies", "उपाय कैलेंडर"],
  },
];

export function getJournalPost(slug: string) {
  return journalPosts.find((post) => post.slug === slug);
}
