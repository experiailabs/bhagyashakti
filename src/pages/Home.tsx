import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { ArrowRight, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, Compass, FileText, Flame, Gem, Globe2, Instagram, LockKeyhole, Mail, MapPin, Menu, MessageCircle, Phone, Play, Share2, ShieldCheck, Sparkles, Sun, Target, X, Zap } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { trackEvent } from "@/lib/analytics";

/* Temple Ledger: ink-black stage, Bhavishya Saffron action cues, bilingual clarity, and a contemporary Indian ritual consultation desk. */

// ============================================================
// BACKEND / PAYMENT CONFIG
// ============================================================
// Base URL of the FastAPI backend (same backend that serves NaamShakti /
// CareerShakti). Set VITE_API_BASE_URL in your build environment if you
// want to override this per-environment; falls back to the known
// production API domain otherwise.
const API_BASE_URL = "https://naamshaktiapi.krishuai.com";

// Cashfree ORDER API flow (Payment Links is not approved on this
// account). The backend creates the order server-side and returns
// `payment_session_id`; the frontend loads the Cashfree JS SDK and opens
// Checkout with that session id. Set to "sandbox" while testing against
// a non-production backend.
const CASHFREE_MODE = "production";
const CASHFREE_SDK_URL = "https://sdk.cashfree.com/js/v3/cashfree.js";

// Lazily loads the Cashfree JS SDK once and resolves with the global
// `Cashfree` constructor. Safe to call multiple times — subsequent calls
// reuse the same in-flight/resolved promise.
let cashfreeSdkPromise: Promise<any> | null = null;
function loadCashfreeSdk(): Promise<any> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Cashfree SDK can only load in the browser."));
  }
  if ((window as any).Cashfree) {
    return Promise.resolve((window as any).Cashfree);
  }
  if (cashfreeSdkPromise) {
    return cashfreeSdkPromise;
  }
  cashfreeSdkPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CASHFREE_SDK_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve((window as any).Cashfree));
      existing.addEventListener("error", () => reject(new Error("Failed to load Cashfree SDK.")));
      return;
    }
    const script = document.createElement("script");
    script.src = CASHFREE_SDK_URL;
    script.async = true;
    script.onload = () => resolve((window as any).Cashfree);
    script.onerror = () => reject(new Error("Failed to load Cashfree SDK."));
    document.head.appendChild(script);
  });
  return cashfreeSdkPromise;
}

type Lang = "en" | "hi";
const c = {
  en: {
    nav: ["Frameworks", "Remedy plans", "Preview"], toggle: "हिंदी", begin: "Begin your reading", brandSub: "भविष्यशक्ति · right next move",
    heroKicker: "Personalised guidance · व्यक्तिगत मार्गदर्शन", heroLead: "Personalised astrology guidance for wealth, health, career and life decisions.", heroTitle: "Astrology remedy plans for your next right move.", heroBody: "Get a clear, personalised remedy plan built from Laal Kitaab, Vedic Astrology, timing cycles and more — then receive calendar reminders you can actually follow.", heroCta: "Get my remedy path", heroSecondary: "See how it works", stats: ["framework lenses", "clear objective", "small right actions"],
    strip: "One objective. One clear path. One month at a time.", madeFor: "Hindi + English · भारत के लिए बनाया गया", ideaKicker: "आज का संकेत · the idea", ideaTitle: "Astrology is a map. Consistency is the journey.", ideaBody: "We take the language of your birth details and turn it into a practical rhythm: what to do, when to do it, and how to remember.", build: "Build my rhythm", ritual: "ritual step", lensesKicker: "Choose your lens · अपनी पद्धति", lensesTitle: "Your path is personal. Your lens can be too.", lensesBody: "Pick the frameworks you want considered. We’ll explain which lens shaped each recommendation.", selected: "lenses selected", practiceKicker: "The practice · साधना", practiceTitle: "Small rituals, mapped to your goal.", practiceBody: "A good remedy plan should not sit in your inbox. It should show up on a day you can do it, in language you understand, with enough context to keep you committed.", practiceItems: ["Pooja, mantra & charity suggestions with purpose", "A 3 / 6 / 12-month plan with weekly focus", "Calendar file so the right actions stay visible", "Bilingual guidance that feels human, not cryptic"],
    storiesKicker: "Public journeys · प्रेरणा", storiesTitle: "Extraordinary lives are built from ordinary rituals.", storiesBody: "These are public success journeys, not customer testimonials and not claims of astrological causation. We borrow the useful idea: clarity plus consistency creates momentum.", publicStory: "public story", planKicker: "Choose your window · समय चुनें", planTitle: "Give your intention a time horizon.", planBody: "Every plan includes the personalized report and calendar file. Pick the duration that helps you stay honest with the practice.", noPromises: "No instant-fix promises. Just a clear plan, thoughtful guidance, and the next right action.", previewKicker: "See the outcome · अंदर की झलक", previewTitle: "Not just a report. A rhythm you can see.", previewBody: "Switch between the personalized action map and your calendar file. The preview reflects the selected objective and plan before you begin.", report: "Remedy report", calendar: "Calendar file", live: "live preview", whatChanges: "What changes", reportWhat: "A pointed reading, not a long generic PDF. You see the lens, the reason, and the action.", calendarWhat: "Small reminders at the moments that make consistency easier to keep.", reportBullets: ["Objective-first recommendations", "Remedies with context", "Clear do-this-next language"], calendarBullets: ["Scheduled action windows", "Repeatable weekly rhythm", "Monthly check-in prompts"], selectedPlan: "Selected plan",
    intakeKicker: "Your consultation · आपकी जानकारी", intakeTitle: "Let’s find the right next move.", intakeBody: "A four-step flow keeps the process calm: choose your focus, add birth details, tell us where to send the result, then review your path.", selectedPath: "Selected path", reportDeliverable: "Pointed, personalized remedy report", calendarDeliverable: "Calendar file for your selected duration", private: "Private, respectful handling of details", step: "Step", of: "of", goal: "Goal", birth: "Birth", contact: "Contact", review: "Review", chooseFocus: "Choose your focus", addBirth: "Add birth details", delivery: "Where should we send it?", reviewPath: "Review your path", chooseFocusHi: "अपना उद्देश्य चुनें", addBirthHi: "जन्म विवरण भरें", deliveryHi: "रिपोर्ट कहाँ भेजें?", reviewHi: "अपनी जानकारी जांचें", objective: "What do you want to shift?", objectiveHi: "आपका उद्देश्य", objectivePlaceholder: "Select your primary objective", frameworksOptional: "Choose your preferred frameworks", optional: "वैकल्पिक — optional", lensesHint: "lenses selected. You can change this later.", fullName: "Full name", fullNameHi: "पूरा नाम", dob: "Date of birth", dobHi: "जन्म तिथि", tob: "Time of birth", tobHi: "जन्म समय", pob: "Place of birth", pobHi: "जन्म स्थान", email: "Email address", emailHi: "ईमेल", phone: "Mobile number", phoneHi: "मोबाइल", city: "City, State, Country", emailPlaceholder: "you@email.com", phonePlaceholder: "+91 98765 43210", privacyStep: "We’ll use these details only for report delivery and relevant support updates.", selectedPathLabel: "Your selected path", objectiveLabel: "Objective", nameLabel: "Name", birthLabel: "Birth details", deliveryLabel: "Delivery", notSelected: "Not selected", notAdded: "Not added", back: "Back", continue: "Continue", captured: "Details captured — continue to checkout", continueWith: "Continue with", belief: "Astrology is belief-based guidance; outcomes vary. This is not medical, legal, or financial advice.", clearKicker: "Clear answers · आपके सवाल", clearTitle: "No smoke. Just clarity.", clearBody: "A few things worth knowing before you begin your reading.", ctaKicker: "आज ही अपनी दिशा चुनें · choose your direction", ctaTitle: "The stars can suggest. You decide.", choosePlan: "Choose my plan", faq: ["Is this a guaranteed prediction? / क्या यह पक्की भविष्यवाणी है?", "What will I receive after I purchase? / खरीदने के बाद क्या मिलेगा?", "Which frameworks are used? / कौन-सी पद्धतियाँ शामिल हैं?", "Will my birth details stay private? / क्या मेरी जानकारी सुरक्षित रहेगी?"], faqAnswers: ["No. BhavishyaShakti is belief-based guidance. It translates selected astrology frameworks into practical rituals, timing cues, and reflection prompts; outcomes vary from person to person.", "You receive a pointed personalized remedy report and a calendar file with actions mapped across your selected 3, 6, or 12-month window. Payment and delivery can be connected to your preferred production stack.", "Choose from Vedic Astrology, Laal Kitaab, Dasha and transit timing, Muhurta, Numerology, and a Vastu lens. The report explains which lenses shaped each recommendation.", "The design treats your details as private consultation data. Before launch, connect this flow to a consent-led secure backend and publish a clear privacy policy."],
  },
  hi: {
    nav: ["पद्धतियाँ", "उपाय योजनाएँ", "झलक"], toggle: "English", begin: "अपना रीडिंग शुरू करें", brandSub: "भविष्यशक्ति · अगला सही कदम",
    heroKicker: "व्यक्तिगत मार्गदर्शन · personalised guidance", heroLead: "धन, स्वास्थ्य, करियर और जीवन के निर्णयों के लिए व्यक्तिगत ज्योतिष मार्गदर्शन।", heroTitle: "आपके अगले सही कदम के लिए ज्योतिष उपाय योजना।", heroBody: "लाल किताब, वैदिक ज्योतिष, समय चक्र और अन्य पद्धतियों से बनी स्पष्ट, व्यक्तिगत उपाय योजना — साथ में ऐसे कैलेंडर रिमाइंडर जिन्हें आप सचमुच अपना सकें।", heroCta: "अपनी उपाय योजना पाएं", heroSecondary: "यह कैसे काम करता है", stats: ["पद्धति संकेत", "एक स्पष्ट उद्देश्य", "छोटे सही कदम"],
    strip: "एक उद्देश्य। एक स्पष्ट दिशा। हर महीने एक कदम।", madeFor: "हिंदी + अंग्रेज़ी · भारत के लिए बनाया गया", ideaKicker: "आज का संकेत · the idea", ideaTitle: "ज्योतिष एक नक्शा है। निरंतरता आपकी यात्रा है।", ideaBody: "हम आपकी जन्म जानकारी की भाषा को एक उपयोगी लय में बदलते हैं: क्या करना है, कब करना है और याद कैसे रखना है।", build: "अपनी लय बनाएं", ritual: "उपाय चरण", lensesKicker: "अपनी पद्धति चुनें · choose your lens", lensesTitle: "आपका रास्ता व्यक्तिगत है। पद्धति भी हो सकती है।", lensesBody: "वे पद्धतियाँ चुनें जिन्हें आप विचार में शामिल करना चाहते हैं। हर सुझाव के पीछे का आधार स्पष्ट रहेगा।", selected: "पद्धतियाँ चुनी गईं", practiceKicker: "साधना · the practice", practiceTitle: "छोटे उपाय, आपके उद्देश्य के साथ।", practiceBody: "अच्छी उपाय योजना आपके इनबॉक्स में पड़ी नहीं रहनी चाहिए। यह उस दिन सामने आए जब आप इसे कर सकें, आपकी भाषा में और पर्याप्त संदर्भ के साथ।", practiceItems: ["उद्देश्य के साथ पूजा, मंत्र और दान सुझाव", "साप्ताहिक फोकस वाली 3 / 6 / 12 महीने की योजना", "कैलेंडर फाइल ताकि सही कदम सामने रहें", "मानवीय हिंदी-अंग्रेज़ी मार्गदर्शन"],
    storiesKicker: "प्रेरणा · public journeys", storiesTitle: "असाधारण जीवन साधारण अनुशासन से बनते हैं।", storiesBody: "ये सार्वजनिक सफलता यात्राएँ हैं, ग्राहक प्रशंसापत्र नहीं और न ही ज्योतिषीय कारण का दावा। हम एक उपयोगी विचार लेते हैं: स्पष्टता और निरंतरता गति बनाती है।", publicStory: "सार्वजनिक यात्रा", planKicker: "समय चुनें · choose your window", planTitle: "अपने संकल्प को समय दें।", planBody: "हर योजना में व्यक्तिगत रिपोर्ट और कैलेंडर फाइल शामिल है। वह अवधि चुनें जो आपको अभ्यास में ईमानदार रखे।", noPromises: "तुरंत चमत्कार का वादा नहीं। बस स्पष्ट योजना, विचारशील मार्गदर्शन और अगला सही कदम।", previewKicker: "अंदर की झलक · see the outcome", previewTitle: "सिर्फ रिपोर्ट नहीं। एक दिखाई देने वाली लय।", previewBody: "व्यक्तिगत एक्शन मैप और कैलेंडर फाइल के बीच बदलें। झलक आपके उद्देश्य और योजना के साथ अपडेट होती है।", report: "उपाय रिपोर्ट", calendar: "कैलेंडर फाइल", live: "लाइव झलक", whatChanges: "क्या बदलेगा", reportWhat: "लंबी सामान्य PDF नहीं। पद्धति, कारण और अगला कदम साफ दिखेगा।", calendarWhat: "वे छोटे रिमाइंडर जो निरंतरता को आसान बनाते हैं।", reportBullets: ["उद्देश्य-आधारित सुझाव", "संदर्भ के साथ उपाय", "स्पष्ट अगला कदम"], calendarBullets: ["समयबद्ध उपाय", "साप्ताहिक लय", "मासिक समीक्षा संकेत"], selectedPlan: "चुनी योजना",
    intakeKicker: "आपकी जानकारी · your consultation", intakeTitle: "आइए अगला सही कदम खोजें।", intakeBody: "चार चरण प्रक्रिया को सहज रखते हैं: उद्देश्य चुनें, जन्म विवरण भरें, रिपोर्ट का पता दें और अपनी योजना जांचें।", selectedPath: "चुना रास्ता", reportDeliverable: "स्पष्ट व्यक्तिगत उपाय रिपोर्ट", calendarDeliverable: "चुनी अवधि की कैलेंडर फाइल", private: "जानकारी का निजी और सम्मानपूर्ण उपयोग", step: "चरण", of: "में से", goal: "उद्देश्य", birth: "जन्म", contact: "संपर्क", review: "जांचें", chooseFocus: "अपना उद्देश्य चुनें", addBirth: "जन्म विवरण भरें", delivery: "रिपोर्ट कहाँ भेजें?", reviewPath: "अपना रास्ता जांचें", chooseFocusHi: "Choose your focus", addBirthHi: "Add birth details", deliveryHi: "Where should we send it?", reviewHi: "Review your path", objective: "आप किस दिशा में बदलाव चाहते हैं?", objectiveHi: "what do you want to shift?", objectivePlaceholder: "अपना मुख्य उद्देश्य चुनें", frameworksOptional: "पसंदीदा पद्धतियाँ चुनें", optional: "optional — वैकल्पिक", lensesHint: "पद्धतियाँ चुनी गईं। बाद में बदल सकते हैं।", fullName: "पूरा नाम", fullNameHi: "full name", dob: "जन्म तिथि", dobHi: "date of birth", tob: "जन्म समय", tobHi: "time of birth", pob: "जन्म स्थान", pobHi: "place of birth", email: "ईमेल", emailHi: "email address", phone: "मोबाइल", phoneHi: "mobile number", city: "शहर, राज्य, देश", emailPlaceholder: "you@email.com", phonePlaceholder: "+91 98765 43210", privacyStep: "इन जानकारियों का उपयोग रिपोर्ट और जरूरी सहायता अपडेट भेजने के लिए होगा।", selectedPathLabel: "आपका चुना रास्ता", objectiveLabel: "उद्देश्य", nameLabel: "नाम", birthLabel: "जन्म विवरण", deliveryLabel: "डिलीवरी", notSelected: "चुना नहीं गया", notAdded: "दर्ज नहीं किया", back: "पीछे", continue: "आगे बढ़ें", captured: "जानकारी मिल गई — चेकआउट पर जाएं", continueWith: "आगे बढ़ें", belief: "ज्योतिष विश्वास-आधारित मार्गदर्शन है; परिणाम अलग हो सकते हैं। यह चिकित्सा, कानूनी या वित्तीय सलाह नहीं है।", clearKicker: "आपके सवाल · clear answers", clearTitle: "कोई धुंध नहीं। बस स्पष्टता।", clearBody: "रीडिंग शुरू करने से पहले कुछ जरूरी बातें।", ctaKicker: "अपनी दिशा चुनें · choose your direction", ctaTitle: "सितारे संकेत दे सकते हैं। फैसला आपका है।", choosePlan: "अपनी योजना चुनें", faq: ["क्या यह पक्की भविष्यवाणी है? / Is this a guaranteed prediction?", "खरीदने के बाद क्या मिलेगा? / What will I receive after I purchase?", "कौन-सी पद्धतियाँ शामिल हैं? / Which frameworks are used?", "क्या मेरी जानकारी सुरक्षित रहेगी? / Will my birth details stay private?"], faqAnswers: ["नहीं। भविष्यशक्ति विश्वास-आधारित मार्गदर्शन है। यह चुनी हुई पद्धतियों को व्यावहारिक उपाय, समय संकेत और चिंतन प्रश्नों में बदलता है; परिणाम व्यक्ति-व्यक्ति पर निर्भर करते हैं।", "आपको व्यक्तिगत उपाय रिपोर्ट और चुनी 3, 6 या 12 महीने की अवधि के अनुसार कैलेंडर फाइल मिलेगी। पेमेंट और डिलीवरी को आपके प्रोडक्शन सिस्टम से जोड़ा जा सकता है।", "वैदिक ज्योतिष, लाल किताब, दशा और गोचर, मुहूर्त, अंक ज्योतिष और वास्तु संकेत में से चुनें। रिपोर्ट बताएगी कि किस सुझाव का आधार क्या है।", "डिज़ाइन आपकी जानकारी को निजी परामर्श डेटा मानता है। लॉन्च से पहले इसे सुरक्षित सहमति-आधारित बैकएंड और स्पष्ट प्राइवेसी पॉलिसी से जोड़ें।"],
  },
} as const;

