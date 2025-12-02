export type EmergencySeverity = 1 | 2 | 3 | 4;

export interface SeverityOption {
  level: EmergencySeverity;
  title: string;
  description: string;
  color: string;
}

export interface EmergencyTypeOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  accent: string;
  background: string;
}

export interface QuickContact {
  id: string;
  label: string;
  number: string;
  icon: string;
  background: string;
}

export const severityOptions: SeverityOption[] = [
  {
    level: 1,
    title: 'ระดับ 1 - วิกฤตที่สุด',
    description: 'หยุดหายใจ หมดสติ มีอาการคุกคามชีวิตทันที',
    color: '#dc2626',
  },
  {
    level: 2,
    title: 'ระดับ 2 - วิกฤต',
    description: 'แน่นหน้าอก หายใจลำบาก บาดเจ็บรุนแรง',
    color: '#f97316',
  },
  {
    level: 3,
    title: 'ระดับ 3 - เร่งด่วน',
    description: 'กระดูกหัก มีเลือดออก เจ็บป่วยที่ต้องพบแพทย์ภายใน 30 นาที',
    color: '#facc15',
  },
  {
    level: 4,
    title: 'ระดับ 4 - ไม่รุนแรง',
    description: 'ไข้สูง ปวดท้องรุนแรงที่ยังดูแลได้เองชั่วคราว',
    color: '#22c55e',
  },
];

export const emergencyTypes: EmergencyTypeOption[] = [
  {
    id: 'trauma',
    label: 'อุบัติเหตุ',
    description: 'ขับขี่ ชน ลื่นล้ม พลัดตกจากที่สูง',
    icon: 'car-emergency',
    accent: '#f87171',
    background: '#451a1a',
  },
  {
    id: 'cardiac',
    label: 'หัวใจ',
    description: 'แน่นหน้าอก หัวใจเต้นผิดจังหวะ',
    icon: 'heart-pulse',
    accent: '#fb7185',
    background: '#4a1b2f',
  },
  {
    id: 'breathing',
    label: 'ทางเดินหายใจ',
    description: 'หอบหืด ภูมิแพ้ หายใจลำบาก',
    icon: 'lungs',
    accent: '#38bdf8',
    background: '#0f172a',
  },
  {
    id: 'stroke',
    label: 'หลอดเลือดสมอง',
    description: 'ปากเบี้ยว แขนขาอ่อนแรงเฉียบพลัน',
    icon: 'brain',
    accent: '#a855f7',
    background: '#2e1065',
  },
  {
    id: 'fire',
    label: 'ไฟไหม้/ระเบิด',
    description: 'ไฟไหม้ ระเบิด รั่วไหลสารเคมี',
    icon: 'fire',
    accent: '#fb923c',
    background: '#3b1810',
  },
  {
    id: 'violence',
    label: 'เหตุร้าย',
    description: 'ทำร้าย ปล้น ยิง แทง',
    icon: 'shield-alert',
    accent: '#facc15',
    background: '#422006',
  },
];

export const quickContacts: QuickContact[] = [
  {
    id: 'ems',
    label: 'ศูนย์นเรนทร 1669',
    number: '1669',
    icon: 'ambulance',
    background: '#991b1b',
  },
  {
    id: 'police',
    label: 'ตำรวจ 191',
    number: '191',
    icon: 'police-badge',
    background: '#0f172a',
  },
  {
    id: 'fire',
    label: 'ดับเพลิง 199',
    number: '199',
    icon: 'fire-truck',
    background: '#7c2d12',
  },
  {
    id: 'rescue',
    label: 'มูลนิธิร่วมกตัญญู',
    number: '+6622246999',
    icon: 'account-heart',
    background: '#1e3a8a',
  },
];

