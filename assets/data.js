/* =============================================================
   Data layer — edit this file to update the whole site.
   PRODUCTS / LOT_DATA are demo records. Replace with verified data.
   Images: put files in images/<id>.png (relative web path). Local
   file:///D:/... paths will NOT load on a hosted site.
   ============================================================= */

window.CONFIG = {
  brand: 'Peptide Scientific',
  email: 'abc@abc.com',
  phoneDisplay: '+86 15866781826',
  phoneIntl: '8615866781826', // digits only, for wa.me
  /** Optional Formspree endpoint. Leave '' to fall back to mailto. */
  formEndpoint: '',
};

window.CATEGORIES = {
  standards: 'Reference Standards',
  synthesis: 'Custom Synthesis',
  analytics: 'Analytical Services',
};

window.PRODUCTS = [
  {
    id: 'bpc-157',
    name: 'BPC-157 Reference Standard',
    category: 'standards',
    cas: '137525-51-0',
    mw: '1419.5 Da',
    purity: '≥98%',
    icon: 'flask-conical',
    image: 'images/bpc-157.png',
    summary: 'Lyophilised pentadecapeptide reference standard, supplied with a batch-specific COA and SDS for in-vitro research.',
    variants: ['5 mg', '10 mg', '25 mg'],
  },
  {
    id: 'tb-500',
    name: 'TB-500 Reference Standard',
    category: 'standards',
    cas: '77591-33-4',
    mw: '889.0 Da',
    purity: '≥98%',
    icon: 'flask-conical',
    image: 'images/tb-500.png',
    summary: 'Thymosin beta-4 fragment (17–23) reference standard for in-vitro assay development and method validation.',
    variants: ['5 mg', '10 mg', '25 mg'],
  },
  {
    id: 'mots-c',
    name: 'MOTS-c Reference Standard',
    category: 'standards',
    cas: '1963811-16-3',
    mw: '2170.6 Da',
    purity: '≥97%',
    icon: 'flask-conical',
    image: 'images/mots-c.png',
    summary: 'Mitochondrial-derived peptide reference standard, ≥97% by HPLC, suitable for in-vitro analytical work.',
    variants: ['5 mg', '10 mg'],
  },
  {
    id: 'glp1-7-36',
    name: 'GLP-1 (7-36) Amide Reference Standard',
    category: 'standards',
    cas: '107444-51-9',
    mw: '3297.7 Da',
    purity: '≥95%',
    icon: 'flask-conical',
    image: 'images/glp1-7-36.png',
    summary: 'Analytical reference standard for in-vitro receptor and assay studies. Not for human use.',
    variants: ['1 mg', '5 mg'],
  },
  {
    id: 'custom-synthesis',
    name: 'Custom Peptide Synthesis',
    category: 'synthesis',
    cas: '',
    mw: '',
    purity: '≥95% target',
    icon: 'layers',
    image: 'images/custom-synthesis.png',
    summary: 'Sequence-to-vial custom synthesis with HPLC purification and independent MS confirmation. Gram scale available.',
    variants: ['≤10 mg', '100 mg', '1 g'],
  },
  {
    id: 'analytical',
    name: 'HPLC & LC-MS Analytical Services',
    category: 'analytics',
    cas: '',
    mw: '',
    purity: 'Method validation',
    icon: 'microscope',
    image: 'images/analytical.png',
    summary: 'Independent purity and identity testing: RP-HPLC, ESI-LC-MS, water content and appearance, with a signed report.',
    variants: ['HPLC only', 'HPLC + LC-MS'],
  },
];

window.LOT_DATA = {
  'PS-BPC-2411-05': {
    product: 'BPC-157 Reference Standard',
    cas: '137525-51-0',
    lot: 'PS-BPC-2411-05',
    hplc: '99.1%',
    msObserved: '1419.6',
    msTheoretical: '1419.5',
    msDelta: '+0.1 Da',
    netContent: '10.2 mg (nominal 10 mg)',
    lab: 'Independent third-party laboratory',
    tested: '2024-11-12',
    method: 'RP-HPLC (214 nm) · ESI-LC-MS',
    status: 'Released',
  },
  'PS-TB-2410-02': {
    product: 'TB-500 Reference Standard',
    cas: '77591-33-4',
    lot: 'PS-TB-2410-02',
    hplc: '98.6%',
    msObserved: '889.1',
    msTheoretical: '889.0',
    msDelta: '+0.1 Da',
    netContent: '5.1 mg (nominal 5 mg)',
    lab: 'Independent third-party laboratory',
    tested: '2024-10-21',
    method: 'RP-HPLC (214 nm) · ESI-LC-MS',
    status: 'Released',
  },
  'PS-MOTS-2412-01': {
    product: 'MOTS-c Reference Standard',
    cas: '1963811-16-3',
    lot: 'PS-MOTS-2412-01',
    hplc: '97.8%',
    msObserved: '2170.9',
    msTheoretical: '2170.6',
    msDelta: '+0.3 Da',
    netContent: '10.1 mg (nominal 10 mg)',
    lab: 'Independent third-party laboratory',
    tested: '2024-12-03',
    method: 'RP-HPLC (214 nm) · ESI-LC-MS',
    status: 'Released',
  },
};