const frameworks = [
  { id: "vedic", icon: Sun, en: ["Vedic Astrology", "वैदिक ज्योतिष", "Kundli, graha strength & life themes"], hi: ["वैदिक ज्योतिष", "Vedic Astrology", "कुंडली, ग्रह शक्ति और जीवन संकेत"] },
  { id: "laal", icon: Flame, en: ["Laal Kitaab", "लाल किताब", "Simple, grounded daily remedies"], hi: ["लाल किताब", "Laal Kitaab", "सरल और उपयोगी दैनिक उपाय"] },
  { id: "dasha", icon: Clock3, en: ["Dasha + Transit", "दशा + गोचर", "Timing windows for the next move"], hi: ["दशा + गोचर", "Dasha + Transit", "अगले कदम के समय संकेत"] },
  { id: "muhurta", icon: CalendarDays, en: ["Muhurta", "मुहूर्त", "When to begin, sign, or act"], hi: ["मुहूर्त", "Muhurta", "शुरुआत और निर्णय का सही समय"] },
  { id: "numerology", icon: Gem, en: ["Numerology", "अंक ज्योतिष", "Supportive numbers, days & colours"], hi: ["अंक ज्योतिष", "Numerology", "सहायक अंक, दिन और रंग"] },
  { id: "vastu", icon: Compass, en: ["Vastu Lens", "वास्तु संकेत", "Space cues that support your objective"], hi: ["वास्तु संकेत", "Vastu Lens", "उद्देश्य के अनुकूल स्थान संकेत"] },
];
const ritualSteps = {
  en: [
    { num: "01", title: "Tell us what you want to shift", body: "We start with the one objective that matters most right now.", Icon: Target },
    { num: "02", title: "Read the patterns that support it", body: "Your details are viewed through the frameworks you choose.", Icon: Sun },
    { num: "03", title: "Practice the next right actions", body: "Remedies, timing cues and a calendar turn intention into routine.", Icon: CalendarDays },
  ],
  hi: [
    { num: "०१", title: "बताएं किस दिशा में बढ़ना है", body: "हम उस एक उद्देश्य से शुरुआत करते हैं जो अभी सबसे महत्वपूर्ण है।", Icon: Target },
    { num: "०२", title: "सहायक संकेतों को समझें", body: "आपकी जानकारी चुनी हुई पद्धतियों से समझी जाती है।", Icon: Sun },
    { num: "०३", title: "अगले सही कदमों का अभ्यास करें", body: "उपाय, समय संकेत और कैलेंडर संकल्प को आदत बनाते हैं।", Icon: CalendarDays },
  ],
} as const;
const plans = [
  { id: "3", months: "03", en: ["First Shift", "पहली दिशा", "Best for a focused 90-day reset: one immediate objective, weekly remedy reminders, and a short end-of-plan review."], hi: ["पहली दिशा", "First Shift", "केंद्रित 90-दिन की शुरुआत के लिए: एक तत्काल उद्देश्य, साप्ताहिक उपाय रिमाइंडर और अंत में छोटी समीक्षा।"], price: "399", old: "2,500", popular: false },
  { id: "6", months: "06", en: ["Steady Rise", "स्थिर प्रगति", "Most Popular for building consistency: one objective, weekly remedy actions, monthly check-ins, and a balanced calendar rhythm."], hi: ["स्थिर प्रगति", "Steady Rise", "निरंतरता बनाने के लिए सबसे लोकप्रिय: एक उद्देश्य, साप्ताहिक उपाय, मासिक समीक्षा और संतुलित कैलेंडर लय।"], price: "599", old: "3,500", popular: true },
  { id: "12", months: "12", en: ["Full Cycle", "पूरा चक्र", "Best for a full-year practice: deeper seasonal pacing, quarterly reviews, and a year-long calendar rhythm."], hi: ["पूरा चक्र", "Full Cycle", "पूरे साल के अभ्यास के लिए: गहरी मौसमी लय, तिमाही समीक्षा और पूरे वर्ष का कैलेंडर रिदम।"], price: "799", old: "5,000", popular: false },
];
type ObjectiveKey = "wealth" | "health" | "career" | "business" | "relationships" | "education";
type ObjectiveProfile = { label: string; description: string; action: string; calendar: string[]; reportBullets: string[]; calendarBullets: string[] };
const objectiveProfiles: Record<ObjectiveKey, { en: ObjectiveProfile; hi: ObjectiveProfile }> = {
  wealth: {
    en: { label: "Wealth increase & financial clarity", description: "A preview for financial focus: routines around disciplined saving, opportunity windows, gratitude, and grounded decision-making.", action: "Choose one weekly money habit and pair it with a simple Thursday reflection.", calendar: ["Weekly wealth reflection", "Thursday gratitude practice", "Monthly budget review"], reportBullets: ["Money-discipline routines", "Opportunity-timing prompts", "Grounded wealth actions"], calendarBullets: ["Weekly money check-ins", "Thursday practice reminders", "Monthly financial review"] },
    hi: { label: "धन वृद्धि और वित्तीय स्पष्टता", description: "वित्तीय फोकस की झलक: अनुशासित बचत, अवसर के समय, कृतज्ञता और संतुलित निर्णय की दिनचर्या।", action: "एक साप्ताहिक धन आदत चुनें और उसे गुरुवार की सरल समीक्षा से जोड़ें।", calendar: ["साप्ताहिक धन समीक्षा", "गुरुवार कृतज्ञता अभ्यास", "मासिक बजट समीक्षा"], reportBullets: ["धन-अनुशासन की दिनचर्या", "अवसर के समय संकेत", "व्यावहारिक धन कदम"], calendarBullets: ["साप्ताहिक धन जांच", "गुरुवार अभ्यास रिमाइंडर", "मासिक वित्तीय समीक्षा"] },
  },
  health: {
    en: { label: "Health improvement & wellbeing", description: "A wellbeing-focused preview: calming routines, sleep consistency, mindful movement, and gentle check-in prompts—not medical advice.", action: "Set one non-medical wellbeing ritual you can repeat at the same time each day.", calendar: ["Daily wellbeing pause", "Weekly rest check-in", "Monthly routine reset"], reportBullets: ["Rest and routine prompts", "Mindful wellbeing practices", "Gentle consistency cues"], calendarBullets: ["Daily pause reminders", "Weekly wellbeing check-ins", "Monthly routine reset"] },
    hi: { label: "स्वास्थ्य सुधार और कल्याण", description: "कल्याण-केंद्रित झलक: शांत दिनचर्या, नींद की निरंतरता, सजग गतिविधि और हल्के चेक-इन — चिकित्सा सलाह नहीं।", action: "एक गैर-चिकित्सीय कल्याण उपाय चुनें जिसे रोज़ एक ही समय पर दोहरा सकें।", calendar: ["दैनिक कल्याण विराम", "साप्ताहिक विश्राम जांच", "मासिक दिनचर्या रीसेट"], reportBullets: ["आराम और दिनचर्या संकेत", "सजग कल्याण अभ्यास", "निरंतरता के हल्के संकेत"], calendarBullets: ["दैनिक विराम रिमाइंडर", "साप्ताहिक कल्याण जांच", "मासिक दिनचर्या रीसेट"] },
  },
  career: {
    en: { label: "Career growth & promotion", description: "A career-focused preview: visibility, learning, communication, and timing prompts for your next professional move.", action: "Name one skill or conversation that would make your next opportunity easier to recognise.", calendar: ["Weekly career intention", "Learning block reminder", "Monthly visibility review"], reportBullets: ["Skill-building priorities", "Communication prompts", "Career timing reflections"], calendarBullets: ["Weekly career intentions", "Learning block reminders", "Monthly visibility reviews"] },
    hi: { label: "करियर वृद्धि और प्रमोशन", description: "करियर-केंद्रित झलक: पहचान, सीखने, संवाद और अगले पेशेवर कदम के समय संकेत।", action: "एक कौशल या बातचीत चुनें जिससे अगला अवसर आपको पहचानना आसान हो।", calendar: ["साप्ताहिक करियर संकल्प", "सीखने का समय", "मासिक पहचान समीक्षा"], reportBullets: ["कौशल-विकास प्राथमिकताएं", "संवाद के संकेत", "करियर समय समीक्षा"], calendarBullets: ["साप्ताहिक करियर संकल्प", "सीखने के रिमाइंडर", "मासिक पहचान समीक्षा"] },
  },
  business: {
    en: { label: "Business success & growth", description: "A business-focused preview: sharper priorities, client relationships, operational rhythm, and reflective decision points.", action: "Choose one business priority and give it a protected weekly review window.", calendar: ["Weekly priority review", "Client relationship touchpoint", "Monthly growth review"], reportBullets: ["Priority-setting rituals", "Client and team prompts", "Growth review checkpoints"], calendarBullets: ["Weekly priority windows", "Client touchpoint reminders", "Monthly growth reviews"] },
    hi: { label: "व्यापार सफलता और वृद्धि", description: "व्यापार-केंद्रित झलक: स्पष्ट प्राथमिकताएं, ग्राहक संबंध, संचालन की लय और विचारशील निर्णय बिंदु।", action: "एक व्यापार प्राथमिकता चुनें और उसके लिए हर सप्ताह सुरक्षित समीक्षा समय रखें।", calendar: ["साप्ताहिक प्राथमिकता समीक्षा", "ग्राहक संबंध संपर्क", "मासिक वृद्धि समीक्षा"], reportBullets: ["प्राथमिकता तय करने के उपाय", "ग्राहक और टीम संकेत", "वृद्धि समीक्षा बिंदु"], calendarBullets: ["साप्ताहिक प्राथमिकता समय", "ग्राहक संपर्क रिमाइंडर", "मासिक वृद्धि समीक्षा"] },
  },
  relationships: {
    en: { label: "Love, relationships & family", description: "A relationships-focused preview: listening, repair, boundaries, gratitude, and intentional time with the people who matter.", action: "Create one repeatable listening ritual before trying to solve the next difficult conversation.", calendar: ["Weekly listening practice", "Family gratitude note", "Monthly relationship check-in"], reportBullets: ["Listening and repair prompts", "Boundary-setting reflections", "Intentional connection cues"], calendarBullets: ["Weekly listening practice", "Gratitude note reminders", "Monthly relationship check-ins"] },
    hi: { label: "प्रेम, रिश्ते और परिवार", description: "रिश्तों-केंद्रित झलक: सुनना, सुधार, सीमाएं, कृतज्ञता और महत्वपूर्ण लोगों के साथ सार्थक समय।", action: "अगली कठिन बातचीत सुलझाने से पहले सुनने की एक दोहराई जा सकने वाली आदत बनाएं।", calendar: ["साप्ताहिक सुनने का अभ्यास", "परिवार कृतज्ञता संदेश", "मासिक रिश्ता समीक्षा"], reportBullets: ["सुनने और सुधार के संकेत", "सीमा तय करने की समीक्षा", "सार्थक जुड़ाव की आदत"], calendarBullets: ["साप्ताहिक सुनने का अभ्यास", "कृतज्ञता संदेश रिमाइंडर", "मासिक रिश्ता समीक्षा"] },
  },
  education: {
    en: { label: "Education, focus & exams", description: "An education-focused preview: study rhythm, focus cues, revision windows, and confidence-building reflection prompts.", action: "Protect one distraction-free study block and repeat it before adding more complexity.", calendar: ["Focused study block", "Weekly revision window", "Monthly learning review"], reportBullets: ["Study rhythm guidance", "Focus and revision prompts", "Confidence-building practices"], calendarBullets: ["Focused study reminders", "Weekly revision windows", "Monthly learning reviews"] },
    hi: { label: "शिक्षा, फोकस और परीक्षा", description: "शिक्षा-केंद्रित झलक: पढ़ाई की लय, फोकस संकेत, दोहराव का समय और आत्मविश्वास समीक्षा।", action: "एक बिना-विचलन पढ़ाई समय सुरक्षित करें और जटिलता बढ़ाने से पहले उसे दोहराएं।", calendar: ["एकाग्र पढ़ाई समय", "साप्ताहिक दोहराव", "मासिक सीख समीक्षा"], reportBullets: ["पढ़ाई की लय मार्गदर्शन", "फोकस और दोहराव संकेत", "आत्मविश्वास अभ्यास"], calendarBullets: ["एकाग्र पढ़ाई रिमाइंडर", "साप्ताहिक दोहराव समय", "मासिक सीख समीक्षा"] },
  },
};
function getObjectiveKey(objective: string): ObjectiveKey { const value = objective.toLowerCase(); if (value.includes("wealth") || value.includes("धन")) return "wealth"; if (value.includes("health") || value.includes("स्वास्थ्य")) return "health"; if (value.includes("career") || value.includes("करियर")) return "career"; if (value.includes("business") || value.includes("व्यापार")) return "business"; if (value.includes("love") || value.includes("relationship") || value.includes("रिश्ते") || value.includes("प्रेम")) return "relationships"; return "education"; }


