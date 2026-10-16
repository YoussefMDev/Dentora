export type DemoServiceCategoryId =
  | 'general-preventive'
  | 'cosmetic'
  | 'restorative'
  | 'orthodontics'
  | 'emergency'
  | 'endodontics';

export interface DemoServiceCategory {
  id: DemoServiceCategoryId;
  title: string;
  summary: string;
  icon: string;
  tone: 'lime' | 'paper' | 'navy';
  serviceSlugs: string[];
}

export interface DemoService {
  slug: string;
  title: string;
  categoryId: DemoServiceCategoryId;
  category: string;
  summary: string;
  description: string;
  overview: string;
  duration: string;
  icon: string;
  tone: 'lime' | 'paper' | 'navy';
  details: string[];
  commonReasons: string[];
  consultation: string[];
  faqs: { question: string; answer: string }[];
}

export const demoServiceCategories: DemoServiceCategory[] = [
  { id: 'general-preventive', title: 'General & Preventive Dentistry', summary: 'Routine care and conversations about keeping your mouth healthy.', icon: '✳', tone: 'lime', serviceSlugs: ['dental-checkup', 'professional-cleaning'] },
  { id: 'cosmetic', title: 'Cosmetic Dentistry', summary: 'Learn about options people may discuss when they have smile-related goals.', icon: '⌁', tone: 'paper', serviceSlugs: ['smile-consultation'] },
  { id: 'restorative', title: 'Restorative Dentistry', summary: 'Explore general information about repairing or replacing damaged teeth.', icon: '◌', tone: 'navy', serviceSlugs: ['tooth-restoration'] },
  { id: 'orthodontics', title: 'Orthodontics', summary: 'A starting point for questions about tooth alignment and bite.', icon: '⌗', tone: 'lime', serviceSlugs: ['alignment-consultation'] },
  { id: 'emergency', title: 'Emergency Dental Care', summary: 'General guidance on arranging prompt professional advice for urgent concerns.', icon: '↗', tone: 'paper', serviceSlugs: ['urgent-dental-concern'] },
  { id: 'endodontics', title: 'Endodontics', summary: 'Understand the kinds of questions a dentist may discuss about tooth pain.', icon: '◎', tone: 'navy', serviceSlugs: ['tooth-pain-consultation'] },
];

const generalFaqs = [
  { question: 'Will I receive a diagnosis from this page?', answer: 'No. This is general demo information only. A qualified dental professional would need to assess an individual situation before discussing a diagnosis or care options.' },
  { question: 'Can I confirm availability or cost here?', answer: 'No. The Dentora project is a demonstration. A real clinic would confirm services, appointment availability, and fees directly.' },
];

