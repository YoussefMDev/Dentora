export interface DemoService {
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  duration: string;
  icon: string;
  tone: 'lime' | 'paper' | 'navy';
  details: string[];
}

export const demoServices: DemoService[] = [
  {
    slug: 'everyday-care', title: 'Everyday care', category: 'Preventive',
    summary: 'Checkups and cleanings, with time for your questions.',
    description: 'A considered starting point for routine dental care. This demo description is illustrative; care plans and availability would be confirmed by the clinic.',
    duration: 'Around 45 minutes', icon: '✳', tone: 'lime',
    details: ['A conversation about your goals and concerns', 'A routine examination, when appropriate', 'Clear next steps discussed with you'],
  },
  {
    slug: 'restore-renew', title: 'Restore & renew', category: 'Restorative',
    summary: 'Options explained clearly, at a pace that feels right.',
    description: 'Explore restorative care through a conversation with a dental professional. This demo content does not promise a treatment, result, or clinical outcome.',
    duration: 'Varies by visit', icon: '◌', tone: 'paper',
    details: ['A chance to talk through your concerns', 'Options tailored after a clinical assessment', 'Time to understand the proposed next steps'],
  },
  {
    slug: 'confidence-care', title: 'Confidence care', category: 'Cosmetic',
    summary: 'Start with a conversation about the smile you have in mind.',
    description: 'A demonstration of how cosmetic-care information could be presented. Suitability and options can only be discussed after an individual professional assessment.',
    duration: 'Consultation first', icon: '⌁', tone: 'navy',
    details: ['Share what matters to you', 'Discuss possible approaches and considerations', 'Make an informed decision without pressure'],
  },
];

export interface DemoGalleryItem {
  id: string;
  title: string;
  category: 'Studio' | 'Smile details' | 'Care';
  caption: string;
  art: string;
}

export const demoGallery: DemoGalleryItem[] = [
  { id: 'studio-light', title: 'A calm place to begin', category: 'Studio', caption: 'Illustrative studio scene · demo artwork', art: 'studio' },
  { id: 'smile-lines', title: 'A smile, in simple lines', category: 'Smile details', caption: 'Abstract illustration · not a patient image', art: 'smile' },
  { id: 'care-conversation', title: 'Care starts with listening', category: 'Care', caption: 'Illustrative scene · demo artwork', art: 'conversation' },
  { id: 'warm-studio', title: 'A little room to breathe', category: 'Studio', caption: 'Illustrative studio scene · demo artwork', art: 'warm' },
  { id: 'smile-shape', title: 'A brighter point of view', category: 'Smile details', caption: 'Abstract illustration · no treatment outcome shown', art: 'shape' },
  { id: 'care-notes', title: 'Your questions welcome', category: 'Care', caption: 'Illustrative scene · demo artwork', art: 'notes' },
];
