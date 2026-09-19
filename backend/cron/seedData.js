import { writeFileSync, existsSync, readFileSync } from 'fs';
import { logger } from '../utils/logger.js';
import { dataPath } from '../utils/paths.js';

function generateId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function randomDate(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(Math.random() * daysAhead) + 7);
  return d.toISOString().split('T')[0];
}

function seededInternships() {
  return [
    { id: generateId('int'), title: 'Summer Research Internship at ISRO', organization: 'Indian Space Research Organisation (ISRO)', tags: ['URGENT'], stipendDisplay: '₹25,000/month', duration: '2 Months', eligibility: 'B.Tech/BE in CSE/ECE/ME', lastDate: randomDate(20), officialLink: 'https://isro.gov.in/careers' },
    { id: generateId('int'), title: 'Software Development Intern at DRDO', organization: 'Defence Research & Development Organisation', tags: ['NEW'], stipendDisplay: '₹30,000/month', duration: '6 Months', eligibility: 'B.Tech/BE in Computer Science', lastDate: randomDate(15), officialLink: 'https://drdo.gov.in/careers' },
    { id: generateId('int'), title: 'Data Analytics Intern at NITI Aayog', organization: 'NITI Aayog, Government of India', tags: ['NEW'], stipendDisplay: '₹20,000/month', duration: '3 Months', eligibility: 'Graduation in Economics/Statistics', lastDate: randomDate(25), officialLink: 'https://niti.gov.in' },
    { id: generateId('int'), title: 'Civil Engineering Intern at NHAI', organization: 'National Highways Authority of India', tags: ['GOVT'], stipendDisplay: '₹18,000/month', duration: '6 Months', eligibility: 'B.Tech/BE in Civil Engineering', lastDate: randomDate(30), officialLink: 'https://nhai.gov.in' },
    { id: generateId('int'), title: 'Legal Intern at Law Commission of India', organization: 'Law Commission of India', tags: ['NEW'], stipendDisplay: '₹15,000/month', duration: '3 Months', eligibility: 'LLB/LLM', lastDate: randomDate(20), officialLink: 'https://lawcommissionofindia.nic.in' },
    { id: generateId('int'), title: 'Digital Marketing Intern at Ministry of Tourism', organization: 'Ministry of Tourism, Government of India', tags: ['GOVT'], stipendDisplay: '₹12,000/month', duration: '6 Months', eligibility: 'Any Graduate with Digital Marketing skills', lastDate: randomDate(18), officialLink: 'https://tourism.gov.in' },
  ];
}

function seededApprenticeships() {
  return [
    { id: generateId('app'), type: 'Railway', vacancies: 2500, title: 'Apprentice Training at Indian Railways', organization: 'Indian Railways (RRB)', trade: 'Fitter, Welder, Electrician', stipend: '₹8,000 - ₹12,000/month', qualification: '10th/ITI Pass', officialLink: 'https://www.rrb.gov.in' },
    { id: generateId('app'), type: 'PSU', vacancies: 1500, title: 'Trade Apprentice at BHEL', organization: 'Bharat Heavy Electricals Limited', trade: 'Machinist, Turner, Electrician', stipend: '₹9,000 - ₹14,000/month', qualification: 'ITI in relevant trade', officialLink: 'https://www.bhel.com' },
    { id: generateId('app'), type: 'Skill India', vacancies: 5000, title: 'Apprenticeship under NAPS', organization: 'National Apprenticeship Promotion Scheme', trade: 'Retail, IT, BFSI, Logistics', stipend: '₹7,000 - ₹15,000/month', qualification: '8th/10th/12th Pass', officialLink: 'https://www.apprenticeshipindia.gov.in' },
    { id: generateId('app'), type: 'Government Factory', vacancies: 800, title: 'Apprentice at Ordnance Factory Board', organization: 'Ordnance Factory Board, Ministry of Defence', trade: 'Fitter, Machinist, Electrician, Carpenter', stipend: '₹8,000 - ₹11,000/month', qualification: 'ITI/Diploma in relevant trade', officialLink: 'https://ofb.gov.in' },
    { id: generateId('app'), type: 'PSU', vacancies: 1200, title: 'Graduate Apprentice at GAIL', organization: 'GAIL (India) Limited', trade: 'Engineering (Mechanical, Electrical, Civil)', stipend: '₹15,000 - ₹20,000/month', qualification: 'B.Tech/BE in relevant branch', officialLink: 'https://www.gailonline.com' },
    { id: generateId('app'), type: 'Railway', vacancies: 3500, title: 'Act Apprentice at South Eastern Railway', organization: 'South Eastern Railway (Ministry of Railways)', trade: 'Fitter, Electrician, Welder, Machinist', stipend: '₹7,000 - ₹12,000/month', qualification: '10th + ITI in relevant trade', officialLink: 'https://www.ser.indianrailways.gov.in' },
  ];
}