export const demoServices: DemoService[] = [
  {
    slug: 'dental-checkup', title: 'Dental checkup', categoryId: 'general-preventive', category: 'General & Preventive Dentistry',
    summary: 'A routine visit can make space for questions and a general review.',
    description: 'A checkup is an opportunity to talk with a dental professional about your oral health and any questions you have. This page is educational demo content, not an offer of a particular service.',
    overview: 'A dental checkup may include a discussion of your concerns and a clinical examination when appropriate. What happens depends on your individual needs and the clinician’s assessment.',
    duration: 'Confirmed by a real clinic', icon: '✳', tone: 'lime',
    details: ['A conversation about your goals and concerns', 'An examination if appropriate', 'Clear next steps discussed with you'],
    commonReasons: ['You are arranging routine care.', 'You have a question about your oral health.', 'You would like to discuss a change you have noticed.'],
    consultation: ['The clinician may ask about your concerns and relevant dental history.', 'They may examine your teeth and gums, with your agreement.', 'They can explain any recommended next steps and answer questions.'], faqs: generalFaqs,
  },
  {
    slug: 'professional-cleaning', title: 'Professional cleaning', categoryId: 'general-preventive', category: 'General & Preventive Dentistry',
    summary: 'Learn what a cleaning conversation may cover and what to ask.',
    description: 'A dental professional can explain whether a cleaning is appropriate for you and what it may involve. Individual recommendations require an assessment.',
    overview: 'Professional cleaning is a general term for care intended to remove deposits from teeth. The method and suitability vary, and a clinician can discuss what is appropriate for an individual.',
    duration: 'Confirmed by a real clinic', icon: '✧', tone: 'paper',
    details: ['Discuss your routine and any sensitivities', 'Ask what a visit may involve', 'Agree on next steps after professional guidance'],
    commonReasons: ['You want to ask about routine dental care.', 'You have questions about gum or tooth sensitivity.', 'You would like professional guidance on home care.'],
    consultation: ['Share any concerns or sensitivities before care begins.', 'Ask the clinician to explain the proposed steps.', 'Discuss any follow-up recommendations.'], faqs: generalFaqs,
  },
  {
    slug: 'smile-consultation', title: 'Smile goals consultation', categoryId: 'cosmetic', category: 'Cosmetic Dentistry',
    summary: 'Start with a conversation about the changes you are considering.',
    description: 'A consultation can help you understand general options related to appearance goals. No particular treatment or outcome is promised by this demo page.',
    overview: 'Cosmetic dentistry describes a range of possible approaches. A qualified clinician would discuss considerations, limitations, and suitability after learning about the individual’s goals and oral health.',
    duration: 'Confirmed by a real clinic', icon: '⌁', tone: 'navy',
    details: ['Share what matters to you', 'Discuss possible approaches and considerations', 'Make an informed decision without pressure'],
    commonReasons: ['You have questions about the appearance of your smile.', 'You want to understand possible options and trade-offs.', 'You would like to know what information an assessment may require.'],
    consultation: ['Talk through your goals and expectations.', 'Discuss general options, risks, and limitations.', 'Allow the clinician to assess suitability before any recommendation.'], faqs: generalFaqs,
  },
  {
    slug: 'tooth-restoration', title: 'Tooth restoration discussion', categoryId: 'restorative', category: 'Restorative Dentistry',
    summary: 'Understand the questions that may come up when a tooth needs attention.',
    description: 'Restorative care can refer to different ways of addressing tooth damage. An individual recommendation depends on an examination by a dental professional.',
    overview: 'A restorative consultation is a chance to discuss a concern, possible approaches, and what further assessment might be needed. This demo does not describe a diagnosis or treatment plan.',
    duration: 'Confirmed by a real clinic', icon: '◌', tone: 'paper',
    details: ['Talk through the concern and its history', 'Understand possible assessment steps', 'Review options only after professional guidance'],
    commonReasons: ['You have noticed damage or a change to a tooth.', 'You have questions about a previous restoration.', 'You want to understand what a dental assessment involves.'],
    consultation: ['Describe what you noticed and when it began.', 'The clinician may examine the area and discuss further assessment.', 'Ask about options, considerations, and follow-up.'], faqs: generalFaqs,
  },
  {
    slug: 'alignment-consultation', title: 'Alignment consultation', categoryId: 'orthodontics', category: 'Orthodontics',
    summary: 'Bring your questions about tooth alignment and bite to a professional.',
    description: 'Orthodontics concerns tooth position and bite. A clinician can explain what assessment may involve and whether further advice is appropriate.',
    overview: 'An alignment consultation may explore a person’s goals, oral health, and possible assessment needs. This demo does not imply that a specific appliance or treatment is offered.',
    duration: 'Confirmed by a real clinic', icon: '⌗', tone: 'lime',
    details: ['Share what you would like to understand', 'Discuss assessment and general considerations', 'Review next steps with a dental professional'],
    commonReasons: ['You have questions about tooth position or bite.', 'You are considering whether to seek an orthodontic opinion.', 'You want to understand what an initial discussion may cover.'],
    consultation: ['Describe your questions and goals.', 'The clinician may explain possible assessment requirements.', 'Discuss potential next steps without assuming a treatment plan.'], faqs: generalFaqs,
  },
  {
    slug: 'urgent-dental-concern', title: 'Urgent dental concern', categoryId: 'emergency', category: 'Emergency Dental Care',
    summary: 'General information for people seeking prompt professional guidance.',
    description: 'If you have a sudden dental concern, contact a qualified local dental professional for advice. This demonstration cannot assess urgency or arrange care.',
    overview: 'Urgent dental needs vary. A dental professional can ask about the situation and advise what to do next. For a life-threatening emergency, contact local emergency services immediately.',
    duration: 'Contact a real clinic directly', icon: '↗', tone: 'navy',
    details: ['Explain the concern to a qualified professional', 'Follow local emergency guidance if the situation is severe', 'Do not rely on this demo page for triage'],
    commonReasons: ['A new or worsening dental concern needs prompt advice.', 'You are unsure which local care service to contact.', 'You need professional guidance about next steps.'],
    consultation: ['Contact a real local dental service directly.', 'Describe the symptoms and when they began.', 'If you believe there is immediate danger, contact local emergency services.'], faqs: generalFaqs,
  },
  {
    slug: 'tooth-pain-consultation', title: 'Tooth pain consultation', categoryId: 'endodontics', category: 'Endodontics',
    summary: 'Learn what a dentist may ask when you have concerns about tooth pain.',
    description: 'Tooth pain can have many causes. A dental professional must assess an individual concern; this demo is not a diagnostic tool.',
    overview: 'Endodontics is a dental field concerned with the inside of a tooth. If you have pain, a clinician can assess the cause and explain whether specialist advice or further investigation is appropriate.',
    duration: 'Confirmed by a real clinic', icon: '◎', tone: 'paper',
    details: ['Describe the concern and any changes', 'Ask what assessment may be appropriate', 'Discuss next steps with a qualified clinician'],
    commonReasons: ['You have pain or sensitivity and want professional advice.', 'You would like to discuss a previous dental concern.', 'You want to understand what an assessment may involve.'],
    consultation: ['Describe the location, timing, and nature of your concern.', 'The clinician may examine the area and discuss further assessment.', 'Follow professional advice about next steps.'], faqs: generalFaqs,
  },
];

