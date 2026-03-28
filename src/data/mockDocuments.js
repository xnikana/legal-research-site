export const categories = [
  {
    id: 'planning-board',
    title: 'Planning Board & Audio',
    fullTitle: 'Planning Board Meeting Packets and Audio Recordings',
    description: 'Agendas, minutes, public comments, and official audio recordings of public hearings spanning 2023-2026.',
    iconType: 'users'
  },
  {
    id: 'permit-application',
    title: 'Permit Application',
    fullTitle: 'Comprehensive Permit Application Materials',
    description: 'The 623-page Complete Preliminary Plan, site plans, grading and utility sheets, and procedural documents.',
    iconType: 'file-text'
  },
  {
    id: 'engineering-environmental',
    title: 'Engineering & Environment',
    fullTitle: 'Engineering and Environmental Studies',
    description: 'Technical reports, Traffic Impact Studies, Stormwater Management Narratives, and capacity analyses.',
    iconType: 'activity'
  },
  {
    id: 'town-staff-reviews',
    title: 'Staff & Agency Reviews',
    fullTitle: 'Town Staff and Agency Reviews',
    description: 'Official reviews, staff recommendations, and independent peer-review engineering memos from town departments.',
    iconType: 'clipboard-list'
  },
  {
    id: 'legal-submittals',
    title: 'Legal Submittals',
    fullTitle: 'Legal and Administrative Submittals',
    description: 'Administrative correspondence, requested zoning adjustments, fee waivers, and deeds.',
    iconType: 'scale'
  }
];

export const mockDocuments = {
  'planning-board': [
    { id: 101, title: 'October 2023 Planning Board Meeting Agenda', date: 'Oct 12, 2023', type: 'PDF', size: '2.4 MB' },
    { id: 102, title: 'October 2023 Meeting Official Audio', date: 'Oct 12, 2023', type: 'WAV', size: '450 MB' },
    { id: 103, title: 'Draft Minutes - October 2023', date: 'Oct 15, 2023', type: 'PDF', size: '1.1 MB' },
    { id: 104, title: 'Public Comment Submissions Package', date: 'Oct 12, 2023', type: 'PDF', size: '8.5 MB' }
  ],
  'permit-application': [
    { id: 201, title: 'Complete Preliminary Plan (Belton Court)', date: 'Nov 01, 2023', type: 'PDF', size: '142 MB' },
    { id: 202, title: 'Master Landscaping Plan', date: 'Nov 01, 2023', type: 'PDF', size: '34 MB' },
    { id: 203, title: 'Grading and Utility Sheets', date: 'Nov 01, 2023', type: 'PDF', size: '88 MB' },
    { id: 204, title: 'Comprehensive Permit Applications - FAQ', date: 'Dec 05, 2023', type: 'PDF', size: '1.2 MB' }
  ],
  'engineering-environmental': [
    { id: 301, title: 'Traffic Impact Study (Crossman Engineering)', date: 'Jan 15, 2024', type: 'PDF', size: '15.6 MB' },
    { id: 302, title: 'Stormwater Management Narrative (InSite Engineering)', date: 'Feb 10, 2024', type: 'PDF', size: '22.3 MB' },
    { id: 303, title: 'Sanitary Sewer Capacity Analysis (Pare Corp)', date: 'Mar 01, 2024', type: 'PDF', size: '11.8 MB' },
    { id: 304, title: 'Water Distribution Evaluation', date: 'Mar 01, 2024', type: 'PDF', size: '9.2 MB' }
  ],
  'town-staff-reviews': [
    { id: 401, title: 'Town Planner Staff Recommendations Packet (89 pages)', date: 'Apr 20, 2024', type: 'PDF', size: '18.9 MB' },
    { id: 402, title: 'Peer-Review Engineering Memo (Fuss & O\'Neill)', date: 'Apr 15, 2024', type: 'PDF', size: '4.5 MB' },
    { id: 403, title: 'DPW and Fire Department Evaluations', date: 'Apr 18, 2024', type: 'PDF', size: '3.1 MB' },
    { id: 404, title: 'BCWA Water Service Capabilities Letter', date: 'Apr 05, 2024', type: 'PDF', size: '1.4 MB' }
  ],
  'legal-submittals': [
    { id: 501, title: 'Formal Attorney Submittal & Project Parameters', date: 'May 10, 2024', type: 'PDF', size: '6.7 MB' },
    { id: 502, title: 'Requested Zoning Adjustments Outline', date: 'May 10, 2024', type: 'PDF', size: '2.3 MB' },
    { id: 503, title: 'Application Fee Waiver Request', date: 'May 12, 2024', type: 'PDF', size: '1.1 MB' },
    { id: 504, title: 'Deeds Evidencing Site Control', date: 'May 15, 2024', type: 'PDF', size: '12.5 MB' }
  ]
};