function seededResults() {
  return [
    { id: generateId('res'), examName: 'SSC CGL 2025 Tier I Result', conductingBody: 'Staff Selection Commission (SSC)', status: 'declared', resultDate: '2026-05-10', resultLink: 'https://ssc.gov.in' },
    { id: generateId('res'), examName: 'UPSC Civil Services 2025 Prelims Result', conductingBody: 'Union Public Service Commission (UPSC)', status: 'declared', resultDate: '2026-05-12', resultLink: 'https://upsc.gov.in' },
    { id: generateId('res'), examName: 'RRB NTPC 2025 Graduate Level Result', conductingBody: 'Railway Recruitment Board (RRB)', status: 'expected', resultDate: '2026-06-15', resultLink: 'https://rrb.gov.in' },
    { id: generateId('res'), examName: 'IBPS PO 2025 Mains Result', conductingBody: 'Institute of Banking Personnel Selection (IBPS)', status: 'declared', resultDate: '2026-05-08', resultLink: 'https://ibps.in' },
    { id: generateId('res'), examName: 'Indian Navy SSR AA 2025 Result', conductingBody: 'Indian Navy (Ministry of Defence)', status: 'declared', resultDate: '2026-05-05', resultLink: 'https://www.joinindiannavy.gov.in' },
    { id: generateId('res'), examName: 'BPSC 71st Combined Competitive Exam Result', conductingBody: 'Bihar Public Service Commission (BPSC)', status: 'expected', resultDate: '2026-07-01', resultLink: 'https://bpsc.bih.nic.in' },
  ];
}

function seededAdmitCards() {
  return [
    { id: generateId('adm'), examName: 'SSC CHSL 2025 Tier I Admit Card', conductingBody: 'Staff Selection Commission (SSC)', releaseDate: '2026-05-14', examDate: '2026-06-01', downloadLink: 'https://ssc.gov.in', instructions: 'Carry a printed copy along with a valid photo ID.' },
    { id: generateId('adm'), examName: 'UPSC CAPF 2025 Admit Card', conductingBody: 'Union Public Service Commission (UPSC)', releaseDate: '2026-05-10', examDate: '2026-05-28', downloadLink: 'https://upsc.gov.in', instructions: 'Carry a printed copy along with a valid photo ID.' },
    { id: generateId('adm'), examName: 'RRB ALP 2025 CBT Admit Card', conductingBody: 'Railway Recruitment Board (RRB)', releaseDate: '2026-05-12', examDate: '2026-06-05', downloadLink: 'https://rrb.gov.in', instructions: 'Carry a printed copy along with a valid photo ID.' },
    { id: generateId('adm'), examName: 'IBPS Clerk 2025 Prelims Admit Card', conductingBody: 'Institute of Banking Personnel Selection (IBPS)', releaseDate: '2026-05-08', examDate: '2026-05-25', downloadLink: 'https://ibps.in', instructions: 'Carry a printed copy along with a valid photo ID.' },
    { id: generateId('adm'), examName: 'Indian Army Soldier GD 2025 Admit Card', conductingBody: 'Indian Army (Ministry of Defence)', releaseDate: '2026-05-06', examDate: '2026-06-10', downloadLink: 'https://www.joinindianarmy.nic.in', instructions: 'Carry a printed copy along with a valid photo ID.' },
    { id: generateId('adm'), examName: 'UPPSC RO ARO 2025 Admit Card', conductingBody: 'Uttar Pradesh Public Service Commission (UPPSC)', releaseDate: '2026-05-11', examDate: '2026-05-30', downloadLink: 'https://uppsc.up.nic.in', instructions: 'Carry a printed copy along with a valid photo ID.' },
  ];
}

function seededNotifications() {
  return [
    { id: generateId('not'), title: 'Extension of Last Date for SSC CGL 2026 Applications', organization: 'Staff Selection Commission', summary: 'Last date extended to 15th June 2026. Candidates can now apply online.', link: 'https://ssc.gov.in', priority: 'high', validUntil: randomDate(25) },
    { id: generateId('not'), title: 'UPSC Civil Services 2026 Notification Released', organization: 'UPSC', summary: 'UPSC has released 1200 vacancies for Civil Services Examination 2026. Apply now.', link: 'https://upsc.gov.in', priority: 'high', validUntil: randomDate(30) },
    { id: generateId('not'), title: 'New Vacancies Added in Ministry of Defence', organization: 'Ministry of Defence', summary: '500 new posts sanctioned for various defence establishments.', link: 'https://mod.gov.in', priority: 'medium', validUntil: randomDate(20) },
  ];
}

export function seedInitialData() {
  const stores = [
    { file: 'internships.json', generator: seededInternships },
    { file: 'apprenticeships.json', generator: seededApprenticeships },
    { file: 'results.json', generator: seededResults },
    { file: 'admitcards.json', generator: seededAdmitCards },
    { file: 'notifications.json', generator: seededNotifications },
  ];

  for (const { file, generator } of stores) {
    const filePath = dataPath(file);
    if (!existsSync(filePath) || readFileSync(filePath, 'utf8').trim() === '[]') {
      const data = generator();
      writeFileSync(filePath, JSON.stringify(data, null, 2));
      logger.cron(`Seeded ${data.length} items to ${file}`);
    }
  }
}