export interface DemoGalleryItem {
  id: string;
  title: string;
  category: 'Studio' | 'Clinical details' | 'Care experience';
  caption: string;
  image: string;
  imageAlt: string;
}

export const demoGallery: DemoGalleryItem[] = [
  { id: 'studio-light', title: 'A calm place to begin', category: 'Studio', caption: 'Unsplash stock photo · illustrative setting, not Dentora premises', image: '/images/clinic-room-monitor.webp', imageAlt: 'Empty dental treatment room with a chair and monitor, shown as illustrative stock photography.' },
  { id: 'detail-tools', title: 'Details of a care setting', category: 'Clinical details', caption: 'Unsplash stock photo · illustrative setting, not Dentora equipment', image: '/images/dental-equipment.webp', imageAlt: 'Dental instruments and equipment console in an empty room, shown as illustrative stock photography.' },
  { id: 'care-space', title: 'Room for a conversation', category: 'Care experience', caption: 'Unsplash stock photo · no patient shown, not Dentora premises', image: '/images/treatment-room.webp', imageAlt: 'Unoccupied dental consultation room, shown as illustrative stock photography.' },
  { id: 'warm-studio', title: 'A little room to breathe', category: 'Studio', caption: 'Unsplash stock photo · illustrative setting, not Dentora premises', image: '/images/clinic-room-lights.webp', imageAlt: 'Unoccupied dental room with a chair and overhead light, shown as illustrative stock photography.' },
  { id: 'detail-room', title: 'A closer look at the room', category: 'Clinical details', caption: 'Unsplash stock photo · no patient shown, not Dentora equipment', image: '/images/clinic-room-monitor.webp', imageAlt: 'Dental chair and monitor in an empty room, shown as illustrative stock photography.' },
  { id: 'visit-ready', title: 'A space ready for a visit', category: 'Care experience', caption: 'Unsplash stock photo · illustrative setting, not Dentora premises', image: '/images/clinic-room-lights.webp', imageAlt: 'Empty dental treatment room photographed as a general visual example.' },
];