// Maps frontend objective keys -> backend BhavishyashaktiCustomerCreate enum
// Backend accepts: 'career' | 'marriage' | 'health' | 'finance' | 'education' | 'relationship' | 'general'
const objectiveApiMap: Record<ObjectiveKey, string> = {
  wealth: "finance",
  health: "health",
  career: "career",
  business: "general",
  relationships: "relationship",
  education: "education",
};

// Maps frontend gender values -> backend enum
// Backend accepts: 'male' | 'female' | 'other' | 'prefer_not_to_say'
const genderApiMap: Record<string, string> = {
  woman: "female",
  man: "male",
  "non-binary": "other",
  "self-described": "other",
};

// TODO: fill in once you confirm the backend's valid framework slugs
// (run: grep -R -B5 -A20 "invalid framework" /root/naamshakti/app)
// Frontend keys are: vedic | laal | dasha | muhurta | numerology | vastu
const frameworkApiMap: Record<string, string> = {
  // vedic: "???",
  // laal: "???",
  // dasha: "???",
  // muhurta: "???",
  // numerology: "???",
  // vastu: "???",
};

type LuckyColor = { en: string; hi: string; hex: string; meaningEn: string; meaningHi: string };
const luckyColors: LuckyColor[] = [
  { en: "Saffron", hi: "केसरिया", hex: "#f28c28", meaningEn: "movement, confidence and a visible next step", meaningHi: "गति, आत्मविश्वास और अगला स्पष्ट कदम" },
  { en: "Deep Green", hi: "गहरा हरा", hex: "#46684b", meaningEn: "patience, grounding and steady growth", meaningHi: "धैर्य, स्थिरता और क्रमिक वृद्धि" },
  { en: "Indigo", hi: "नील", hex: "#39477a", meaningEn: "focus, reflection and clear choices", meaningHi: "फोकस, चिंतन और स्पष्ट निर्णय" },
  { en: "Rose", hi: "गुलाबी", hex: "#b85d68", meaningEn: "warmth, connection and self-kindness", meaningHi: "स्नेह, जुड़ाव और आत्म-सम्मान" },
  { en: "Ivory", hi: "आइवरी", hex: "#e6d7bd", meaningEn: "simplicity, reset and a clean page", meaningHi: "सरलता, नई शुरुआत और साफ दिशा" },
];
function deriveLuckyColor(dob: string) { const digits = dob.replace(/\D/g, ""); if (!digits) return null; const total = digits.split("").reduce((sum, digit) => sum + Number(digit), 0); return luckyColors[total % luckyColors.length]; }
function LuckyColorReveal({ lang, dob }: { lang: Lang; dob: string }) { const color = deriveLuckyColor(dob); if (!color) return null; return <div className="lucky-color-reveal" role="status" aria-live="polite"><span className="lucky-swatch" style={{ backgroundColor: color.hex }} /><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f28c28]">{lang === "en" ? "Your lucky color cue" : "आपका शुभ रंग संकेत"}</p><p className="bs-serif mt-1 text-2xl text-[#f7ede0]">{lang === "en" ? color.en : color.hi}</p><p className="mt-1 text-xs text-[#a79787]">{lang === "en" ? color.meaningEn : color.meaningHi}</p><p className="mt-3 text-[10px] leading-4 text-[#786d63]">{lang === "en" ? "A reflective, belief-based cue for your practice—not a guarantee." : "आपके अभ्यास के लिए विश्वास-आधारित संकेत—कोई गारंटी नहीं।"}</p></div><Sparkles className="ml-auto h-5 w-5 shrink-0 text-[#f28c28]" /></div>; }
type ActivityEvent = { city: string; plan: string; occurredAt: string };
// Connect this array to verified purchase events before launch. Empty by design: no fabricated social proof.
const verifiedPurchaseEvents: ActivityEvent[] = [];
type Intake = { name: string; gender: string; dob: string; tob: string; pob: string; objective: string; email: string; phone: string };
const emptyIntake: Intake = { name: "", gender: "", dob: "", tob: "", pob: "", objective: "", email: "", phone: "" };
function buildReportPayload(data: Intake, planId: string, lang: Lang, chosen: Record<string, boolean>) { return { ...data, gender: data.gender || null, selectedPlan: planId, language: lang, selectedFrameworks: Object.keys(chosen).filter((key) => chosen[key]) }; }

// Maps the intake form's free-form objective string + selected plan/
// frameworks into the shape the backend's BhavishyashaktiCheckoutRequest
// expects (see POST /public/bhavishyashakti/checkout in main.py).
function buildBhavishyashaktiCheckoutPayload(data: Intake, planId: string, chosen: Record<string, boolean>) {
  return {
    objective: objectiveApiMap[getObjectiveKey(data.objective)],
    frameworks: Object.keys(chosen)
      .filter((key) => chosen[key])
      .map((key) => frameworkApiMap[key])
      .filter(Boolean),
    name: data.name.trim(),
    gender: data.gender ? genderApiMap[data.gender] ?? "prefer_not_to_say" : "prefer_not_to_say",
    dob: data.dob,
    dob_time: data.tob,
    place_of_birth: data.pob.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    plan_duration_months: Number(planId),
  };
}

function go(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }
function Label({ children, hint, required = false }: { children: ReactNode; hint?: string; required?: boolean }) { return <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d6c6b3]">{children}{hint && <span className="ml-2 normal-case tracking-normal text-[#8f8174]">{hint}</span>}{required && <span className="ml-1 text-[#f28c28]">*</span>}</label>; }
function FieldFeedback({ error, valid, lang }: { error: string; valid: boolean; lang: Lang }) { if (error) return <p className="field-feedback field-error-text" role="alert">{error}</p>; if (valid) return <p className="field-feedback field-valid-text"><Check className="h-3 w-3" /> {lang === "en" ? "Looks good" : "सही है"}</p>; return null; }
function ActivityToast({ lang }: { lang: Lang }) { const [index, setIndex] = useState(0); useEffect(() => { if (!verifiedPurchaseEvents.length) return; const timer = window.setInterval(() => setIndex((value) => (value + 1) % verifiedPurchaseEvents.length), 9000); return () => window.clearInterval(timer); }, []); if (!verifiedPurchaseEvents.length) return null; const event = verifiedPurchaseEvents[index]; return <div className="activity-toast" role="status"><span className="activity-icon"><Check className="h-4 w-4" /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#f28c28]">{lang === "en" ? "Verified recent purchase" : "सत्यापित हाल की खरीद"}</p><p className="mt-1 text-xs text-[#f7ede0]">{event.city} · {event.plan}</p><p className="mt-1 text-[10px] text-[#8f8174]">{event.occurredAt}</p></div></div>; }
function AstroLoader({ lang }: { lang: Lang }) { return <div className="astro-loader" role="status" aria-live="polite"><div className="chakra-stage"><span className="chakra-ring ring-one" /><span className="chakra-ring ring-two" /><span className="chakra-core"><Sun className="h-5 w-5" /></span><i className="constellation-dot dot-one" /><i className="constellation-dot dot-two" /><i className="constellation-dot dot-three" /></div><p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#f2a85d]">{lang === "en" ? "Aligning your next step" : "आपके अगले कदम के संकेत जोड़ रहे हैं"}</p><p className="mt-2 text-[10px] text-[#8f8174]">{lang === "en" ? "One moment · आपकी दिशा खुल रही है" : "एक क्षण · your direction is opening"}</p></div>; }

type VideoTestimonial = {
  id: string;
  src: string;
  name: string;
  objectiveEn: string;
  objectiveHi: string;
  quoteEn: string;
  quoteHi: string;
};

// Local video testimonials served from /public/videos. Replace the
// placeholder names/objectives/quotes with the real details for each clip.
const videoTestimonials: VideoTestimonial[] = [
  { id: "1", src: "/videos/1.mp4", name: "Customer 1", objectiveEn: "Wealth focus", objectiveHi: "धन वृद्धि", quoteEn: "Watch the full story in the video.", quoteHi: "पूरी कहानी वीडियो में देखें।" },
  { id: "2", src: "/videos/2.mp4", name: "Customer 2", objectiveEn: "Career focus", objectiveHi: "करियर वृद्धि", quoteEn: "Watch the full story in the video.", quoteHi: "पूरी कहानी वीडियो में देखें।" },
  { id: "3", src: "/videos/3.mp4", name: "Customer 3", objectiveEn: "Health focus", objectiveHi: "स्वास्थ्य", quoteEn: "Watch the full story in the video.", quoteHi: "पूरी कहानी वीडियो में देखें।" },
  { id: "4", src: "/videos/4.mp4", name: "Customer 4", objectiveEn: "Relationships focus", objectiveHi: "रिश्ते", quoteEn: "Watch the full story in the video.", quoteHi: "पूरी कहानी वीडियो में देखें।" },
  { id: "5", src: "/videos/5.mp4", name: "Customer 5", objectiveEn: "Business focus", objectiveHi: "व्यापार", quoteEn: "Watch the full story in the video.", quoteHi: "पूरी कहानी वीडियो में देखें।" },
  { id: "6", src: "/videos/6.mp4", name: "Customer 6", objectiveEn: "Education focus", objectiveHi: "शिक्षा", quoteEn: "Watch the full story in the video.", quoteHi: "पूरी कहानी वीडियो में देखें।" },
];

function VideoTestimonialCard({ lang, story, onPlay }: { lang: Lang; story: VideoTestimonial; onPlay: () => void }) {
  return (
    <article className="group relative h-full overflow-hidden border border-[#be7e4b]/25 bg-[#100d0b]">
      <button
        type="button"
        onClick={onPlay}
        className="relative block aspect-[9/13] w-full overflow-hidden"
        aria-label={lang === "en" ? `Play video story: ${story.name}` : `वीडियो कहानी चलाएं: ${story.name}`}
      >
        <video
          src={`${story.src}#t=0.5`}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/10 to-transparent" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-[#f28c28]/60 bg-[#0a0908]/70 text-[#f28c28] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#f28c28] group-hover:text-[#0a0908]">
            <Play className="ml-1 h-5 w-5 fill-current" />
          </span>
        </div>
        <span className="absolute left-3 top-3 flex items-center gap-1.5 border border-[#f28c28]/40 bg-[#0a0908]/75 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#f2a85d] backdrop-blur-sm">
          <Sparkles className="h-3 w-3" /> {lang === "en" ? "Video story" : "वीडियो कहानी"}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-4 text-left">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#f2a85d]">
            {lang === "en" ? story.objectiveEn : story.objectiveHi}
          </p>
         
          <p className="mt-1 line-clamp-1 text-xs text-[#c9b8a6]">
            {lang === "en" ? story.quoteEn : story.quoteHi}
          </p>
        </div>
      </button>
    </article>
  );
}

function VideoTestimonialCarousel({ lang }: { lang: Lang }) {
  const [active, setActive] = useState<VideoTestimonial | null>(null);

  return (
    <section id="stories" className="border-y border-[#f28c28]/10 bg-[#0e0c0b] py-24 lg:py-28">
      <div className="bs-shell">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <div className="eyebrow">
              <span /> {lang === "en" ? "Verified journeys · सत्यापित यात्राएँ" : "सत्यापित यात्राएँ · verified journeys"}
            </div>
            <h2 className="bs-serif max-w-[540px] text-5xl font-semibold leading-[0.95] sm:text-6xl">
              {lang === "en" ? "Trust is built in the open." : "विश्वास स्पष्टता से बनता है।"}
            </h2>
          </div>
          <p className="max-w-[530px] text-sm leading-7 text-[#a79787]">
            {lang === "en"
              ? "Real people, real context, in their own words."
              : "वास्तविक लोग, वास्तविक संदर्भ, अपने ही शब्दों में।"}
          </p>
        </div>

        <div className="relative mt-12">
          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent>
              {videoTestimonials.map((story) => (
                <CarouselItem key={story.id} className="sm:basis-1/2 lg:basis-1/4">
                  <VideoTestimonialCard lang={lang} story={story} onPlay={() => setActive(story)} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 border-[#a34f13]/35 bg-[#f8efe5] text-[#a34f13]" />
            <CarouselNext className="-right-4 border-[#a34f13]/35 bg-[#f8efe5] text-[#a34f13]" />
          </Carousel>
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#0a0908]/90 p-5"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-sm border border-[#f28c28]/35 bg-[#120e0b] p-3"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center border border-[#f28c28]/40 bg-[#0a0908]/70 text-[#f28c28]"
              aria-label={lang === "en" ? "Close video" : "वीडियो बंद करें"}
            >
              <X className="h-4 w-4" />
            </button>
            <video controls autoPlay playsInline className="aspect-[9/13] w-full bg-black" src={active.src}>
              {lang === "en" ? "Your browser does not support video." : "आपका ब्राउज़र वीडियो सपोर्ट नहीं करता।"}
            </video>
            <div className="mt-3 px-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#f2a85d]">
                {lang === "en" ? active.objectiveEn : active.objectiveHi}
              </p>
              <h3 className="bs-serif mt-1 text-2xl text-[#f7ede0]">{active.name}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ReportCard({ lang, profile }: { lang: Lang; profile: (typeof objectiveProfiles)["career"]["en"] }) {
  const steps =
    lang === "en" ? ["notice", "practice", "review"] : ["ध्यान", "अभ्यास", "समीक्षा"];

  return (
    <div className="h-full border border-[#f28c28]/20 bg-[#f4e8da] p-5 text-[#211713]">
      <div className="flex items-start justify-between border-b border-[#9b6b48]/25 pb-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#bc5e14]">
            BhavishyaShakti · private reading
          </p>
          <h3 className="bs-serif mt-2 text-3xl font-semibold">
            {lang === "en" ? "Your action map" : "आपका एक्शन मैप"}
          </h3>
        </div>
        <Sun className="h-5 w-5 text-[#bc5e14]" />
      </div>

      <p className="mt-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b6046]">
        <Target className="h-3.5 w-3.5" /> {lang === "en" ? "Focus" : "उद्देश्य"}: {profile.label}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {steps.map((step, index) => (
          <div key={step} className="border border-[#bc5e14]/30 bg-[#bc5e14]/10 p-3">
            <span className="bs-serif text-2xl text-[#bc5e14]">0{index + 1}</span>
            <small className="mt-2 block text-[9px]">{step}</small>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-[#9b6b48]/25 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#bc5e14]">
          {lang === "en" ? "Your first right action" : "आपका पहला सही कदम"}
        </p>
        <p className="bs-serif mt-1 text-xl">{profile.action}</p>
      </div>
    </div>
  );
}

function CalendarCard({
  lang,
  planLabel,
  profile,
}: {
  lang: Lang;
  planLabel: string;
  profile: (typeof objectiveProfiles)["career"]["en"];
}) {
  return (
    <div className="h-full border border-[#f28c28]/20 bg-[#15110f] p-5 text-[#f7ede0]">
      <div className="flex items-start justify-between border-b border-[#f28c28]/20 pb-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#f28c28]">
            .ics calendar file
          </p>
          <h3 className="bs-serif mt-2 text-3xl font-semibold">
            {lang === "en" ? "Your ritual rhythm" : "आपकी उपाय लय"}
          </h3>
        </div>
        <CalendarDays className="h-5 w-5 text-[#f28c28]" />
      </div>

      <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-[#988b7c]">
        {planLabel} · {profile.label}
      </p>

      <div className="mt-5 space-y-3">
        {profile.calendar.map((event, index) => (
          <div key={event} className="flex items-center gap-3 border-b border-[#f28c28]/10 pb-3">
            <span
              className={`grid h-7 w-7 place-items-center text-[10px] font-bold ${
                index === 1 ? "bg-[#f28c28] text-[#0a0908]" : "border border-[#f28c28]/30 text-[#f2a85d]"
              }`}
            >
              0{index + 1}
            </span>
            <span className="text-xs text-[#d8c8b7]">{event}</span>
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#f28c28]" />
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 text-[10px] text-[#8f8174]">
        <LockKeyhole className="h-3 w-3 text-[#f28c28]" />
        {lang === "en" ? "Ready to add to your calendar" : "कैलेंडर में जोड़ने के लिए तैयार"}
      </div>
    </div>
  );
}

function Preview({ lang, planId, objective }: { lang: Lang; planId: string; objective: string }) {
  const l = c[lang];
  const [view, setView] = useState<"report" | "calendar">("report");

  const plan = plans.find((item) => item.id === planId) ?? plans[1];
  const fields = plan[lang];
  const profile = objective
    ? objectiveProfiles[getObjectiveKey(objective)][lang]
    : objectiveProfiles.career[lang];

  const isReport = view === "report";
  const bullets = isReport ? profile.reportBullets : profile.calendarBullets;

  return (
    <section id="deliverables" className="border-y border-[#f28c28]/10 bg-[#0e0c0b] py-24 lg:py-28">
      <div className="bs-shell">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          {/* Left column: heading + description */}
          <div>
            <div className="eyebrow">
              <span /> {l.previewKicker}
            </div>
            <h2 className="bs-serif max-w-[500px] text-5xl font-semibold leading-[0.95] sm:text-6xl">
              {l.previewTitle}
            </h2>
            <p className="mt-6 max-w-[430px] text-sm leading-7 text-[#a79787]">{l.previewBody}</p>
            <p className="mt-4 max-w-[470px] border-l-2 border-[#f28c28] pl-4 text-sm leading-6 text-[#f2a85d]">
              {profile.description}
            </p>
          </div>

          {/* Right column: tabs + preview cards */}
          <div>
            <div className="flex flex-wrap gap-2 border-b border-[#f28c28]/20 pb-4">
              <button
                type="button"
                onClick={() => setView("report")}
                className={`tab-btn ${isReport ? "tab-active" : ""}`}
              >
                <FileText className="h-3.5 w-3.5" /> {l.report}
              </button>
              <button
                type="button"
                onClick={() => setView("calendar")}
                className={`tab-btn ${!isReport ? "tab-active" : ""}`}
              >
                <CalendarDays className="h-3.5 w-3.5" /> {l.calendar}
              </button>
              <span className="ml-auto self-center text-[10px] uppercase tracking-[0.16em] text-[#8f8174]">
                {l.live}
              </span>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-[1fr_0.85fr]">
              <div className="min-h-[285px] border border-[#f28c28]/30 bg-[#16110d] p-5">
                {isReport ? (
                  <ReportCard lang={lang} profile={profile} />
                ) : (
                  <CalendarCard lang={lang} planLabel={fields[0]} profile={profile} />
                )}
              </div>

              <div className="border border-[#f28c28]/15 bg-[#130f0d] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f28c28]">
                    {l.whatChanges}
                  </span>
                  <Sparkles className="h-4 w-4 text-[#f28c28]" />
                </div>

                <p className="mt-5 text-sm leading-6 text-[#c9b8a6]">
                  {isReport ? l.reportWhat : l.calendarWhat}
                </p>

                <div className="mt-6 space-y-3">
                  {bullets.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs text-[#948477]">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#f28c28]" /> {item}
                    </div>
                  ))}
                </div>

                <div className="mt-7 border-t border-[#f28c28]/15 pt-4">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#7e7368]">{l.selectedPlan}</p>
                  <p className="bs-serif mt-1 text-2xl text-[#f28c28]">
                    {fields[0]} · ₹{plan.price}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function CheckoutSummaryModal({ lang, open, onOpenChange, plan, onContinue }: { lang: Lang; open: boolean; onOpenChange: (open: boolean) => void; plan: (typeof plans)[number]; onContinue: () => void }) { const pair = plan[lang]; const [remaining, setRemaining] = useState(15 * 60); useEffect(() => { if (!open) return; setRemaining(15 * 60); const timer = window.setInterval(() => setRemaining((current) => Math.max(0, current - 1)), 1000); return () => window.clearInterval(timer); }, [open]); const minutes = String(Math.floor(remaining / 60)).padStart(2, "0"); const seconds = String(remaining % 60).padStart(2, "0"); const timerComplete = remaining === 0; return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="border-[#f28c28]/35 bg-[#120e0b] text-[#f7ede0] sm:max-w-lg"><DialogHeader><DialogTitle className="bs-serif text-4xl font-semibold">{lang === "en" ? "Your remedy path, at a glance." : "आपकी उपाय योजना, एक नज़र में।"}</DialogTitle><DialogDescription className="text-[#a79787]">{lang === "en" ? "Review your selected plan and everything prepared for execution before continuing." : "आगे बढ़ने से पहले अपनी चुनी योजना और डिलीवरी विवरण देखें।"}</DialogDescription></DialogHeader><div className="flex items-center justify-between gap-4 border border-[#f28c28]/30 bg-[#f28c28]/10 px-4 py-3"><div className="flex items-center gap-3"><Clock3 className="h-4 w-4 text-[#f28c28]" /><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f2a85d]">{timerComplete ? (lang === "en" ? "Session reminder complete" : "सेशन रिमाइंडर पूरा हुआ") : (lang === "en" ? "Session reminder" : "सेशन रिमाइंडर")}</p><p className="mt-1 text-xs text-[#b9aa99]">{timerComplete ? (lang === "en" ? "You can still review this discounted plan." : "आप अभी भी इस रियायती योजना को देख सकते हैं।") : (lang === "en" ? "Take a moment to review your discounted plan." : "रियायती योजना की समीक्षा के लिए थोड़ा समय लें।")}</p></div></div><span className="bs-serif shrink-0 text-3xl text-[#f28c28]" aria-label={lang === "en" ? `${minutes} minutes ${seconds} seconds remaining` : `${minutes} मिनट ${seconds} सेकंड शेष`}>{minutes}:{seconds}</span></div><p className="text-[10px] leading-4 text-[#786d63]">{lang === "en" ? "This is a transparent session reminder, not a claim that the offer expires when the timer reaches zero." : "यह एक पारदर्शी सेशन रिमाइंडर है; टाइमर शून्य होने पर ऑफर समाप्त होने का दावा नहीं है।"}</p><div className="border border-[#f28c28]/25 bg-[#1a120d] p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f28c28]">{plan.months} {lang === "en" ? "month remedy plan" : "महीने की उपाय योजना"}</p><p className="bs-serif mt-2 text-3xl">{pair[0]}</p><p className="mt-1 text-xs text-[#c9863b]">{pair[1]}</p></div><span className="bs-serif text-3xl text-[#f28c28]">₹{plan.price}</span></div><div className="mt-6 space-y-3 border-t border-[#f28c28]/15 pt-5 text-sm text-[#d8c8b7]"><div className="flex items-start gap-3"><FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#f28c28]" /><span>{lang === "en" ? "Pointed, personalised remedy report" : "स्पष्ट व्यक्तिगत उपाय रिपोर्ट"}</span></div><div className="flex items-start gap-3"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#f28c28]" /><span>{lang === "en" ? "Calendar integration file for remedy reminders" : "उपाय रिमाइंडर के लिए कैलेंडर इंटीग्रेशन फाइल"}</span></div><div className="flex items-start gap-3"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-[#f28c28]" /><span>{lang === "en" ? "Bilingual guidance with selected frameworks" : "चुनी हुई पद्धतियों के साथ हिंदी-अंग्रेज़ी मार्गदर्शन"}</span></div></div></div><p className="text-xs leading-5 text-[#8f8174]">{lang === "en" ? "The calendar file is designed to help you add remedy reminders to your preferred calendar app. Final checkout and delivery automation can be connected before launch." : "कैलेंडर फाइल आपके पसंदीदा कैलेंडर ऐप में उपाय रिमाइंडर जोड़ने में मदद करने के लिए है। अंतिम चेकआउट और डिलीवरी ऑटोमेशन लॉन्च से पहले जोड़ा जा सकता है।"}</p><DialogFooter><button type="button" onClick={() => onOpenChange(false)} className="border border-[#4b3d33] px-4 py-3 text-sm text-[#a79787]">{lang === "en" ? "Keep browsing" : "वापस देखें"}</button><div className="flex items-center gap-2"><Tooltip><TooltipTrigger asChild><button type="button" aria-label={lang === "en" ? "Secure checkout information" : "सुरक्षित चेकआउट जानकारी"} className="grid h-10 w-10 place-items-center border border-[#f28c28]/30 text-[#f2a85d]"><ShieldCheck className="h-4 w-4" /></button></TooltipTrigger><TooltipContent side="top" className="max-w-[220px] border-[#f28c28]/30 bg-[#1a120d] text-xs leading-5 text-[#f7ede0]">{lang === "en" ? "Secure checkout guidance: payment details should be handled by your connected payment provider." : "सुरक्षित चेकआउट: भुगतान विवरण आपके जुड़े हुए भुगतान प्रदाता द्वारा संभाले जाने चाहिए।"}</TooltipContent></Tooltip><button type="button" onClick={onContinue} className="bg-[#f28c28] px-5 py-3 text-sm font-bold text-[#0a0908]">{lang === "en" ? "Continue to my path" : "अपनी योजना पर जाएं"} <ArrowRight className="ml-2 inline h-4 w-4" /></button></div></DialogFooter></DialogContent></Dialog>; }
function CalendarMockup({ lang }: { lang: Lang }) { const rows = lang === "en" ? [{ day: "TODAY · 07:00", title: "Surya mantra + water offering", tone: "saffron" }, { day: "THU · 18:30", title: "Wealth reflection · 10 min", tone: "gold" }, { day: "SUN · 09:00", title: "Weekly remedy check-in", tone: "muted" }] : [{ day: "आज · 07:00", title: "सूर्य मंत्र + जल अर्पण", tone: "saffron" }, { day: "गुरु · 18:30", title: "धन समीक्षा · १० मिनट", tone: "gold" }, { day: "रवि · 09:00", title: "साप्ताहिक उपाय समीक्षा", tone: "muted" }]; const weekdays = ["M", "T", "W", "T", "F", "S", "S"]; return <section className="border-y border-[#f28c28]/10 bg-[#0e0c0b] py-20 lg:py-24"><div className="bs-shell grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"><div><div className="eyebrow"><span /> {lang === "en" ? "Calendar integration · कैलेंडर" : "कैलेंडर इंटीग्रेशन · calendar"}</div><h2 className="bs-serif max-w-[500px] text-5xl font-semibold leading-[0.95] sm:text-6xl">{lang === "en" ? "Your remedy should meet you on the day." : "आपका उपाय उसी दिन सामने आए।"}</h2><p className="mt-6 max-w-[470px] text-sm leading-7 text-[#a79787]">{lang === "en" ? "A visual preview of the daily rhythm included with your selected plan: one clear action, one reminder, one step at a time." : "चुनी योजना के साथ मिलने वाली दैनिक लय की झलक: एक स्पष्ट कदम, एक रिमाइंडर, हर दिन एक दिशा।"}</p><div className="mt-7 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f2a85d]"><span className="border border-[#f28c28]/25 px-3 py-2">{lang === "en" ? "Google Calendar" : "गूगल कैलेंडर"}</span><span className="border border-[#f28c28]/25 px-3 py-2">{lang === "en" ? "Apple Calendar" : "एप्पल कैलेंडर"}</span><span className="border border-[#f28c28]/25 px-3 py-2">{lang === "en" ? "Outlook" : "आउटलुक"}</span></div></div><div className="mx-auto w-full max-w-[330px] rounded-[2.4rem] border-4 border-[#49362a] bg-[#070606] p-2 shadow-[0_30px_90px_rgba(0,0,0,0.45)]"><div className="rounded-[2rem] border border-[#f28c28]/20 bg-[#15100d] px-4 pb-6 pt-3"><div className="mx-auto mb-5 h-1 w-16 rounded-full bg-[#5a4436]" /><div className="flex items-center justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#f28c28]">{lang === "en" ? "Your ritual calendar" : "आपका उपाय कैलेंडर"}</p><p className="bs-serif mt-1 text-2xl text-[#f7ede0]">{lang === "en" ? "August rhythm" : "अगस्त की लय"}</p></div><CalendarDays className="h-5 w-5 text-[#f28c28]" /></div><div className="mt-5 grid grid-cols-7 gap-1 text-center text-[9px] text-[#786d63]">{weekdays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div><div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] text-[#c9b8a6]">{Array.from({ length: 14 }, (_, index) => <span key={index} className={`grid h-6 place-items-center ${[2, 5, 9].includes(index) ? "bg-[#f28c28] font-bold text-[#0a0908]" : ""}`}>{index + 1}</span>)}</div><div className="mt-5 space-y-2">{rows.map((row, index) => <div key={`${row.day}-${index}`} className={`border-l-2 p-3 ${row.tone === "saffron" ? "border-[#f28c28] bg-[#f28c28]/10" : row.tone === "gold" ? "border-[#bc5e14] bg-[#bc5e14]/10" : "border-[#5a4436] bg-[#211813]"}`}><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#f2a85d]">{row.day}</p><p className="mt-1 text-xs text-[#e3d6c6]">{row.title}</p></div>)}</div><p className="mt-5 text-center text-[9px] uppercase tracking-[0.14em] text-[#786d63]">{lang === "en" ? "Tap to mark complete" : "पूरा होने पर टैप करें"}</p></div></div></div></section>; }
function PricingFAQ({ lang }: { lang: Lang }) { const [open, setOpen] = useState<number | null>(0); const copy = c[lang]; return <section id="pricing-faq" className="border-t border-[#f28c28]/10 bg-[#11100e] py-20 lg:py-24"><div className="bs-shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr]"><div><div className="eyebrow"><span /> {lang === "en" ? "Before checkout · चेकआउट से पहले" : "चेकआउट से पहले · before checkout"}</div><h2 className="bs-serif max-w-[430px] text-5xl font-semibold leading-[0.95] sm:text-6xl">{lang === "en" ? "Clear answers before you commit." : "आगे बढ़ने से पहले स्पष्ट उत्तर।"}</h2><p className="mt-6 max-w-[380px] text-sm leading-7 text-[#a79787]">{lang === "en" ? "Understand the remedies, report delivery, and calendar integration in a few calm clicks." : "उपाय, रिपोर्ट डिलीवरी और कैलेंडर इंटीग्रेशन को कुछ आसान क्लिक में समझें।"}</p></div><div className="border-t border-[#f28c28]/20">{copy.faq.map((question, index) => <div key={question} className="border-b border-[#f28c28]/20"><button type="button" onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index} className="flex w-full items-center justify-between gap-5 py-5 text-left text-sm font-semibold text-[#f7ede0]"><span>{question}</span><ChevronDown className={`h-4 w-4 shrink-0 text-[#f28c28] transition-transform ${open === index ? "rotate-180" : ""}`} /></button>{open === index && <p className="max-w-[720px] pb-5 text-sm leading-6 text-[#988a7d]">{copy.faqAnswers[index]}</p>}</div>)}</div></div></section>; }

function GenderField({ lang, value, onChange }: { lang: Lang; value: string; onChange: (value: string) => void }) { return <section className="bs-shell border-y border-[#f28c28]/10 bg-[#11100e] py-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f28c28]">{lang === "en" ? "Optional profile detail" : "वैकल्पिक प्रोफ़ाइल जानकारी"}</p><p className="mt-1 text-xs text-[#8f8174]">{lang === "en" ? "Add gender if you would like it considered in your personalised reading." : "यदि आप चाहें तो व्यक्तिगत रीडिंग में जेंडर को ध्यान में रखने के लिए जोड़ें।"}</p></div><select value={value} onChange={(event) => onChange(event.target.value)} aria-label={lang === "en" ? "Optional gender" : "वैकल्पिक जेंडर"} className="bs-input max-w-full sm:w-[220px]"><option value="">{lang === "en" ? "Prefer not to say" : "बताना नहीं चाहेंगे"}</option><option value="woman">{lang === "en" ? "Woman" : "महिला"}</option><option value="man">{lang === "en" ? "Man" : "पुरुष"}</option><option value="non-binary">{lang === "en" ? "Non-binary" : "नॉन-बाइनरी"}</option><option value="self-described">{lang === "en" ? "Self-described" : "स्व-वर्णित"}</option></select></div></section>; }
function GenderReviewSummary({ lang, gender }: { lang: Lang; gender: string }) { return <section className="bs-shell border-y border-[#f28c28]/10 bg-[#15110f] py-4"><div className="flex items-center justify-between gap-4 text-sm"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f28c28]">{lang === "en" ? "Birth details review" : "जन्म विवरण समीक्षा"}</p><p className="mt-1 text-xs text-[#8f8174]">{lang === "en" ? "Gender preference included in the report brief" : "रिपोर्ट ब्रीफ में जेंडर प्राथमिकता शामिल है"}</p></div><span className="border border-[#f28c28]/25 px-3 py-2 text-xs text-[#f2a85d]">{gender || (lang === "en" ? "Prefer not to say" : "बताना नहीं चाहेंगे")}</span></div></section>; }

function BirthGenderField({ lang, value, onChange }: { lang: Lang; value: string; onChange: (value: string) => void }) { const [host, setHost] = useState<HTMLElement | null>(null); useEffect(() => { const nameField = document.querySelector<HTMLElement>('#intake input:not([type="date"]):not([type="time"]):not([type="tel"]):not([type="email"])')?.parentElement; setHost(nameField ?? null); return () => setHost(null); }, []); if (!host) return null; return createPortal(<div className="mt-4 border-t border-[#f28c28]/15 pt-4"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><Label hint={lang === "en" ? "Optional · Gender" : "वैकल्पिक · जेंडर"}>{lang === "en" ? "Gender" : "जेंडर"}</Label><p className="mt-1 text-[10px] text-[#786d63]">{lang === "en" ? "Used only if you want it considered in your personalised reading." : "केवल आपकी इच्छा पर व्यक्तिगत रीडिंग में ध्यान में रखा जाएगा।"}</p></div><select value={value} onChange={(event) => onChange(event.target.value)} aria-label={lang === "en" ? "Optional gender" : "वैकल्पिक जेंडर"} className="bs-input sm:max-w-[220px]"><option value="">{lang === "en" ? "Prefer not to say" : "बताना नहीं चाहेंगे"}</option><option value="woman">{lang === "en" ? "Woman" : "महिला"}</option><option value="man">{lang === "en" ? "Man" : "पुरुष"}</option><option value="non-binary">{lang === "en" ? "Non-binary" : "नॉन-बाइनरी"}</option><option value="self-described">{lang === "en" ? "Self-described" : "स्व-वर्णित"}</option></select></div></div>, host); }

function EnhancedBirthGenderField({ lang, value, onChange }: { lang: Lang; value: string; onChange: (value: string) => void }) { const [host, setHost] = useState<HTMLElement | null>(null); useEffect(() => { const nameField = document.querySelector<HTMLElement>('#intake input:not([type="date"]):not([type="time"]):not([type="tel"]):not([type="email"])')?.parentElement; setHost(nameField ?? null); return () => setHost(null); }, []); if (!host) return null; return createPortal(<div className="mt-4 border-t border-[#f28c28]/15 pt-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><Label hint={lang === "en" ? "Optional · Gender" : "वैकल्पिक · जेंडर"}>{lang === "en" ? "Gender" : "जेंडर"}</Label><p className="mt-1 text-[10px] text-[#786d63]">{lang === "en" ? "Used only if you want it considered in your personalised reading." : "केवल आपकी इच्छा पर व्यक्तिगत रीडिंग में ध्यान में रखा जाएगा।"}</p><p className="mt-2 flex items-start gap-1.5 text-[10px] leading-4 text-[#8f8174]"><LockKeyhole className="mt-0.5 h-3 w-3 shrink-0 text-[#f28c28]" /> {lang === "en" ? "Your preference is kept private and used only for your requested reading." : "आपकी पसंद निजी रखी जाती है और केवल आपकी रीडिंग के लिए उपयोग होती है।"}</p></div><select value={value} onChange={(event) => onChange(event.target.value)} aria-label={lang === "en" ? "Optional gender" : "वैकल्पिक जेंडर"} className={`bs-input sm:max-w-[220px] transition-all duration-300 ${value ? "gender-select-active" : ""}`}><option value="">{lang === "en" ? "Prefer not to say" : "बताना नहीं चाहेंगे"}</option><option value="woman">{lang === "en" ? "Woman" : "महिला"}</option><option value="man">{lang === "en" ? "Man" : "पुरुष"}</option><option value="non-binary">{lang === "en" ? "Non-binary" : "नॉन-बाइनरी"}</option><option value="self-described">{lang === "en" ? "Self-described" : "स्व-वर्णित"}</option></select></div></div>, host); }

export default function Home() {
  const [lang, setLang] = useState<Lang>("en"); const l = c[lang]; const [planId, setPlanId] = useState("6"); const [checkoutOpen, setCheckoutOpen] = useState(false); const [faq, setFaq] = useState(0); const [mobileNav, setMobileNav] = useState(false); const [submitted, setSubmitted] = useState(false); const [step, setStep] = useState(1); const [loading, setLoading] = useState(false); const [data, setData] = useState<Intake>(emptyIntake); const [touched, setTouched] = useState<Partial<Record<keyof Intake, boolean>>>({}); const [chosen, setChosen] = useState<Record<string, boolean>>({ vedic: true, laal: true, dasha: true, muhurta: false, numerology: false, vastu: false });
  // Final checkout submission state — separate from `loading`, which only
  // drives the step-to-step transition animation.
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const plan = plans.find((item) => item.id === planId) ?? plans[1]; const fields = plan[lang]; const lenses = Object.values(chosen).filter(Boolean).length; const setField = (field: keyof Intake, value: string) => setData((current) => ({ ...current, [field]: value })); const touchField = (field: keyof Intake) => setTouched((current) => ({ ...current, [field]: true })); const toggle = (id: string) => setChosen((current) => ({ ...current, [id]: !current[id] }));
  useEffect(() => { document.documentElement.lang = lang === "hi" ? "hi-IN" : "en-IN"; const title = lang === "hi" ? "भविष्यशक्ति | हिंदी में ज्योतिष उपाय योजनाएं" : "BhavishyaShakti | Astrology Remedy Plans in Hindi & English"; const description = lang === "hi" ? "लाल किताब, वैदिक ज्योतिष और समय संकेतों से बनी व्यक्तिगत उपाय योजना। धन, स्वास्थ्य, करियर और अन्य उद्देश्यों के लिए स्पष्ट कदम और कैलेंडर रिमाइंडर पाएं।" : "Personalized astrology remedy plans in Hindi or English using Laal Kitaab, Vedic Astrology and timing guidance. Get clear actions and calendar reminders for wealth, health, career and more."; document.title = title; document.querySelector('meta[name="description"]')?.setAttribute("content", description); document.querySelector('meta[property="og:title"]')?.setAttribute("content", title); document.querySelector('meta[property="og:description"]')?.setAttribute("content", description); document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", title); document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", description); }, [lang]);
  const fieldError = (field: keyof Intake) => { const value = data[field].trim(); if (field === "objective" && !value) return lang === "en" ? "Choose one objective." : "एक उद्देश्य चुनें।"; if (field === "name" && value.length < 2) return lang === "en" ? "Enter at least 2 characters." : "कम से कम 2 अक्षर भरें।"; if (field === "dob" && !value) return lang === "en" ? "Add your date of birth." : "जन्म तिथि भरें।"; if (field === "tob" && !value) return lang === "en" ? "Add your time of birth." : "जन्म समय भरें।"; if (field === "pob" && value.length < 2) return lang === "en" ? "Add your place of birth." : "जन्म स्थान भरें।"; if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return lang === "en" ? "Enter a valid email address." : "सही ईमेल भरें।"; if (field === "phone" && !/^[+\d][\d\s-]{9,}$/.test(value)) return lang === "en" ? "Enter a valid mobile number." : "सही मोबाइल नंबर भरें।"; return ""; };
  const fieldIsValid = (field: keyof Intake) => Boolean(touched[field] && !fieldError(field));
  const errorFor = (current: number) => current === 1 && fieldError("objective") ? fieldError("objective") : current === 2 && ["name", "dob", "tob", "pob"].some((field) => fieldError(field as keyof Intake)) ? (lang === "en" ? "Complete the highlighted birth details." : "हाइलाइट किए गए जन्म विवरण पूरे करें।") : current === 3 && ["email", "phone"].some((field) => fieldError(field as keyof Intake)) ? (lang === "en" ? "Complete the highlighted contact details." : "हाइलाइट किए गए संपर्क विवरण पूरे करें।") : "";
  const move = (direction: 1 | -1) => { if (direction === 1) { const currentFields: Array<keyof Intake> = step === 1 ? ["objective"] : step === 2 ? ["name", "dob", "tob", "pob"] : step === 3 ? ["email", "phone"] : []; currentFields.forEach(touchField); } const error = direction === 1 ? errorFor(step) : ""; if (error) { toast.error(error); return; } setLoading(true); window.setTimeout(() => { setStep((current) => Math.max(1, Math.min(4, current + direction))); setLoading(false); if (step === 2 && direction === 1 && data.dob) { toast.custom(() => <LuckyColorReveal lang={lang} dob={data.dob} />, { duration: 7000 }); } }, 900); };

  // Creates the Bhavishyashakti customer + Cashfree order server-side via
  // POST /public/bhavishyashakti/checkout, then opens Cashfree Checkout
  // with the returned payment_session_id. No admin API key is ever
  // exposed client-side; the backend computes the real chargeable amount
  // from plan_duration_months on its own.
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = errorFor(3);
    if (error) {
      toast.error(error);
      setStep(3);
      return;
    }

    setSubmitError(null);
    setSubmitting(true);

    const reportPayload = buildReportPayload(data, planId, lang, chosen);
    trackEvent("report_payload_ready", { language: lang, plan: planId, has_gender: Boolean(reportPayload.gender) });

    try {
      const checkoutPayload = buildBhavishyashaktiCheckoutPayload(data, planId, chosen);

      const res = await fetch(`${API_BASE_URL}/public/bhavishyashakti/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutPayload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.detail || `Request failed (${res.status})`);
      }

      const result = await res.json(); // { customer_id, order_id, payment_session_id }

      if (!result.payment_session_id) {
        throw new Error(
          lang === "en"
            ? "Payment session could not be created. Please try again."
            : "भुगतान सत्र नहीं बन सका। कृपया फिर से प्रयास करें।"
        );
      }

      setSubmitted(true);
      trackEvent("checkout_order_created", { language: lang, plan: planId, order_id: result.order_id });
      toast.success(lang === "en" ? "Redirecting you to secure payment" : "सुरक्षित भुगतान पर भेज रहे हैं", {
        description:
          lang === "en"
            ? "Complete payment to receive your remedy report and calendar file."
            : "अपनी उपाय रिपोर्ट और कैलेंडर फाइल पाने के लिए भुगतान पूरा करें।",
      });

      // Loads (and caches) the Cashfree JS SDK, then opens hosted Checkout.
      // On redirectTarget "_self" the browser navigates fully away to
      // Cashfree and back to the backend's configured return_url.
      const Cashfree = await loadCashfreeSdk();
      const cashfree = Cashfree({ mode: CASHFREE_MODE });

      await cashfree.checkout({
        paymentSessionId: result.payment_session_id,
        redirectTarget: "_self",
      });
      // Page navigates away here; nothing further to render.
    } catch (err: any) {
      const message =
        err?.message ||
        (lang === "en"
          ? "Something went wrong. Please try again or contact support."
          : "कुछ गलत हो गया। कृपया फिर से प्रयास करें या सहायता से संपर्क करें।");
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const stepTitles = [l.goal, l.birth, l.contact, l.review]; const stepTitle = [l.chooseFocus, l.addBirth, l.delivery, l.reviewPath][step - 1]; const stepHi = [l.chooseFocusHi, l.addBirthHi, l.deliveryHi, l.reviewHi][step - 1];
  return <div className="min-h-screen overflow-hidden bg-[#0a0908] text-[#f7ede0]"><div className="pointer-events-none fixed inset-0 z-0 opacity-[0.18] bs-noise" /><header className="relative z-30 border-b border-[#f28c28]/15 bg-[#0a0908]/85 backdrop-blur-xl"><div className="bs-shell flex h-[76px] items-center justify-between"><button type="button" onClick={() => go("top")} className="flex items-center gap-3 text-left"><span className="grid h-10 w-10 place-items-center rounded-full border border-[#f28c28]/45 bg-[#15110f]"><img src="/logo_d67e2cea.webp" alt="BhavishyaShakti Surya yantra" className="h-7 w-7 object-contain" /></span><span><span className="bs-serif block text-[21px] font-semibold leading-none tracking-wide">BhavishyaShakti</span><span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.24em] text-[#b97832]">{l.brandSub}</span></span></button><nav className="hidden items-center gap-6 text-[12px] font-medium text-[#b9aa99] lg:flex"><a href="#frameworks" className="hover:text-[#f28c28]">{l.nav[0]}</a><a href="#plans" className="hover:text-[#f28c28]">{l.nav[1]}</a><a href="#deliverables" className="hover:text-[#f28c28]">{l.nav[2]}</a><button type="button" onClick={() => setLang(lang === "en" ? "hi" : "en")} className="language-toggle">{l.toggle}</button><button type="button" onClick={() => { trackEvent("desktop_header_cta_click", { language: lang, surface: "desktop_header" }); go("intake"); }} className="flex items-center gap-2 border border-[#f28c28] bg-[#f28c28] px-4 py-2.5 font-semibold text-[#0a0908]">{l.begin} <ArrowRight className="h-3.5 w-3.5" /></button></nav><div className="flex items-center gap-2 lg:hidden"><button type="button" onClick={() => { trackEvent("sticky_header_cta_click", { language: lang, surface: "sticky_header" }); go("plans"); }} className="border border-[#f28c28] bg-[#f28c28] px-3 py-2 text-[11px] font-bold text-[#0a0908]">{lang === "en" ? "View Plans" : "योजनाएँ"}</button><button type="button" onClick={() => setLang(lang === "en" ? "hi" : "en")} className="language-toggle">{l.toggle}</button><button type="button" aria-label="Toggle navigation" onClick={() => setMobileNav(!mobileNav)} className="grid h-10 w-10 place-items-center border border-[#f28c28]/25 text-[#f28c28]">{mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div></div>{mobileNav && <div className="bs-shell border-t border-[#f28c28]/15 py-4 lg:hidden"><div className="grid gap-3 text-sm text-[#cbbbab]"><a href="#frameworks" onClick={() => setMobileNav(false)}>{l.nav[0]}</a><a href="#plans" onClick={() => setMobileNav(false)}>{l.nav[1]}</a><a href="#deliverables" onClick={() => setMobileNav(false)}>{l.nav[2]}</a><button type="button" onClick={() => { setMobileNav(false); go("intake"); }} className="bg-[#f28c28] px-4 py-3 text-left font-semibold text-[#0a0908]">{l.begin}</button></div></div>}</header>
    <main id="top" className="relative z-10"><section className="relative isolate border-b border-[#f28c28]/10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(242,140,40,0.15),transparent_28%),linear-gradient(90deg,#0a0908_8%,rgba(10,9,8,0.83)_42%,rgba(10,9,8,0.35)_100%)]" /><div className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-screen" style={{ backgroundImage: "url('/manus-storage/bhavishyashakti-hero_ee601a20.png')" }} /><div className="absolute inset-0 bg-gradient-to-b from-[#0a0908]/10 via-[#0a0908]/20 to-[#0a0908]" /><div className="bs-shell relative grid min-h-[690px] items-center gap-12 py-20 lg:grid-cols-[minmax(0,1.02fr)_minmax(350px,0.78fr)] lg:py-28"><div className="max-w-[680px]"><div className="bs-rise mb-8 inline-flex items-center gap-2 border border-[#f28c28]/35 bg-[#0a0908]/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f2a85d]"><Sparkles className="h-3.5 w-3.5" /> {l.heroKicker}</div><p className="bs-rise mb-4 text-lg font-medium text-[#f2a85d]">{l.heroLead}</p><h1 className="bs-serif bs-rise max-w-[700px] text-[58px] font-semibold leading-[0.92] tracking-[-0.025em] sm:text-[78px] lg:text-[96px]">{l.heroTitle}</h1><p className="bs-rise mt-7 max-w-[560px] text-[16px] leading-7 text-[#b9aa99]">{l.heroBody}</p><div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"><button type="button" onClick={() => go("intake")} className="inline-flex items-center justify-center gap-3 bg-[#f28c28] px-6 py-4 text-sm font-bold text-[#0a0908]">{l.heroCta} <ArrowRight className="h-4 w-4" /></button><button type="button" onClick={() => go("how-it-works")} className="inline-flex items-center justify-center gap-2 px-5 py-4 text-sm font-medium text-[#e2d2c0]"><Play className="h-4 w-4 fill-current text-[#f28c28]" /> {l.heroSecondary}</button></div><div className="mt-10 grid max-w-[570px] grid-cols-3 gap-4 border-t border-[#f28c28]/20 pt-5">{l.stats.map((item, i) => <div key={item}><p className="bs-serif text-3xl font-semibold">{["6", "1", "∞"][i]}</p><p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#988b7c]">{item}</p></div>)}</div></div><div className="relative mx-auto w-full max-w-[420px] lg:mr-0"><div className="absolute -right-7 top-4 z-10 hidden w-[190px] border border-[#f28c28]/25 bg-[#100d0b]/90 p-4 backdrop-blur-md sm:block"><div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f28c28]"><Clock3 className="h-3.5 w-3.5" /> {lang === "en" ? "Your window" : "आपकी अवधि"}</div><div className="grid grid-cols-3 divide-x divide-[#f28c28]/15 text-center"><div><p className="bs-serif text-2xl">06</p><span className="text-[9px] text-[#81766b]">{lang === "en" ? "months" : "महीने"}</span></div><div><p className="bs-serif text-2xl">03</p><span className="text-[9px] text-[#81766b]">{lang === "en" ? "focus" : "फोकस"}</span></div><div><p className="bs-serif text-2xl">01</p><span className="text-[9px] text-[#81766b]">{lang === "en" ? "goal" : "उद्देश्य"}</span></div></div></div><div className="bs-float relative overflow-hidden border border-[#f28c28]/40 bg-[#16110d] p-3 shadow-[0_18px_80px_rgba(0,0,0,0.55)]"><div className="relative aspect-[4/5] overflow-hidden border border-[#f28c28]/15 bg-[radial-gradient(circle_at_70%_15%,rgba(242,140,40,0.22),transparent_25%),linear-gradient(140deg,#1c1510,#0e0c0a)] p-5"><div className="relative border border-[#f28c28]/25 bg-[#f4e8da] p-5 text-[#211713]"><div className="flex items-center justify-between border-b border-[#9b6b48]/25 pb-3"><span className="bs-serif text-lg font-semibold">{lang === "en" ? "Your remedy path" : "आपकी उपाय योजना"}</span><Sun className="h-4 w-4 text-[#bc5e14]" /></div><div className="mt-5 space-y-3"><div className="h-2 w-2/3 bg-[#bc5e14]/55" /><div className="h-2 w-5/6 bg-[#9b6b48]/25" /><div className="grid grid-cols-3 gap-2 pt-2"><span className="h-12 border border-[#bc5e14]/35 bg-[#bc5e14]/10" /><span className="h-12 border border-[#bc5e14]/35 bg-[#bc5e14]/10" /><span className="h-12 border border-[#bc5e14]/35 bg-[#bc5e14]/10" /></div></div></div><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a0908] to-transparent px-5 pb-5 pt-20"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f28c28]">{lang === "en" ? "Inside your report" : "आपकी रिपोर्ट में"}</p><p className="bs-serif mt-1 text-2xl">{lang === "en" ? "Your action map" : "आपका एक्शन मैप"}</p></div></div><div className="flex items-center justify-between px-2 pb-1 pt-4 text-[9px] uppercase tracking-[0.16em] text-[#8d7d6c]"><span>{lang === "en" ? "Confidential reading" : "गोपनीय रीडिंग"}</span><span className="flex items-center gap-1 text-[#f2a85d]"><LockKeyhole className="h-3 w-3" /> {lang === "en" ? "private" : "निजी"}</span></div></div><div className="absolute -bottom-7 -left-6 z-10 flex items-center gap-3 border border-[#f28c28]/25 bg-[#0d0b0a]/90 px-4 py-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#f28c28] text-[#0a0908]"><CalendarDays className="h-4 w-4" /></span><span><strong className="block text-xs">+ {lang === "en" ? "Calendar file" : "कैलेंडर फाइल"}</strong><small className="text-[10px] text-[#988b7c]">{lang === "en" ? "rituals, mapped & ready" : "उपाय, मैप और तैयार"}</small></span></div></div></div></section>
      <section className="border-b border-[#f28c28]/10 bg-[#11100e] py-5"><div className="bs-shell flex flex-col items-start justify-between gap-3 text-xs sm:flex-row sm:items-center"><div className="flex items-center gap-3 text-[#c4b2a0]"><span className="grid h-7 w-7 place-items-center border border-[#f28c28]/30 text-[#f28c28]"><Zap className="h-3.5 w-3.5" /></span><span>{l.strip}</span></div><span className="text-[#7f746a]">{l.madeFor}</span></div></section>
      <section id="how-it-works" className="bs-shell py-24 lg:py-32"><div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24"><div className="lg:sticky lg:top-24 lg:h-fit"><div className="eyebrow"><span /> {l.ideaKicker}</div><h2 className="bs-serif max-w-[440px] text-5xl font-semibold leading-[0.95] sm:text-6xl">{l.ideaTitle}</h2><p className="mt-6 max-w-[400px] text-sm leading-7 text-[#a79787]">{l.ideaBody}</p><button type="button" onClick={() => go("intake")} className="mt-8 inline-flex items-center gap-2 border-b border-[#f28c28] pb-2 text-sm font-semibold text-[#f28c28]">{l.build} <ArrowRight className="h-4 w-4" /></button></div><div className="relative space-y-5">{ritualSteps[lang].map(({ num, title, body, Icon }, index) => <div key={num} className="relative flex gap-6 border border-[#f28c28]/15 bg-[#110e0c]/80 p-6" style={{ marginLeft: index % 2 ? "34px" : "0" }}><span className="grid h-9 w-9 shrink-0 place-items-center border border-[#f28c28]/45 bg-[#0a0908] text-xs font-bold text-[#f28c28]">{num}</span><div><div className="mb-3 flex items-center gap-2 text-[#f28c28]"><Icon className="h-4 w-4" /><span className="text-[10px] font-semibold uppercase tracking-[0.18em]">{l.ritual}</span></div><h3 className="bs-serif text-3xl font-semibold">{title}</h3><p className="mt-4 max-w-[470px] text-sm leading-6 text-[#a79787]">{body}</p></div></div>)}</div></div></section>
      <section id="frameworks" className="border-y border-[#f28c28]/10 bg-[#0e0c0b] py-24 lg:py-28"><div className="bs-shell"><div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-end"><div><div className="eyebrow"><span /> {l.lensesKicker}</div><h2 className="bs-serif max-w-[480px] text-5xl font-semibold leading-[0.96] sm:text-6xl">{l.lensesTitle}</h2></div><p className="max-w-[520px] text-sm leading-7 text-[#a79787]">{l.lensesBody}</p></div><div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{frameworks.map(({ id, icon: Icon, en, hi }) => { const pair = lang === "en" ? en : hi; return <button type="button" key={id} onClick={() => toggle(id)} className={`min-h-[156px] border p-5 text-left transition-all ${chosen[id] ? "border-[#f28c28] bg-[#1a120d] shadow-[inset_3px_0_0_#f28c28]" : "border-[#f28c28]/15 bg-[#130f0d] hover:border-[#f28c28]/45"}`}><div className="mb-5 flex items-center justify-between"><span className={`grid h-9 w-9 place-items-center border ${chosen[id] ? "border-[#f28c28] bg-[#f28c28] text-[#0a0908]" : "border-[#f28c28]/25 text-[#c9863b]"}`}><Icon className="h-4 w-4" /></span>{chosen[id] && <Check className="h-4 w-4 text-[#f28c28]" />}</div><h3 className="text-sm font-semibold">{pair[0]}</h3><p className="mt-1 text-xs text-[#c9863b]">{pair[1]}</p><p className="mt-3 text-xs leading-5 text-[#8f8174]">{pair[2]}</p></button>; })}</div><div className="mt-6 flex items-center gap-2 text-[11px] text-[#8f8174]"><Sparkles className="h-3.5 w-3.5 text-[#f28c28]" /> {lenses} {l.selected}</div></div></section>
      <section className="bs-shell py-24 lg:py-32"><div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24"><div className="relative aspect-square overflow-hidden border border-[#f28c28]/25 bg-[radial-gradient(circle_at_50%_38%,rgba(242,140,40,0.28),transparent_20%),linear-gradient(140deg,#22170f,#0d0b0a)]"><div className="absolute left-1/2 top-[34%] h-28 w-28 -translate-x-1/2 rounded-full border border-[#f28c28]/30 bg-[#20130b] shadow-[0_0_70px_rgba(242,140,40,0.28)]" /><div className="absolute left-1/2 top-[40%] h-11 w-11 -translate-x-1/2 rounded-full bg-[#f28c28] shadow-[0_0_30px_rgba(242,140,40,0.75)]" /><div className="absolute bottom-[22%] left-1/2 h-16 w-28 -translate-x-1/2 border border-[#d8b080]/45 bg-[#6c4329]/40" /><div className="absolute bottom-[13%] left-[13%] right-[13%] grid grid-cols-7 gap-1 border-t border-[#f28c28]/25 pt-3">{Array.from({ length: 7 }).map((_, i) => <span key={i} className={`h-1.5 ${i === 2 || i === 5 ? "bg-[#f28c28]" : "bg-[#f28c28]/20"}`} />)}</div><div className="absolute inset-0 bg-gradient-to-t from-[#0a0908]/95 via-transparent to-transparent" /><div className="absolute bottom-8 left-8 right-8"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f28c28]">{l.practiceKicker}</p><p className="bs-serif mt-2 max-w-[330px] text-3xl font-semibold leading-none">{l.practiceTitle}</p></div></div><div><div className="eyebrow"><span /> {l.practiceKicker}</div><h2 className="bs-serif text-5xl font-semibold leading-[0.95] sm:text-6xl">{l.practiceTitle}</h2><p className="mt-6 text-sm leading-7 text-[#a79787]">{l.practiceBody}</p><div className="mt-8 space-y-4">{l.practiceItems.map((item) => <div key={item} className="flex items-start gap-3 border-b border-[#f28c28]/10 pb-4 text-sm text-[#d8c8b7]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#f28c28]" /> {item}</div>)}</div><div className="mt-8 flex items-center gap-3 text-xs text-[#8f8174]"><LockKeyhole className="h-4 w-4 text-[#f28c28]" /> {l.private}</div></div></div></section>
      <VideoTestimonialCarousel lang={lang} />
      <section id="plans" className="bs-shell scroll-mt-24 py-24 lg:py-32"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><div className="eyebrow"><span /> {l.planKicker}</div><h2 className="bs-serif text-5xl font-semibold leading-[0.95] sm:text-6xl">{l.planTitle}</h2></div><p className="max-w-[350px] text-sm leading-6 text-[#a79787]">{l.planBody}</p></div><div className="mt-12 grid gap-4 lg:grid-cols-3">{plans.map((item) => { const pair = item[lang]; return <button type="button" key={item.id} onClick={() => { trackEvent("plan_select", { plan: item.id, language: lang }); setPlanId(item.id); setCheckoutOpen(true); }} className={`relative border p-7 text-left transition-all duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f28c28] ${item.id === "6" ? "scale-[1.02] border-[#f28c28]/70 shadow-[0_18px_50px_rgba(242,140,40,0.12)] hover:-translate-y-2 hover:border-[#f28c28] hover:shadow-[0_24px_70px_rgba(242,140,40,0.22)]" : "hover:border-[#f28c28]/70 hover:shadow-[0_18px_45px_rgba(242,140,40,0.12)]"} ${planId === item.id ? "bg-[#1a120d]" : "bg-[#110e0c] hover:bg-[#17110d]"}`}><div className="flex items-start justify-between gap-4"><div><p className="text-2xl font-black leading-none tracking-[0.12em] text-[#f28c28] sm:text-3xl">{item.months} <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#f2a85d] sm:text-base">{lang === "en" ? "month path" : "महीने की योजना"}</span></p><h3 className="bs-serif mt-3 text-4xl font-semibold">{pair[0]}</h3><p className="mt-1 text-xs text-[#c9863b]">{pair[1]}</p></div>{item.popular && <span className="popular-pulse border border-[#f28c28] bg-[#f28c28] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#0a0908]">{lang === "en" ? "Most Popular" : "सबसे लोकप्रिय"}</span>}</div><p className="mt-6 min-h-[48px] text-sm leading-6 text-[#a79787]">{pair[2]}</p><div className="mt-8 flex items-end gap-3"><span className="bs-serif text-5xl font-semibold text-[#f28c28]">₹{item.price}</span><span className="mb-2 text-sm text-[#7f746a] line-through">₹{item.old}</span></div><div className="mt-6 flex items-center justify-between border-t border-[#f28c28]/15 pt-5 text-xs"><span className="text-[#c6b6a5]">{item.months} {lang === "en" ? "months + calendar integration" : "महीने + कैलेंडर इंटीग्रेशन"}</span><span className={`grid h-7 w-7 place-items-center border ${planId === item.id ? "border-[#f28c28] bg-[#f28c28] text-[#0a0908]" : "border-[#5c4d40] text-transparent"}`}><Check className="h-3.5 w-3.5" /></span></div></button>; })}</div><p className="mt-5 text-center text-[11px] text-[#807569]">{l.noPromises}</p></section>
      <CalendarMockup lang={lang} />
      <PricingFAQ lang={lang} />
      <Preview lang={lang} planId={planId} objective={data.objective} />
      {step === 2 && <EnhancedBirthGenderField lang={lang} value={data.gender} onChange={(value) => setField("gender", value)} />}
      {step === 4 && <GenderReviewSummary lang={lang} gender={data.gender} />}
      <section id="intake" className="relative border-y border-[#f28c28]/20 bg-[#120e0b] py-24 lg:py-32"><div className="bs-shell relative grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20"><div><div className="eyebrow"><span /> {l.intakeKicker}</div><h2 className="bs-serif max-w-[460px] text-5xl font-semibold leading-[0.95] sm:text-6xl">{l.intakeTitle}</h2><p className="mt-6 max-w-[430px] text-sm leading-7 text-[#a79787]">{l.intakeBody}</p><div className="mt-10 border-l-2 border-[#f28c28] pl-5"><p className="text-sm font-semibold">{l.selectedPath}</p><p className="bs-serif mt-1 text-3xl text-[#f28c28]">{fields[0]} · ₹{plan.price}</p><p className="mt-1 text-xs text-[#9c8d7d]">{plan.months} {lang === "en" ? "months + report + calendar" : "महीने + रिपोर्ट + कैलेंडर"}</p></div><div className="mt-10 space-y-4 text-xs text-[#998b7e]"><div className="flex gap-3"><FileText className="h-4 w-4 shrink-0 text-[#f28c28]" /> {l.reportDeliverable}</div><div className="flex gap-3"><CalendarDays className="h-4 w-4 shrink-0 text-[#f28c28]" /> {l.calendarDeliverable}</div><div className="flex gap-3"><LockKeyhole className="h-4 w-4 shrink-0 text-[#f28c28]" /> {l.private}</div></div></div><form onSubmit={submit} className="relative border border-[#f28c28]/25 bg-[#0d0b0a] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.24)] sm:p-8"><div className="mb-8 flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f28c28]">{l.step} {step} {l.of} 4</p><h3 className="bs-serif mt-2 text-3xl font-semibold">{stepTitle}</h3><p className="mt-1 text-xs text-[#948477]">{stepHi}</p></div><div className="grid h-10 w-10 place-items-center border border-[#f28c28]/35 text-[#f28c28]">{step === 1 ? <Target className="h-5 w-5" /> : step === 2 ? <Sun className="h-5 w-5" /> : step === 3 ? <Mail className="h-5 w-5" /> : <Check className="h-5 w-5" />}</div></div><div className="mb-8"><div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-[#8f8174]"><span>{lang === "en" ? "Reading progress" : "रीडिंग प्रगति"}</span><span className="text-[#f28c28]">{step * 25}%</span></div><div className="relative h-2 overflow-hidden bg-[#3b2e26]" role="progressbar" aria-valuenow={step * 25} aria-valuemin={0} aria-valuemax={100} aria-label={lang === "en" ? `Step ${step} of 4` : `चरण ${step} में से 4`}><div className="h-full bg-[#f28c28] transition-all duration-500" style={{ width: `${step * 25}%` }} /></div><div className="mt-3 grid grid-cols-4 gap-2">{stepTitles.map((title, index) => <div key={title} className="space-y-2"><span className={`text-[9px] font-bold uppercase tracking-[0.14em] ${index + 1 <= step ? "text-[#f2a85d]" : "text-[#6e6359]"}`}>{title}</span></div>)}</div></div>{loading && <AstroLoader lang={lang} />}{!loading && step === 1 && <div className="space-y-6"><div><Label hint={l.objectiveHi} required>{l.objective}</Label><select value={data.objective} onBlur={() => touchField("objective")} onChange={(event) => { setField("objective", event.target.value); touchField("objective"); }} aria-invalid={Boolean(touched.objective && fieldError("objective"))} className={`bs-input ${touched.objective && fieldError("objective") ? "field-invalid" : touched.objective ? "field-valid" : ""}`} required><option value="" disabled>{l.objectivePlaceholder}</option><option>{lang === "en" ? "Wealth increase & financial clarity — धन वृद्धि" : "धन वृद्धि और वित्तीय स्पष्टता — Wealth increase"}</option><option>{lang === "en" ? "Health improvement & wellbeing — स्वास्थ्य" : "स्वास्थ्य सुधार और कल्याण — Health improvement"}</option><option>{lang === "en" ? "Career growth & promotion — करियर" : "करियर वृद्धि और प्रमोशन — Career growth"}</option><option>{lang === "en" ? "Business success — व्यापार" : "व्यापार सफलता — Business success"}</option><option>{lang === "en" ? "Love, relationships & family — रिश्ते" : "प्रेम, रिश्ते और परिवार — Love & relationships"}</option><option>{lang === "en" ? "Education & focus — शिक्षा" : "शिक्षा और फोकस — Education"}</option></select><FieldFeedback error={touched.objective ? fieldError("objective") : ""} valid={fieldIsValid("objective")} lang={lang} /></div><div><Label hint={l.optional}>{l.frameworksOptional}</Label><div className="grid gap-2 sm:grid-cols-2">{frameworks.map(({ id, en, hi }) => { const pair = lang === "en" ? en : hi; return <button type="button" key={id} onClick={() => toggle(id)} className={`border px-3 py-3 text-left text-[11px] ${chosen[id] ? "border-[#f28c28] bg-[#f28c28]/10 text-[#f2a85d]" : "border-[#4b3d33] text-[#8c7d70]"}`}><span className="flex items-center justify-between"><span>{pair[0]}</span>{chosen[id] && <Check className="h-3.5 w-3.5" />}</span><span className="mt-1 block text-[10px] text-[#8f8174]">{pair[1]}</span></button>; })}</div><p className="text-[10px] text-[#786d63]">{lenses} {l.lensesHint}</p></div></div>}{!loading && step === 2 && <div className="grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2"><Label hint={l.fullNameHi} required>{l.fullName}</Label><input required value={data.name} onBlur={() => touchField("name")} onChange={(event) => { setField("name", event.target.value); touchField("name"); }} aria-invalid={Boolean(touched.name && fieldError("name"))} placeholder={lang === "en" ? "e.g. Ananya Sharma" : "जैसे अनन्या शर्मा"} className={`bs-input ${touched.name && fieldError("name") ? "field-invalid" : touched.name ? "field-valid" : ""}`} /><FieldFeedback error={touched.name ? fieldError("name") : ""} valid={fieldIsValid("name")} lang={lang} /></div><div><Label hint={l.dobHi} required>{l.dob}</Label><input required value={data.dob} onBlur={() => touchField("dob")} onChange={(event) => { setField("dob", event.target.value); touchField("dob"); }} aria-invalid={Boolean(touched.dob && fieldError("dob"))} type="date" className={`bs-input ${touched.dob && fieldError("dob") ? "field-invalid" : touched.dob ? "field-valid" : ""}`} /><FieldFeedback error={touched.dob ? fieldError("dob") : ""} valid={fieldIsValid("dob")} lang={lang} /></div><div><Label hint={l.tobHi} required>{l.tob}</Label><input required value={data.tob} onBlur={() => touchField("tob")} onChange={(event) => { setField("tob", event.target.value); touchField("tob"); }} aria-invalid={Boolean(touched.tob && fieldError("tob"))} type="time" className={`bs-input ${touched.tob && fieldError("tob") ? "field-invalid" : touched.tob ? "field-valid" : ""}`} /><FieldFeedback error={touched.tob ? fieldError("tob") : ""} valid={fieldIsValid("tob")} lang={lang} /></div><div className="sm:col-span-2"><Label hint={l.pobHi} required>{l.pob}</Label><div className="relative"><MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#f28c28]" /><input required value={data.pob} onBlur={() => touchField("pob")} onChange={(event) => { setField("pob", event.target.value); touchField("pob"); }} aria-invalid={Boolean(touched.pob && fieldError("pob"))} placeholder={l.city} className={`bs-input pl-10 ${touched.pob && fieldError("pob") ? "field-invalid" : touched.pob ? "field-valid" : ""}`} /></div><FieldFeedback error={touched.pob ? fieldError("pob") : ""} valid={fieldIsValid("pob")} lang={lang} /></div></div>}{!loading && step === 3 && <div className="grid gap-5"><div><Label hint={l.emailHi} required>{l.email}</Label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#f28c28]" /><input required value={data.email} onBlur={() => touchField("email")} onChange={(event) => { setField("email", event.target.value); touchField("email"); }} aria-invalid={Boolean(touched.email && fieldError("email"))} type="email" placeholder={l.emailPlaceholder} className={`bs-input pl-10 ${touched.email && fieldError("email") ? "field-invalid" : touched.email ? "field-valid" : ""}`} /></div><FieldFeedback error={touched.email ? fieldError("email") : ""} valid={fieldIsValid("email")} lang={lang} /></div><div><Label hint={l.phoneHi} required>{l.phone}</Label><div className="relative"><Phone className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#f28c28]" /><input required value={data.phone} onBlur={() => touchField("phone")} onChange={(event) => { setField("phone", event.target.value); touchField("phone"); }} aria-invalid={Boolean(touched.phone && fieldError("phone"))} type="tel" placeholder={l.phonePlaceholder} className={`bs-input pl-10 ${touched.phone && fieldError("phone") ? "field-invalid" : touched.phone ? "field-valid" : ""}`} /></div><FieldFeedback error={touched.phone ? fieldError("phone") : ""} valid={fieldIsValid("phone")} lang={lang} /></div><div className="border border-[#f28c28]/15 bg-[#15110f] p-4 text-xs leading-5 text-[#8f8174]"><LockKeyhole className="mb-2 h-4 w-4 text-[#f28c28]" /> {l.privacyStep}</div></div>}{!loading && step === 4 && <div className="space-y-5"><div className="border border-[#f28c28]/15 bg-[#15110f] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f28c28]">{l.selectedPathLabel}</p><p className="bs-serif mt-1 text-3xl">{fields[0]} · ₹{plan.price}</p><p className="mt-1 text-xs text-[#8f8174]">{plan.months} {lang === "en" ? "months + report + calendar" : "महीने + रिपोर्ट + कैलेंडर"}</p></div><div className="grid gap-4 text-sm text-[#d8c8b7] sm:grid-cols-2"><div><span className="mini-label">{l.objectiveLabel}</span>{data.objective || l.notSelected}</div><div><span className="mini-label">{l.nameLabel}</span>{data.name || l.notAdded}</div><div><span className="mini-label">{l.birthLabel}</span>{data.dob || "—"} · {data.tob || "—"}<br />{data.pob || "—"}</div><div><span className="mini-label">{l.deliveryLabel}</span>{data.email || "—"}<br />{data.phone || "—"}</div></div><p className="flex items-start gap-2 border-t border-[#f28c28]/15 pt-4 text-[10px] leading-5 text-[#786d63]"><Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#f28c28]" /> {lang === "en" ? "You can still go back and edit anything before continuing." : "आगे बढ़ने से पहले आप कोई भी जानकारी बदल सकते हैं।"}</p>{submitError && <p className="flex items-start gap-2 border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-300" role="alert">{submitError}</p>}</div>}<div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#f28c28]/15 pt-6 sm:flex-row sm:justify-between"><button type="button" onClick={() => move(-1)} className={`inline-flex items-center justify-center gap-2 border border-[#4b3d33] px-4 py-3 text-sm text-[#a79787] ${step === 1 || loading || submitting ? "invisible" : ""}`}><ChevronLeft className="h-4 w-4" /> {l.back}</button>{step < 4 ? <button type="button" disabled={loading} onClick={() => move(1)} className="group inline-flex items-center justify-center gap-3 bg-[#f28c28] px-5 py-3 text-sm font-bold text-[#0a0908] disabled:opacity-60">{l.continue} <ChevronRight className="h-4 w-4" /></button> : <button type="submit" disabled={loading || submitting} className="group inline-flex items-center justify-center gap-3 bg-[#f28c28] px-5 py-3 text-sm font-bold text-[#0a0908] disabled:opacity-60">{submitting ? (lang === "en" ? "Preparing secure checkout…" : "सुरक्षित चेकआउट तैयार हो रहा है…") : submitted ? l.captured : `${l.continueWith} ${fields[0]}`} <ArrowRight className="h-4 w-4" /></button>}</div><p className="mt-4 flex items-start gap-2 text-[10px] leading-5 text-[#786d63]"><LockKeyhole className="mt-0.5 h-3 w-3 shrink-0 text-[#f28c28]" /> {l.belief}</p></form></div></section>
      <section className="relative border-t border-[#f28c28]/20 bg-[#f28c28] py-20 text-[#0a0908]"><div className="absolute inset-0 opacity-[0.12] bs-noise" /><div className="bs-shell relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end"><div><p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#6a300d]">{l.ctaKicker}</p><h2 className="bs-serif max-w-[680px] text-6xl font-semibold leading-[0.88] sm:text-8xl">{l.ctaTitle}</h2></div><button type="button" onClick={() => { trackEvent("checkout_cta_click", { source: "final_cta", plan: planId, language: lang }); go("plans"); }} className="group inline-flex shrink-0 items-center gap-3 border border-[#0a0908] bg-[#0a0908] px-6 py-4 text-sm font-bold text-[#f7ede0]">{l.choosePlan} <ArrowRight className="h-4 w-4" /></button></div></section></main><CheckoutSummaryModal lang={lang} open={checkoutOpen} onOpenChange={setCheckoutOpen} plan={plan} onContinue={() => { trackEvent("checkout_cta_click", { source: "modal", plan: planId, language: lang }); setCheckoutOpen(false); go("intake"); }} />
    <ActivityToast lang={lang} /><div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#f28c28]/35 bg-[#0d0b0a]/95 px-4 pb-[max(0.8rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden"><div className="mx-auto flex max-w-[520px] items-center justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#f2a85d]">{lang === "en" ? "Your remedy window" : "आपकी उपाय अवधि"}</p><p className="bs-serif text-2xl leading-none">{lang === "en" ? "From" : "से शुरू"} ₹399</p></div><button type="button" onClick={() => go("plans")} className="inline-flex items-center gap-2 bg-[#f28c28] px-4 py-3 text-xs font-bold text-[#0a0908]">{lang === "en" ? "View plans" : "योजनाएं देखें"} <ArrowRight className="h-3.5 w-3.5" /></button></div></div>
    <BlogJournal lang={lang} />
    <ShareFooter lang={lang} />
    <footer className="relative z-10 bg-[#0a0908] py-10"><div className="bs-shell flex flex-col justify-between gap-8 border-b border-[#f28c28]/15 pb-10 md:flex-row md:items-end"><div><div className="flex items-center gap-3"><img src="/logo_d67e2cea.webp" alt="" className="h-8 w-8 object-contain" /><span className="bs-serif text-2xl">BhavishyaShakti</span></div><p className="mt-4 max-w-[360px] text-xs leading-6 text-[#7f746a]">{lang === "en" ? "Personalised astrology guidance for your next right move — in Hindi and English, for modern India." : "आधुनिक भारत के लिए हिंदी और अंग्रेज़ी में व्यक्तिगत ज्योतिष मार्गदर्शन।"}</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#9b8c7e]"><a href="#frameworks">{l.nav[0]}</a><a href="#plans">{l.nav[1]}</a><a href="#deliverables">{l.nav[2]}</a><a href="#intake">{l.begin}</a><span className="flex items-center gap-1"><Globe2 className="h-3 w-3 text-[#f28c28]" /> India</span><Instagram className="h-4 w-4 text-[#f28c28]" /></div></div><div className="bs-shell pt-6 text-[10px] leading-5 text-[#6f655c]">© 2026 BhavishyaShakti. {lang === "en" ? "Belief-based guidance only · Results vary." : "विश्वास-आधारित मार्गदर्शन · परिणाम अलग हो सकते हैं।"}</div></footer>
  </div>;
}

function ShareFooter({ lang }: { lang: Lang }) { const pageUrl = typeof window !== "undefined" ? window.location.href : "https://bhavishyashakti.manus.space/"; const shareText = lang === "en" ? "Explore BhavishyaShakti's personalised astrology remedy plans and calendar integration." : "भविष्यशक्ति की व्यक्तिगत ज्योतिष उपाय योजनाएं और कैलेंडर इंटीग्रेशन देखें।"; const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`; const emailHref = `mailto:?subject=${encodeURIComponent(lang === "en" ? "A calmer way to explore astrology remedies" : "ज्योतिष उपायों को समझने का एक सहज तरीका")}&body=${encodeURIComponent(`${shareText}\n\n${pageUrl}`)}`; const shareNative = async () => { trackEvent("share_click", { channel: "native", surface: "footer", language: lang }); if (typeof navigator !== "undefined" && navigator.share) { await navigator.share({ title: "BhavishyaShakti", text: shareText, url: pageUrl }).catch(() => undefined); } else if (typeof window !== "undefined") { window.open(whatsappHref, "_blank", "noopener,noreferrer"); } }; return <section className="relative z-10 border-t border-[#f28c28]/15 bg-[#0a0908] py-8"><div className="bs-shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f28c28]">{lang === "en" ? "Share the next right move" : "अगला सही कदम साझा करें"}</p><p className="mt-1 text-xs text-[#81766b]">{lang === "en" ? "Send the remedy-plan idea to someone who values consistency." : "यह उपाय योजना उस व्यक्ति तक पहुंचाएं जो निरंतरता को महत्व देता है।"}</p></div><div className="flex flex-wrap gap-2"><a onClick={() => trackEvent("share_click", { channel: "whatsapp", surface: "footer", language: lang })} href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-[#f28c28]/35 px-3 py-2 text-xs font-semibold text-[#f2a85d] transition-colors hover:bg-[#f28c28] hover:text-[#0a0908]"><MessageCircle className="h-3.5 w-3.5" /> WhatsApp</a><a onClick={() => trackEvent("share_click", { channel: "email", surface: "footer", language: lang })} href={emailHref} className="inline-flex items-center gap-2 border border-[#f28c28]/35 px-3 py-2 text-xs font-semibold text-[#f2a85d] transition-colors hover:bg-[#f28c28] hover:text-[#0a0908]"><Mail className="h-3.5 w-3.5" /> {lang === "en" ? "Email" : "ईमेल"}</a><button type="button" onClick={shareNative} className="inline-flex items-center gap-2 border border-[#f28c28]/35 px-3 py-2 text-xs font-semibold text-[#f2a85d] transition-colors hover:bg-[#f28c28] hover:text-[#0a0908]"><Share2 className="h-3.5 w-3.5" /> {lang === "en" ? "Share" : "शेयर"}</button></div></div></section>; }

function BlogJournal({ lang }: { lang: Lang }) { const pageUrl = typeof window !== "undefined" ? window.location.origin : "https://bhavishyashakti.manus.space"; const posts = lang === "en" ? [{ id: "laal-kitaab-remedies", label: "Framework note", title: "What Laal Kitaab remedies are meant to do", excerpt: "A concise look at how traditional remedy prompts can become small, repeatable practices when paired with context and a calendar rhythm." }, { id: "vedic-astrology-career", label: "Career clarity", title: "Using Vedic astrology as a reflection tool for career decisions", excerpt: "The useful question is not only what a chart says, but which next action it helps you examine with patience and consistency." }, { id: "calendar-remedy-rhythm", label: "Practical rhythm", title: "Why a calendar can make a remedy easier to follow", excerpt: "Reminders create a visible place for practice. They turn an intention into a sequence of small actions you can review." }] : [{ id: "laal-kitaab-remedies", label: "पद्धति नोट", title: "लाल किताब के उपाय किस तरह मदद करते हैं", excerpt: "जब पारंपरिक उपायों को संदर्भ और कैलेंडर की लय के साथ जोड़ा जाता है, तो वे छोटे और दोहराए जा सकने वाले अभ्यास बन सकते हैं।" }, { id: "vedic-astrology-career", label: "करियर स्पष्टता", title: "करियर निर्णयों के लिए वैदिक ज्योतिष को चिंतन के रूप में देखें", excerpt: "सवाल सिर्फ यह नहीं कि कुंडली क्या कहती है, बल्कि यह भी कि वह आपको धैर्य और निरंतरता के साथ कौन-सा अगला कदम देखने में मदद करती है।" }, { id: "calendar-remedy-rhythm", label: "व्यावहारिक लय", title: "कैलेंडर उपाय को निभाना आसान क्यों बनाता है", excerpt: "रिमाइंडर अभ्यास के लिए एक स्पष्ट जगह बनाते हैं। वे संकल्प को छोटे, समीक्षा योग्य कदमों में बदलते हैं।" }]; return <section id="journal" className="border-t border-[#f28c28]/10 bg-[#11100e] py-20 lg:py-24"><div className="bs-shell"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><div className="eyebrow"><span /> {lang === "en" ? "The BhavishyaShakti journal" : "भविष्यशक्ति जर्नल"}</div><h2 className="bs-serif max-w-[560px] text-5xl font-semibold leading-[0.95] sm:text-6xl">{lang === "en" ? "Short reads for a steadier practice." : "एक स्थिर अभ्यास के लिए छोटे लेख।"}</h2></div><p className="max-w-[360px] text-sm leading-6 text-[#a79787]">{lang === "en" ? "Shareable astrology and ritual notes written to answer real questions without overpromising." : "अधिक वादे किए बिना वास्तविक सवालों पर लिखे साझा करने योग्य ज्योतिष और अभ्यास नोट्स।"}</p></div><div className="mt-10 grid gap-4 lg:grid-cols-3">{posts.map((post) => { const articleUrl = `${pageUrl}/journal/${post.id}`; const shareCopy = `${post.title} — ${articleUrl}`; return <article id={post.id} key={post.id} className="flex h-full flex-col border border-[#f28c28]/15 bg-[#15110f] p-5"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f28c28]">{post.label}</p><h3 className="bs-serif mt-4 text-3xl font-semibold leading-tight"><a href={`/journal/${post.id}`} className="hover:text-[#f2a85d]">{post.title}</a></h3><p className="mt-4 flex-1 text-sm leading-6 text-[#a79787]">{post.excerpt}</p><div className="mt-6 flex items-center justify-between border-t border-[#f28c28]/10 pt-4"><span className="text-[10px] uppercase tracking-[0.14em] text-[#786d63]">{lang === "en" ? "2 min read" : "2 मिनट"}</span><div className="flex gap-2"><a onClick={() => trackEvent("share_click", { channel: "whatsapp", surface: "journal_card", article: post.id, language: lang })} href={`https://wa.me/?text=${encodeURIComponent(shareCopy)}`} target="_blank" rel="noreferrer" aria-label={lang === "en" ? `Share ${post.title} on WhatsApp` : `${post.title} को व्हाट्सऐप पर शेयर करें`} className="text-[#f2a85d] hover:text-[#f28c28]"><MessageCircle className="h-4 w-4" /></a><a onClick={() => trackEvent("share_click", { channel: "email", surface: "journal_card", article: post.id, language: lang })} href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(shareCopy)}`} aria-label={lang === "en" ? `Email ${post.title}` : `${post.title} ईमेल करें`} className="text-[#f2a85d] hover:text-[#f28c28]"><Mail className="h-4 w-4" /></a></div></div></article>; })}</div></div></section>; }