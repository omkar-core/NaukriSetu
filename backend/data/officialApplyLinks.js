const OFFICIAL_APPLY_LINKS = {
  'indian army': 'https://joinindianarmy.nic.in',
  'indian navy': 'https://joinindiannavy.gov.in',
  'indian air force': 'https://agnpathvayu.cdac.in',
  'air force': 'https://careerairforce.nic.in',
  'drdo': 'https://drdo.gov.in/careers',
  'defence research and development organisation': 'https://drdo.gov.in/careers',
  'isro': 'https://isro.gov.in/Careers.html',
  'indian space research organisation': 'https://isro.gov.in/Careers.html',
  'ssc': 'https://ssc.gov.in',
  'staff selection commission': 'https://ssc.gov.in',
  'upsc': 'https://upsc.gov.in',
  'union public service commission': 'https://upsc.gov.in',
  'rrb': 'https://indianrailways.gov.in',
  'railway recruitment board': 'https://indianrailways.gov.in',
  'indian railways': 'https://indianrailways.gov.in',
  'aicte': 'https://internship.aicte-india.org',
  'all india council for technical education': 'https://internship.aicte-india.org',
  'apprenticeship india': 'https://apprenticeshipindia.gov.in',
  'ncs': 'https://ncs.gov.in',
  'national career service': 'https://ncs.gov.in',
  'ibps': 'https://ibps.in',
  'institute of banking personnel selection': 'https://ibps.in',
  'sbi': 'https://sbi.co.in/careers',
  'state bank of india': 'https://sbi.co.in/careers',
  'rbi': 'https://rbi.org.in/Scripts/Opportunities.aspx',
  'reserve bank of india': 'https://rbi.org.in/Scripts/Opportunities.aspx',
  'hal': 'https://hal-india.co.in/career',
  'hindustan aeronautics limited': 'https://hal-india.co.in/career',
  'bhel': 'https://careers.bhel.in',
  'bharat heavy electricals limited': 'https://careers.bhel.in',
  'ongc': 'https://ongcindia.com/careers',
  'oil and natural gas corporation': 'https://ongcindia.com/careers',
  'ntpc': 'https://ntpc.co.in/en/careers',
  'employment news': 'https://employmentnews.gov.in',
  'kvs': 'https://kvsangathan.nic.in',
  'kendriya vidyalaya sangathan': 'https://kvsangathan.nic.in',
  'nvs': 'https://navodaya.gov.in',
  'navodaya vidyalaya samiti': 'https://navodaya.gov.in',
};

export function findOfficialLink(organizationName) {
  if (!organizationName) return null;
  const name = organizationName.toLowerCase().trim();
  const keys = Object.keys(OFFICIAL_APPLY_LINKS);
  for (const key of keys) {
    if (name.includes(key)) {
      return OFFICIAL_APPLY_LINKS[key];
    }
  }
  return null;
}

export default OFFICIAL_APPLY_LINKS;
