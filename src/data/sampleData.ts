/**
 * CivicLens Built-in Sample Database (Kolkata Municipal Jurisdiction)
 * 
 * Contains:
 * 1. 40+ Historical & Seasonal Waterlogging Records across 12 Months
 * 2. 40+ Clustered Pothole Records across Major Corridors
 * 3. 15+ Solid Waste / Garbage Dumping Records
 * 4. 15+ Streetlight Fault Records
 * 5. 15+ Clogged Storm Drain Records
 * 6. 7 Initial My Reports with Authentic Case Records
 * 7. Quick Sample Photos for 1-Click Report Testing
 */

import { CivicReport, SeverityLevel, CivicCategory } from '../types';

export interface WaterloggingRecord {
  id: string;
  area_name: string;
  ward: string;
  lat: number;
  lng: number;
  month: number; // 1-12
  rainfall_mm: number;
  water_depth_cm: number;
  duration_hours: number;
  severity: SeverityLevel;
  report_count: number;
  cause: 'blocked drain' | 'low-lying' | 'poor slope' | 'overflowing canal' | 'construction';
  traffic_impact: string;
}

export interface MapCivicIssue {
  id: string;
  category: CivicCategory;
  location: string;
  road_name: string;
  lat: number;
  lng: number;
  severity: SeverityLevel;
  date: string;
  status: 'Submitted' | 'In Review' | 'Resolved';
  description: string;
}

// 40+ Key Kolkata Low-Lying & Critical Locations with Base Geo-Data
export const WATERLOGGING_LOCATIONS = [
  { name: 'Thanthania Kalibari (College St)', ward: 'Ward 40', lat: 22.5804, lng: 88.3639, cause: 'low-lying' as const, baseDepth: 65, baseDuration: 8.5 },
  { name: 'Amherst Street (Shraddhanand Park)', ward: 'Ward 38', lat: 22.5762, lng: 88.3685, cause: 'blocked drain' as const, baseDepth: 55, baseDuration: 7.0 },
  { name: 'Camac Street & Middleton Row', ward: 'Ward 63', lat: 22.5511, lng: 88.3541, cause: 'poor slope' as const, baseDepth: 40, baseDuration: 4.5 },
  { name: 'Park Circus 7-Point Crossing', ward: 'Ward 64', lat: 22.5447, lng: 88.3687, cause: 'overflowing canal' as const, baseDepth: 50, baseDuration: 6.0 },
  { name: 'Behala Chowrasta (DH Road)', ward: 'Ward 121', lat: 22.4922, lng: 88.3129, cause: 'construction' as const, baseDepth: 60, baseDuration: 9.0 },
  { name: 'Behala Tram Depot Area', ward: 'Ward 120', lat: 22.5034, lng: 88.3182, cause: 'poor slope' as const, baseDepth: 45, baseDuration: 6.5 },
  { name: 'Ultadanga Underpass', ward: 'Ward 13', lat: 22.5925, lng: 88.3887, cause: 'low-lying' as const, baseDepth: 75, baseDuration: 10.0 },
  { name: 'EM Bypass (Ruby Hospital Crossing)', ward: 'Ward 107', lat: 22.5133, lng: 88.3986, cause: 'overflowing canal' as const, baseDepth: 48, baseDuration: 5.5 },
  { name: 'Central Avenue (MG Road Crossing)', ward: 'Ward 44', lat: 22.5857, lng: 88.3615, cause: 'blocked drain' as const, baseDepth: 58, baseDuration: 7.5 },
  { name: 'Taratala Crossing & Majerhat', ward: 'Ward 80', lat: 22.5152, lng: 88.3175, cause: 'construction' as const, baseDepth: 52, baseDuration: 6.0 },
  { name: 'Kasba (Bosepukur Kasba)', ward: 'Ward 67', lat: 22.5192, lng: 88.3855, cause: 'blocked drain' as const, baseDepth: 46, baseDuration: 5.0 },
  { name: 'VIP Road (Teghoria Chinar Park)', ward: 'Bidhannagar', lat: 22.6247, lng: 88.4358, cause: 'overflowing canal' as const, baseDepth: 62, baseDuration: 8.0 },
  { name: 'Gariahat Market North Gate', ward: 'Ward 86', lat: 22.5186, lng: 88.3644, cause: 'poor slope' as const, baseDepth: 38, baseDuration: 4.0 },
  { name: 'Shyambazar 5-Point Crossing', ward: 'Ward 10', lat: 22.6025, lng: 88.3712, cause: 'blocked drain' as const, baseDepth: 42, baseDuration: 4.5 },
  { name: 'Lake Gardens Railway Underpass', ward: 'Ward 93', lat: 22.5064, lng: 88.3562, cause: 'low-lying' as const, baseDepth: 70, baseDuration: 9.5 },
  { name: 'Patuli Ghoshpara Crossing', ward: 'Ward 101', lat: 22.4746, lng: 88.3812, cause: 'overflowing canal' as const, baseDepth: 44, baseDuration: 5.0 },
  { name: 'Dum Dum Cantonment Underpass', ward: 'Ward 1', lat: 22.6468, lng: 88.4065, cause: 'low-lying' as const, baseDepth: 68, baseDuration: 8.5 },
  { name: 'Tiljala & Topsia Canal Bank', ward: 'Ward 66', lat: 22.5342, lng: 88.3892, cause: 'overflowing canal' as const, baseDepth: 56, baseDuration: 7.0 },
  { name: 'Sealdah Station Flyover Approach', ward: 'Ward 49', lat: 22.5684, lng: 88.3725, cause: 'blocked drain' as const, baseDepth: 45, baseDuration: 5.5 },
  { name: 'Bowbazar (BB Ganguly Street)', ward: 'Ward 48', lat: 22.5695, lng: 88.3621, cause: 'construction' as const, baseDepth: 50, baseDuration: 6.5 },
  { name: 'Tollygunge Phari & Deshapran Sasmal Rd', ward: 'Ward 89', lat: 22.5085, lng: 88.3448, cause: 'poor slope' as const, baseDepth: 48, baseDuration: 5.5 },
  { name: 'Jadavpur 8B Bus Stand Corner', ward: 'Ward 96', lat: 22.4962, lng: 88.3715, cause: 'blocked drain' as const, baseDepth: 36, baseDuration: 3.5 },
  { name: 'Kalighat Sadananda Road', ward: 'Ward 83', lat: 22.5218, lng: 88.3496, cause: 'low-lying' as const, baseDepth: 54, baseDuration: 6.5 },
  { name: 'New Alipore Block O Canal Side', ward: 'Ward 81', lat: 22.5098, lng: 88.3288, cause: 'overflowing canal' as const, baseDepth: 46, baseDuration: 5.0 },
  { name: 'Baguiati VIP Road Service Lane', ward: 'Bidhannagar', lat: 22.6135, lng: 88.4282, cause: 'poor slope' as const, baseDepth: 52, baseDuration: 6.5 },
  { name: 'Khidirpur 5-Point Crossing', ward: 'Ward 76', lat: 22.5385, lng: 88.3262, cause: 'low-lying' as const, baseDepth: 58, baseDuration: 7.0 },
  { name: 'Bhowanipore (Paddapukur Road)', ward: 'Ward 70', lat: 22.5328, lng: 88.3512, cause: 'blocked drain' as const, baseDepth: 38, baseDuration: 4.0 },
  { name: 'Ballygunge Circular Road near Science College', ward: 'Ward 69', lat: 22.5312, lng: 88.3638, cause: 'poor slope' as const, baseDepth: 34, baseDuration: 3.0 },
  { name: 'Phoolbagan Crossing', ward: 'Ward 31', lat: 22.5742, lng: 88.3912, cause: 'construction' as const, baseDepth: 46, baseDuration: 5.0 },
  { name: 'Kankurgachi CIT Road', ward: 'Ward 32', lat: 22.5798, lng: 88.3882, cause: 'blocked drain' as const, baseDepth: 42, baseDuration: 4.5 },
  { name: 'Salt Lake Sector V (College More)', ward: 'Sector V', lat: 22.5732, lng: 88.4335, cause: 'poor slope' as const, baseDepth: 40, baseDuration: 4.0 },
  { name: 'Salt Lake Karunamoyee Bus Station', ward: 'Bidhannagar', lat: 22.5872, lng: 88.4195, cause: 'blocked drain' as const, baseDepth: 36, baseDuration: 3.5 },
  { name: 'Rajarhat Chinar Park Junction', ward: 'Rajarhat', lat: 22.6288, lng: 88.4412, cause: 'overflowing canal' as const, baseDepth: 54, baseDuration: 7.0 },
  { name: 'Prince Anwar Shah Road (South City)', ward: 'Ward 93', lat: 22.5028, lng: 88.3612, cause: 'poor slope' as const, baseDepth: 32, baseDuration: 3.0 },
  { name: 'Mukundapur Crossing (Apex Hospital)', ward: 'Ward 109', lat: 22.4985, lng: 88.4022, cause: 'overflowing canal' as const, baseDepth: 58, baseDuration: 7.5 },
  { name: 'Santoshpur Jadavpur Connector', ward: 'Ward 103', lat: 22.4932, lng: 88.3865, cause: 'low-lying' as const, baseDepth: 52, baseDuration: 6.0 },
  { name: 'Picnic Garden Road Lane', ward: 'Ward 65', lat: 22.5292, lng: 88.3812, cause: 'blocked drain' as const, baseDepth: 48, baseDuration: 6.0 },
  { name: 'Alipore Bodyguard Lines Lane', ward: 'Ward 74', lat: 22.5312, lng: 88.3312, cause: 'poor slope' as const, baseDepth: 35, baseDuration: 3.5 },
  { name: 'Narkeldanga Main Road', ward: 'Ward 29', lat: 22.5712, lng: 88.3795, cause: 'blocked drain' as const, baseDepth: 44, baseDuration: 5.0 },
  { name: 'Belgachia Bridge Northern Approach', ward: 'Ward 3', lat: 22.6085, lng: 88.3812, cause: 'low-lying' as const, baseDepth: 64, baseDuration: 8.0 },
  { name: 'Chitpur Road (Rabindra Sarani)', ward: 'Ward 20', lat: 22.5912, lng: 88.3612, cause: 'blocked drain' as const, baseDepth: 50, baseDuration: 6.0 },
  { name: 'Budge Budge Trunk Road (Taratala)', ward: 'Ward 141', lat: 22.5065, lng: 88.2985, cause: 'construction' as const, baseDepth: 62, baseDuration: 8.5 },
];

// Seasonal Factor Matrix (Month 1 = Jan, Month 12 = Dec)
// Realistic Kolkata rainfall distribution:
// Nov-Feb: minimal/dry
// Apr-May: pre-monsoon convective thunderstorms (Kalbaishakhi)
// Jun-Sep: heavy South-West monsoon
// Oct: post-monsoon cyclone/Puja showers
const MONTH_FACTORS: Record<number, { rainAvg: number; severityFactor: number; trafficImpact: string }> = {
  1: { rainAvg: 12, severityFactor: 0.05, trafficImpact: 'Minimal / Dry pavement conditions' },
  2: { rainAvg: 22, severityFactor: 0.08, trafficImpact: 'Normal road traffic flow' },
  3: { rainAvg: 35, severityFactor: 0.12, trafficImpact: 'Isolated puddle formation' },
  4: { rainAvg: 68, severityFactor: 0.40, trafficImpact: 'Kalbaishakhi storm flash ponding (30-60 mins)' },
  5: { rainAvg: 115, severityFactor: 0.65, trafficImpact: 'Pre-monsoon localized lane blockage' },
  6: { rainAvg: 295, severityFactor: 0.90, trafficImpact: 'Monsoon onset; severe bus and auto lane diversions' },
  7: { rainAvg: 375, severityFactor: 1.00, trafficImpact: 'Peak monsoon; tram services and traffic gridlock' },
  8: { rainAvg: 360, severityFactor: 0.98, trafficImpact: 'Continuous inundation; two-wheeler engine stalls' },
  9: { rainAvg: 310, severityFactor: 0.92, trafficImpact: 'High water levels; arterial corridor bottleneck' },
  10: { rainAvg: 140, severityFactor: 0.55, trafficImpact: 'Puja season showers; slow moving traffic at intersections' },
  11: { rainAvg: 28, severityFactor: 0.10, trafficImpact: 'Post-monsoon dry down; minimal disruption' },
  12: { rainAvg: 8, severityFactor: 0.03, trafficImpact: 'Completely clear road surface' },
};

// Generate full 42 locations x 12 months = 504 data points
export function generateWaterloggingData(): WaterloggingRecord[] {
  const records: WaterloggingRecord[] = [];

  WATERLOGGING_LOCATIONS.forEach((loc, locIdx) => {
    for (let m = 1; m <= 12; m++) {
      const mf = MONTH_FACTORS[m];
      const rainfall_mm = Math.round(mf.rainAvg * (0.85 + (locIdx % 5) * 0.06));
      const water_depth_cm = Math.round(loc.baseDepth * mf.severityFactor * (0.9 + (locIdx % 4) * 0.05));
      const duration_hours = Number((loc.baseDuration * mf.severityFactor * (0.85 + (locIdx % 3) * 0.1)).toFixed(1));
      
      let severity: SeverityLevel = 'Low';
      if (water_depth_cm >= 45) severity = 'Critical';
      else if (water_depth_cm >= 25) severity = 'High';
      else if (water_depth_cm >= 10) severity = 'Medium';

      const report_count = Math.max(1, Math.round(water_depth_cm * 0.8 + (locIdx % 6)));

      records.push({
        id: `WL-${locIdx + 100}-${m}`,
        area_name: loc.name,
        ward: loc.ward,
        lat: loc.lat,
        lng: loc.lng,
        month: m,
        rainfall_mm,
        water_depth_cm,
        duration_hours,
        severity,
        report_count,
        cause: loc.cause,
        traffic_impact: mf.trafficImpact,
      });
    }
  });

  return records;
}

export const ALL_WATERLOGGING_RECORDS = generateWaterloggingData();

// 45+ Sample Pothole Records along Major Kolkata Corridors
export const SAMPLE_POTHOLES: MapCivicIssue[] = [
  { id: 'PH-101', category: 'pothole', location: 'Near Ruby Crossing, northbound lane', road_name: 'EM Bypass', lat: 22.5135, lng: 88.3989, severity: 'Critical', date: '02 Oct 2026', status: 'In Review', description: 'Deep 15cm asphalt crater in fast lane causing 2-wheeler skids.' },
  { id: 'PH-102', category: 'pothole', location: 'Opposite Science City Gate 2', road_name: 'EM Bypass', lat: 22.5401, lng: 88.3952, severity: 'High', date: '01 Oct 2026', status: 'Submitted', description: 'Crater cluster along central carriage way.' },
  { id: 'PH-103', category: 'pothole', location: 'Chingrighata Flyover approach', road_name: 'EM Bypass', lat: 22.5621, lng: 88.4012, severity: 'Critical', date: '03 Oct 2026', status: 'In Review', description: 'Severe road surface peeling and depression near expansion joint.' },
  { id: 'PH-104', category: 'pothole', location: 'Ultadanga Hudco crossing', road_name: 'EM Bypass', lat: 22.5912, lng: 88.3921, severity: 'High', date: '29 Sep 2026', status: 'Resolved', description: 'Bituminous crater repaired with cold mastic asphalt.' },
  { id: 'PH-105', category: 'pothole', location: 'Near Patuli floating market', road_name: 'EM Bypass Connector', lat: 22.4782, lng: 88.3842, severity: 'Medium', date: '28 Sep 2026', status: 'Submitted', description: 'Depression in left lane causing auto-rickshaw wobbles.' },
  
  // Diamond Harbour Road Cluster
  { id: 'PH-106', category: 'pothole', location: 'Behala 14 No. Bus Stand', road_name: 'Diamond Harbour Road', lat: 22.4982, lng: 88.3142, severity: 'Critical', date: '03 Oct 2026', status: 'In Review', description: 'Metro pillar construction diversion with deep waterlogged crater.' },
  { id: 'PH-107', category: 'pothole', location: 'Thakurpukur 3A Bus Stand', road_name: 'Diamond Harbour Road', lat: 22.4642, lng: 88.3052, severity: 'High', date: '02 Oct 2026', status: 'Submitted', description: 'Multiple sharp craters across bus stop boarding point.' },
  { id: 'PH-108', category: 'pothole', location: 'Taratala Mint crossing', road_name: 'Diamond Harbour Road', lat: 22.5182, lng: 88.3212, severity: 'Medium', date: '30 Sep 2026', status: 'Resolved', description: 'Pothole patch filled by PWD civil team.' },
  { id: 'PH-109', category: 'pothole', location: 'Sakherbazar crossing', road_name: 'Diamond Harbour Road', lat: 22.4821, lng: 88.3115, severity: 'High', date: '01 Oct 2026', status: 'In Review', description: 'Submerged pothole after rain in middle lane.' },

  // BT Road Cluster
  { id: 'PH-110', category: 'pothole', location: 'Shyambazar Bridge northern slope', road_name: 'Barrackpore Trunk (BT) Road', lat: 22.6052, lng: 88.3742, severity: 'Critical', date: '02 Oct 2026', status: 'In Review', description: 'Huge road crater at bridge descent causing sudden braking.' },
  { id: 'PH-111', category: 'pothole', location: 'Tala Bridge approach', road_name: 'BT Road', lat: 22.6112, lng: 88.3782, severity: 'High', date: '03 Oct 2026', status: 'Submitted', description: 'Damaged carriage lane with loose aggregate.' },
  { id: 'PH-112', category: 'pothole', location: 'Chiriamore intersection', road_name: 'BT Road', lat: 22.6242, lng: 88.3821, severity: 'Medium', date: '27 Sep 2026', status: 'Resolved', description: 'Bituminous resurfacing completed.' },
  { id: 'PH-113', category: 'pothole', location: 'Dunlop crossing lane 1', road_name: 'BT Road', lat: 22.6512, lng: 88.3762, severity: 'Critical', date: '01 Oct 2026', status: 'Submitted', description: 'Deep trench depression across commercial heavy vehicle route.' },

  // VIP Road Cluster
  { id: 'PH-114', category: 'pothole', location: 'Kestopur foot overbridge', road_name: 'VIP Road (Kazi Nazrul Islam Ave)', lat: 22.5982, lng: 88.4212, severity: 'High', date: '03 Oct 2026', status: 'In Review', description: 'Speed lane pothole causing airport taxi swerving.' },
  { id: 'PH-115', category: 'pothole', location: 'Baguiati Big Bazaar stop', road_name: 'VIP Road', lat: 22.6142, lng: 88.4292, severity: 'Medium', date: '30 Sep 2026', status: 'Submitted', description: 'Service road crater with muddy rainwater.' },
  { id: 'PH-116', category: 'pothole', location: 'Kaikhali crossing near Airport', road_name: 'VIP Road', lat: 22.6392, lng: 88.4382, severity: 'High', date: '02 Oct 2026', status: 'Resolved', description: 'Repaired by state highway division.' },

  // AJC Bose Road & Central Corridors
  { id: 'PH-117', category: 'pothole', location: 'Exide crossing opposite Rabindra Sadan', road_name: 'AJC Bose Road', lat: 22.5412, lng: 88.3482, severity: 'Critical', date: '03 Oct 2026', status: 'In Review', description: 'Severe crater near bus stop forcing buses to halt in second lane.' },
  { id: 'PH-118', category: 'pothole', location: 'Moulali crossing eastern side', road_name: 'AJC Bose Road', lat: 22.5612, lng: 88.3692, severity: 'High', date: '01 Oct 2026', status: 'Submitted', description: 'Dislodged asphalt near tram line crossing.' },
  { id: 'PH-119', category: 'pothole', location: 'Ripon Street intersection', road_name: 'AJC Bose Road', lat: 22.5521, lng: 88.3642, severity: 'Medium', date: '29 Sep 2026', status: 'Resolved', description: 'Hot-mix asphalt patch completed.' },

  // Central Avenue (CR Avenue)
  { id: 'PH-120', category: 'pothole', location: 'Near Girish Park Metro Gate 1', road_name: 'Central Avenue', lat: 22.5842, lng: 88.3612, severity: 'Critical', date: '03 Oct 2026', status: 'In Review', description: 'Deep 18cm pothole with water in northbound bus lane.' },
  { id: 'PH-121', category: 'pothole', location: 'Chandni Chowk electronics market', road_name: 'Central Avenue', lat: 22.5672, lng: 88.3542, severity: 'High', date: '02 Oct 2026', status: 'Submitted', description: 'Crater cluster next to pedestrian zebra crossing.' },
  { id: 'PH-122', category: 'pothole', location: 'Mahatma Gandhi Road crossing', road_name: 'Central Avenue', lat: 22.5821, lng: 88.3602, severity: 'High', date: '30 Sep 2026', status: 'In Review', description: 'Rough corrugated asphalt and cave-in.' },

  // Rashbehari Avenue & South Kolkata
  { id: 'PH-123', category: 'pothole', location: 'Gariahat Pantaloons crossing', road_name: 'Rashbehari Avenue', lat: 22.5186, lng: 88.3644, severity: 'Critical', date: '02 Oct 2026', status: 'In Review', description: 'Severe waterlogged crater causing two-wheeler skids.' },
  { id: 'PH-124', category: 'pothole', location: 'Deshapriya Park north entrance', road_name: 'Rashbehari Avenue', lat: 22.5195, lng: 88.3542, severity: 'Medium', date: '28 Sep 2026', status: 'Resolved', description: 'Bituminous repair by KMC Ward 85 road gang.' },
  { id: 'PH-125', category: 'pothole', location: 'Chetla Central Road crossing', road_name: 'Rashbehari Connector', lat: 22.5162, lng: 88.3382, severity: 'High', date: '03 Oct 2026', status: 'Submitted', description: 'Road edge breakage near canal bridge.' },

  // Strand Road & Port Area
  { id: 'PH-126', category: 'pothole', location: 'Babu Ghat bus terminus entry', road_name: 'Strand Road', lat: 22.5642, lng: 88.3382, severity: 'High', date: '01 Oct 2026', status: 'Submitted', description: 'Heavy truck axle depression with loose bricks.' },
  { id: 'PH-127', category: 'pothole', location: 'Fairlie Place railway headquarters', road_name: 'Strand Road', lat: 22.5742, lng: 88.3421, severity: 'Medium', date: '30 Sep 2026', status: 'Resolved', description: 'Paver blocks re-leveled.' },
  { id: 'PH-128', category: 'pothole', location: 'Prinsep Ghat memorial curve', road_name: 'Strand Road', lat: 22.5532, lng: 88.3342, severity: 'Low', date: '29 Sep 2026', status: 'Submitted', description: 'Minor asphalt surface peeling.' },

  // Jessore Road & North Outskirts
  { id: 'PH-129', category: 'pothole', location: 'Nagerbazar 4-point crossing', road_name: 'Jessore Road', lat: 22.6282, lng: 88.4112, severity: 'Critical', date: '03 Oct 2026', status: 'In Review', description: 'Water accumulated crater right in front of auto stand.' },
  { id: 'PH-130', category: 'pothole', location: 'Dum Dum Airport Gate 1', road_name: 'Jessore Road', lat: 22.6452, lng: 88.4282, severity: 'High', date: '02 Oct 2026', status: 'Submitted', description: 'Pavement broken along carriage divider.' },
  { id: 'PH-131', category: 'pothole', location: 'Bangur Avenue entry road', road_name: 'Jessore Road', lat: 22.6082, lng: 88.4062, severity: 'Medium', date: '29 Sep 2026', status: 'Resolved', description: 'Cold mix patch laid by PWD.' },

  // More Scattered Arterial Potholes
  { id: 'PH-132', category: 'pothole', location: 'Tollygunge Karunamoyee bridge', road_name: 'Tollygunge Circular Road', lat: 22.4982, lng: 88.3421, severity: 'High', date: '01 Oct 2026', status: 'Submitted', description: 'Crater near bridge expansion joint.' },
  { id: 'PH-133', category: 'pothole', location: 'Jadavpur University Gate 3', road_name: 'Raja SC Mallick Road', lat: 22.4975, lng: 88.3702, severity: 'Medium', date: '02 Oct 2026', status: 'In Review', description: 'Depression in asphalt beside cycle track.' },
  { id: 'PH-134', category: 'pothole', location: 'Garia Station road market', road_name: 'Garia Main Road', lat: 22.4642, lng: 88.3842, severity: 'Critical', date: '03 Oct 2026', status: 'In Review', description: 'Large crater submerged under dirty water.' },
  { id: 'PH-135', category: 'pothole', location: 'Hazra crossing near hospital', road_name: 'SP Mukherjee Road', lat: 22.5252, lng: 88.3462, severity: 'High', date: '02 Oct 2026', status: 'Submitted', description: 'Pothole right in front of ambulance bay.' },
  { id: 'PH-136', category: 'pothole', location: 'Bhowanipore Netaji Bhavan', road_name: 'Ashutosh Mukherjee Road', lat: 22.5352, lng: 88.3475, severity: 'Low', date: '30 Sep 2026', status: 'Resolved', description: 'Patch sealed.' },
  { id: 'PH-137', category: 'pothole', location: 'Salt Lake 10-No Island', road_name: 'Salt Lake Bypass', lat: 22.5842, lng: 88.4092, severity: 'Medium', date: '01 Oct 2026', status: 'Submitted', description: 'Bituminous degradation at roundabout.' },
  { id: 'PH-138', category: 'pothole', location: 'Kasba New Market lane', road_name: 'RK Chatterjee Road', lat: 22.5182, lng: 88.3892, severity: 'High', date: '02 Oct 2026', status: 'In Review', description: 'Pothole with exposed brick soling.' },
  { id: 'PH-139', category: 'pothole', location: 'Alipore Zoo main gate road', road_name: 'Belvedere Road', lat: 22.5342, lng: 88.3325, severity: 'Medium', date: '28 Sep 2026', status: 'Resolved', description: 'Road patched with hot asphalt.' },
  { id: 'PH-140', category: 'pothole', location: 'Khidirpur Tram Depot', road_name: 'Circular Garden Reach Road', lat: 22.5402, lng: 88.3225, severity: 'Critical', date: '03 Oct 2026', status: 'In Review', description: 'Massive crater on truck route near dock gate.' },
];

// 18+ Sample Garbage / Sanitation Records
export const SAMPLE_GARBAGE: MapCivicIssue[] = [
  { id: 'GB-201', category: 'garbage', location: 'Gariahat Market North Lane', road_name: 'Rashbehari Avenue', lat: 22.5188, lng: 88.3652, severity: 'High', date: '03 Oct 2026', status: 'In Review', description: 'Over 2 tons of uncollected organic vegetable refuse encroaching walkway.' },
  { id: 'GB-202', category: 'garbage', location: 'Shyambazar 5-Point vat corner', road_name: 'Bidhan Sarani', lat: 22.6028, lng: 88.3715, severity: 'High', date: '02 Oct 2026', status: 'Submitted', description: 'Overflowing open municipal garbage vat spilling into active carriageway.' },
  { id: 'GB-203', category: 'garbage', location: 'Sealdah Baithakkhana Market', road_name: 'BB Ganguly Street', lat: 22.5692, lng: 88.3712, severity: 'Critical', date: '03 Oct 2026', status: 'In Review', description: 'Decomposing fish market waste creating severe stench and vector hazard.' },
  { id: 'GB-204', category: 'garbage', location: 'Maniktala Fish Market', road_name: 'Vivekananda Road', lat: 22.5862, lng: 88.3752, severity: 'High', date: '01 Oct 2026', status: 'Resolved', description: 'Compactor cleared 4 tons of waste and sanitized with bleaching.' },
  { id: 'GB-205', category: 'garbage', location: 'College Street book stall corner', road_name: 'College Street', lat: 22.5765, lng: 88.3642, severity: 'Medium', date: '30 Sep 2026', status: 'Resolved', description: 'Uncollected tea stalls plastic cups and paper.' },
  { id: 'GB-206', category: 'garbage', location: 'Jadubabu Bazaar lane', road_name: 'Ashutosh Mukherjee Road', lat: 22.5365, lng: 88.3468, severity: 'High', date: '02 Oct 2026', status: 'In Review', description: 'Dumped vegetable crates and rotting waste near tram line.' },
  { id: 'GB-207', category: 'garbage', location: 'Behala Tram Depot market', road_name: 'Diamond Harbour Road', lat: 22.5022, lng: 88.3175, severity: 'Critical', date: '03 Oct 2026', status: 'Submitted', description: 'Open community bin overflowing onto bus boarding lane.' },
  { id: 'GB-208', category: 'garbage', location: 'Ultadanga VIP market', road_name: 'CIT Road', lat: 22.5892, lng: 88.3842, severity: 'High', date: '01 Oct 2026', status: 'Submitted', description: 'Construction rubble and domestic refuse dumped on sidewalk.' },
  { id: 'GB-209', category: 'garbage', location: 'Park Circus market lane', road_name: 'Suhrawardy Avenue', lat: 22.5422, lng: 88.3698, severity: 'Critical', date: '02 Oct 2026', status: 'In Review', description: 'Rotting animal bones and food waste attracting packs of dogs.' },
  { id: 'GB-210', category: 'garbage', location: 'Ballygunge Station market', road_name: 'Ekdalia Road', lat: 22.5195, lng: 88.3725, severity: 'Medium', date: '29 Sep 2026', status: 'Resolved', description: 'Vat cleared by evening conservancy truck.' },
  { id: 'GB-211', category: 'garbage', location: 'Tollygunge Charu Market', road_name: 'Tollygunge Circular Road', lat: 22.5062, lng: 88.3452, severity: 'High', date: '02 Oct 2026', status: 'Submitted', description: 'Overflowing rubbish container on pavement.' },
  { id: 'GB-212', category: 'garbage', location: 'Kasba Rajdanga Main Road', road_name: 'Rajdanga Main Road', lat: 22.5142, lng: 88.3895, severity: 'Medium', date: '01 Oct 2026', status: 'In Review', description: 'Plastic debris and dry leaves blocking drainage grating.' },
  { id: 'GB-213', category: 'garbage', location: 'New Alipore railway bridge', road_name: 'Taratala Road', lat: 22.5112, lng: 88.3242, severity: 'Medium', date: '30 Sep 2026', status: 'Resolved', description: 'Dump cleared and warning signboard installed.' },
  { id: 'GB-214', category: 'garbage', location: 'Baguiati Jora Mandir', road_name: 'VIP Road Service Lane', lat: 22.6162, lng: 88.4312, severity: 'High', date: '03 Oct 2026', status: 'Submitted', description: 'Uncollected community vat blocking residential lane entry.' },
  { id: 'GB-215', category: 'garbage', location: 'Khidirpur Fancy Market lane', road_name: 'Karl Marx Sarani', lat: 22.5392, lng: 88.3242, severity: 'High', date: '02 Oct 2026', status: 'In Review', description: 'Discarded carton packaging and food refuse.' },
  { id: 'GB-216', category: 'garbage', location: 'Dum Dum Station auto stand', road_name: 'Dum Dum Road', lat: 22.6212, lng: 88.3942, severity: 'Critical', date: '03 Oct 2026', status: 'Submitted', description: 'Foul garbage heap overflowing near passenger queue.' },
];

// 18+ Sample Streetlight Records
export const SAMPLE_STREETLIGHTS: MapCivicIssue[] = [
  { id: 'SL-301', category: 'streetlight', location: 'Central Avenue & Colootola crossing', road_name: 'Central Avenue', lat: 22.5782, lng: 88.3612, severity: 'High', date: '02 Oct 2026', status: 'In Review', description: 'Three consecutive high-mast LED fixtures dark for past 4 nights.' },
  { id: 'SL-302', category: 'streetlight', location: 'EM Bypass near Tagore Park', road_name: 'EM Bypass', lat: 22.5252, lng: 88.3972, severity: 'Critical', date: '03 Oct 2026', status: 'Submitted', description: 'Dangling overhead wire on electric pole with sparking during rain.' },
  { id: 'SL-303', category: 'streetlight', location: 'Rashbehari Avenue near Triangular Park', road_name: 'Rashbehari Avenue', lat: 22.5182, lng: 88.3582, severity: 'Medium', date: '30 Sep 2026', status: 'Resolved', description: 'LED luminaire replaced by KMC Lighting department.' },
  { id: 'SL-304', category: 'streetlight', location: 'Behala Chowrasta underpass road', road_name: 'Diamond Harbour Road', lat: 22.4932, lng: 88.3142, severity: 'High', date: '01 Oct 2026', status: 'In Review', description: 'Complete 80-meter dark corridor creating pedestrian hazard.' },
  { id: 'SL-305', category: 'streetlight', location: 'Shyambazar Bhupen Bose Avenue', road_name: 'Bhupen Bose Avenue', lat: 22.6012, lng: 88.3692, severity: 'Medium', date: '02 Oct 2026', status: 'Submitted', description: 'Flickering street lamp causing strobe annoyance.' },
  { id: 'SL-306', category: 'streetlight', location: 'Ultadanga Telengabagan lane', road_name: 'CIT Road', lat: 22.5882, lng: 88.3812, severity: 'Low', date: '29 Sep 2026', status: 'Resolved', description: 'Timer switch reset.' },
  { id: 'SL-307', category: 'streetlight', location: 'Park Circus 7-Point roundabout', road_name: 'AJC Bose Road', lat: 22.5442, lng: 88.3662, severity: 'High', date: '03 Oct 2026', status: 'In Review', description: 'Central high-mast tower 4 lamps burnt out.' },
  { id: 'SL-308', category: 'streetlight', location: 'VIP Road near Bangur', road_name: 'VIP Road', lat: 22.6092, lng: 88.4232, severity: 'High', date: '01 Oct 2026', status: 'Submitted', description: 'Service lane pole luminaire missing after storm.' },
  { id: 'SL-309', category: 'streetlight', location: 'Lake Gardens Lords Bakery crossing', road_name: 'Anwar Shah Road', lat: 22.5052, lng: 88.3582, severity: 'Medium', date: '02 Oct 2026', status: 'Submitted', description: 'Pole fuse tripped in rain.' },
  { id: 'SL-310', category: 'streetlight', location: 'Kasba Bakultala intersection', road_name: 'Kasba Road', lat: 22.5192, lng: 88.3812, severity: 'Critical', date: '03 Oct 2026', status: 'In Review', description: 'Exposed live junction box at child height on pavement pole.' },
  { id: 'SL-311', category: 'streetlight', location: 'Jadavpur Sulekha crossing', road_name: 'Raja SC Mallick Road', lat: 22.4922, lng: 88.3732, severity: 'Medium', date: '28 Sep 2026', status: 'Resolved', description: 'Driver circuit replaced.' },
  { id: 'SL-312', category: 'streetlight', location: 'Strand Road near Millenium Park', road_name: 'Strand Road', lat: 22.5712, lng: 88.3412, severity: 'Low', date: '30 Sep 2026', status: 'Resolved', description: 'Lamp replaced.' },
  { id: 'SL-313', category: 'streetlight', location: 'Taratala crossing industrial lane', road_name: 'Hide Road', lat: 22.5162, lng: 88.3122, severity: 'High', date: '02 Oct 2026', status: 'Submitted', description: 'Dark road stretch frequented by heavy container trucks.' },
  { id: 'SL-314', category: 'streetlight', location: 'College Street Presidency Gate', road_name: 'College Street', lat: 22.5748, lng: 88.3628, severity: 'Medium', date: '01 Oct 2026', status: 'In Review', description: 'Dim vintage lantern fixture needing upgrade.' },
  { id: 'SL-315', category: 'streetlight', location: 'Gariahat Pantaloons crossing', road_name: 'Gariahat Road', lat: 22.5192, lng: 88.3638, severity: 'Medium', date: '29 Sep 2026', status: 'Resolved', description: 'New 120W LED installed.' },
  { id: 'SL-316', category: 'streetlight', location: 'Dum Dum Cantonment rail bridge', road_name: 'Cantonment Road', lat: 22.6412, lng: 88.4082, severity: 'Critical', date: '03 Oct 2026', status: 'Submitted', description: 'Completely dark bridge approach with broken fixture.' },
];

// 18+ Sample Drain & Waterlogging Records
export const SAMPLE_DRAINS: MapCivicIssue[] = [
  { id: 'DR-401', category: 'drain', location: 'Thanthania Kalibari street corner', road_name: 'Bidhan Sarani', lat: 22.5804, lng: 88.3639, severity: 'Critical', date: '03 Oct 2026', status: 'In Review', description: 'Subterranean brick sewer choked with heavy silt; gully pit overflowing.' },
  { id: 'DR-402', category: 'drain', location: 'Amherst Street near police station', road_name: 'Amherst Street', lat: 22.5762, lng: 88.3685, severity: 'Critical', date: '02 Oct 2026', status: 'In Review', description: 'Missing manhole concrete cover on road; open gaping sewer hole.' },
  { id: 'DR-403', category: 'drain', location: 'Camac Street & Park Street crossing', road_name: 'Camac Street', lat: 22.5511, lng: 88.3541, severity: 'High', date: '01 Oct 2026', status: 'Submitted', description: 'Surface drain grating blocked with plastic wrapping; slow runoff.' },
  { id: 'DR-404', category: 'drain', location: 'Behala Chowrasta Tram line canal', road_name: 'Diamond Harbour Road', lat: 22.4922, lng: 88.3129, severity: 'Critical', date: '03 Oct 2026', status: 'Submitted', description: 'Construction debris blocking storm outflow into Keorapukur canal.' },
  { id: 'DR-405', category: 'drain', location: 'Ultadanga railway subway', road_name: 'Ultadanga Main Road', lat: 22.5925, lng: 88.3887, severity: 'Critical', date: '02 Oct 2026', status: 'In Review', description: 'High waterlogging in underpass reaching 70cm; pump station trip.' },
  { id: 'DR-406', category: 'drain', location: 'Central Avenue & Girish Park', road_name: 'Central Avenue', lat: 22.5857, lng: 88.3615, severity: 'High', date: '03 Oct 2026', status: 'In Review', description: 'Gully pit silted to kerb top; sewage backflow into sidewalk.' },
  { id: 'DR-407', category: 'drain', location: 'Kasba Bosepukur canal bridge', road_name: 'Bosepukur Road', lat: 22.5192, lng: 88.3855, severity: 'High', date: '30 Sep 2026', status: 'Resolved', description: 'Suction machine removed 12 tons silt.' },
  { id: 'DR-408', category: 'drain', location: 'Patuli Ghoshpara canal gate', road_name: 'Patuli Main Road', lat: 22.4746, lng: 88.3812, severity: 'Medium', date: '01 Oct 2026', status: 'Submitted', description: 'Water hyacinth choking canal sluice gate.' },
  { id: 'DR-409', category: 'drain', location: 'Tiljala Road canal bridge', road_name: 'Tiljala Road', lat: 22.5342, lng: 88.3892, severity: 'Critical', date: '02 Oct 2026', status: 'In Review', description: 'Open storm sewer bank collapsed causing roadway erosion.' },
  { id: 'DR-410', category: 'drain', location: 'Sealdah flyover drain discharge', road_name: 'AJC Bose Road', lat: 22.5684, lng: 88.3725, severity: 'Medium', date: '29 Sep 2026', status: 'Resolved', description: 'Drain unclogged by manual scavengers with safety suits.' },
  { id: 'DR-411', category: 'drain', location: 'Taratala Majerhat bridge base', road_name: 'Taratala Road', lat: 22.5152, lng: 88.3175, severity: 'High', date: '03 Oct 2026', status: 'Submitted', description: 'Gully pit cover smashed by heavy truck tires.' },
  { id: 'DR-412', category: 'drain', location: 'Lake Gardens railway underpass', road_name: 'Lake Gardens Road', lat: 22.5064, lng: 88.3562, severity: 'Critical', date: '02 Oct 2026', status: 'In Review', description: 'Underpass flooded with 60cm water; auto-rickshaws stalled.' },
  { id: 'DR-413', category: 'drain', location: 'VIP Road Teghoria intersection', road_name: 'VIP Road', lat: 22.6247, lng: 88.4358, severity: 'High', date: '01 Oct 2026', status: 'Submitted', description: 'Storm canal overflowing into service road.' },
  { id: 'DR-414', category: 'drain', location: 'Bowbazar BB Ganguly Street', road_name: 'BB Ganguly Street', lat: 22.5695, lng: 88.3621, severity: 'Medium', date: '30 Sep 2026', status: 'Resolved', description: 'Desilted by KMC Borough V team.' },
  { id: 'DR-415', category: 'drain', location: 'Kalighat Sadananda Road', road_name: 'Sadananda Road', lat: 22.5218, lng: 88.3496, severity: 'High', date: '02 Oct 2026', status: 'In Review', description: 'Knee-deep water logging after 40 mins rainfall.' },
  { id: 'DR-416', category: 'drain', location: 'Baguiati VIP Road service lane', road_name: 'VIP Road', lat: 22.6135, lng: 88.4282, severity: 'High', date: '03 Oct 2026', status: 'Submitted', description: 'Clogged roadside channel with mosquito breeding.' },
];

// Initial Reports for "My Reports" tab (Realistic Cases)
export const INITIAL_DEMO_REPORTS: CivicReport[] = [
  {
    id: 'CL-2026-382914',
    createdAt: '2026-10-02T11:20:00.000Z',
    formattedTimestamp: '02 Oct 2026, 11:20 AM IST',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    is_civic_issue: true,
    issue_type: 'Deep Carriageway Pothole with Standing Water',
    category: 'pothole',
    severity: 'Critical',
    severity_reason: 'Deep 15cm crater in fast lane opposite Ruby General Hospital causing severe skids for two-wheelers.',
    description: 'A critical asphalt depression has developed on the northbound lane of E.M. Bypass near the Ruby crossing. Heavy monsoon showers have filled the crater with stagnant water, rendering it invisible to moving vehicles. Urgent mastic asphalt resurfacing is solicited to avert fatal collisions.',
    suggested_department: 'Kolkata Municipal Corporation – Roads & Engineering Department',
    risk_to_public: 'Fatal two-wheeler skids, axle breakage, traffic pile-up',
    confidence: 0.96,
    location: {
      latitude: 22.5133,
      longitude: 88.3986,
      address: 'E.M. Bypass, near Ruby General Hospital crossing, Anandapur',
      ward: 'Ward 107',
      city: 'Kolkata',
      accuracy: 8,
    },
    status: 'In Review',
    statusTimeline: [
      { stage: 'Complaint Registered & Timestamped', date: '02 Oct 2026, 11:20 AM IST', notes: 'Citizen grievance authenticated with photo and GPS location evidence.', completed: true },
      { stage: 'AI Hazard Severity Verified', date: '02 Oct 2026, 11:21 AM IST', notes: 'Multimodal vision model verified road defect depth > 12cm. Severity: CRITICAL.', completed: true },
      { stage: 'Forwarded to Borough XII Engineering Wing', date: '02 Oct 2026, 01:15 PM IST', notes: 'Docket dispatched under West Bengal Right to Public Services Act (48-Hr SLA).', completed: true },
    ],
  },
  {
    id: 'CL-2026-291048',
    createdAt: '2026-09-30T08:45:00.000Z',
    formattedTimestamp: '30 Sep 2026, 08:45 AM IST',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    is_civic_issue: true,
    issue_type: 'Overflowing Solid Waste Vat & Commercial Debris',
    category: 'garbage',
    severity: 'High',
    severity_reason: 'Over 2 tons of uncollected organic garbage encroaching onto pedestrian footpath and market entrance.',
    description: 'The community refuse vat located at Gariahat Market lane has remained uncollected for 48 hours. Rotting organic waste is spilling into pedestrian pathways causing unbearable stench, stray dog menace, and blocking access to elderly shoppers. Immediate compactor deployment is required.',
    suggested_department: 'Kolkata Municipal Corporation – Solid Waste Management (SWM)',
    risk_to_public: 'Vector-borne disease outbreak, stray animal aggression, blocked sidewalk',
    confidence: 0.93,
    location: {
      latitude: 22.5186,
      longitude: 88.3644,
      address: 'Rashbehari Avenue, Gariahat Market North Gate',
      ward: 'Ward 86',
      city: 'Kolkata',
      accuracy: 6,
    },
    status: 'Resolved',
    statusTimeline: [
      { stage: 'Complaint Registered & Timestamped', date: '30 Sep 2026, 08:45 AM IST', notes: 'Photo evidence logged with GPS coordinates.', completed: true },
      { stage: 'Dispatched to SWM Conservancy Unit', date: '30 Sep 2026, 10:00 AM IST', notes: 'Compactor vehicle allocated to Ward 86 market lane.', completed: true },
      { stage: 'Site Rectified & Sanitized', date: '01 Oct 2026, 04:30 PM IST', notes: 'Waste vat cleared completely; bleaching powder applied.', completed: true },
    ],
  },
  {
    id: 'CL-2026-118274',
    createdAt: '2026-10-03T14:15:00.000Z',
    formattedTimestamp: '03 Oct 2026, 02:15 PM IST',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    is_civic_issue: true,
    issue_type: 'Clogged Storm Drain & Waterlogged Intersection',
    category: 'waterlogging',
    severity: 'Critical',
    severity_reason: 'Complete blockage of subterranean storm conduits leading to knee-deep water accumulation after 30 mins rain.',
    description: 'Severe waterlogging has inundated the key junction of Central Avenue and Bidhan Sarani due to choked gully pits and heavy silt deposition. Commuters are stranded and public buses are experiencing engine stalls in standing sewage-water mix. Immediate super-sucker machine deployment requested.',
    suggested_department: 'Kolkata Municipal Corporation – Drainage & Sewerage Department',
    risk_to_public: 'Electrocution hazard from submerged pole bases, vector breeding, stranded vehicles',
    confidence: 0.95,
    location: {
      latitude: 22.5857,
      longitude: 88.3615,
      address: 'Central Avenue & Bidhan Sarani Crossing, near Girish Park',
      ward: 'Ward 44',
      city: 'Kolkata',
      accuracy: 10,
    },
    status: 'Submitted',
    statusTimeline: [
      { stage: 'Complaint Registered & Timestamped', date: '03 Oct 2026, 02:15 PM IST', notes: 'Citizen photographic evidence authenticated.', completed: true },
      { stage: 'High-Capacity Drainage Pump Alert Dispatched', date: '03 Oct 2026, 02:20 PM IST', notes: 'Forwarded to Central Municipal Control Room for pump allocation.', completed: true },
    ],
  },
  {
    id: 'CL-2026-554210',
    createdAt: '2026-10-01T20:30:00.000Z',
    formattedTimestamp: '01 Oct 2026, 08:30 PM IST',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    is_civic_issue: true,
    issue_type: 'Non-Functional Streetlight & Dangling Overhead Wires',
    category: 'streetlight',
    severity: 'High',
    severity_reason: 'Complete illumination failure across a 60-meter stretch coupled with exposed utility wiring during wet conditions.',
    description: 'The municipal street luminaire mounted on the concrete utility pole has been inoperative for consecutive nights, leaving this vital junction in total darkness. The absence of adequate road lighting significantly heightens the risk of nighttime collisions and anti-social activities. Urgent replacement of the LED luminaire and bundling of loose cables is solicited.',
    suggested_department: 'Kolkata Municipal Corporation – Lighting & Electrical Department',
    risk_to_public: 'Nighttime vehicular collisions, pedestrian injury, security vulnerability in dark stretch',
    confidence: 0.94,
    location: {
      latitude: 22.5412,
      longitude: 88.3482,
      address: 'AJC Bose Road near Exide Crossing, Bhowanipore',
      ward: 'Ward 70',
      city: 'Kolkata',
      accuracy: 5,
    },
    status: 'In Review',
    statusTimeline: [
      { stage: 'Complaint Registered & Timestamped', date: '01 Oct 2026, 08:30 PM IST', notes: 'Dark spot logged via photo scan.', completed: true },
      { stage: 'Work Order Allocated to Electrical Gang', date: '02 Oct 2026, 10:00 AM IST', notes: 'Replacement driver circuit and LED fixture requisitioned.', completed: true },
    ],
  },
  {
    id: 'CL-2026-671982',
    createdAt: '2026-09-28T16:10:00.000Z',
    formattedTimestamp: '28 Sep 2026, 04:10 PM IST',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    is_civic_issue: true,
    issue_type: 'Damaged Concrete Footpath & Dislodged Pavers',
    category: 'footpath',
    severity: 'Medium',
    severity_reason: 'Dislodged concrete slabs and gaping holes forcing senior citizens and pedestrians into oncoming carriageway traffic.',
    description: 'The pedestrian walkway features shattered paving tiles and missing concrete manhole covers, creating severe tripping hazards. Pedestrians, including elderly citizens, are compelled to walk along the busy motorable road, leading to near-miss situations. Timely reinstatement of the footpath surface and kerb stones is urgently requested.',
    suggested_department: 'Kolkata Municipal Corporation – Civil Engineering (Boroughs)',
    risk_to_public: 'Pedestrian trip and fall injuries, pedestrian hit by moving vehicles',
    confidence: 0.91,
    location: {
      latitude: 22.5765,
      longitude: 88.3642,
      address: 'College Street, opposite Presidency University Gate',
      ward: 'Ward 40',
      city: 'Kolkata',
      accuracy: 4,
    },
    status: 'Resolved',
    statusTimeline: [
      { stage: 'Complaint Registered', date: '28 Sep 2026, 04:10 PM IST', notes: 'Photo evidence received.', completed: true },
      { stage: 'Masonry Work Order Issued', date: '29 Sep 2026, 11:00 AM IST', notes: 'Borough IV civil team assigned.', completed: true },
      { stage: 'Footpath Paver Re-laid & Kerb Replaced', date: '01 Oct 2026, 02:00 PM IST', notes: 'Surface levelled and walkway reopened.', completed: true },
    ],
  },
  {
    id: 'CL-2026-782103',
    createdAt: '2026-10-01T15:20:00.000Z',
    formattedTimestamp: '01 Oct 2026, 03:20 PM IST',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    is_civic_issue: true,
    issue_type: 'Dangerous Crater on Diamond Harbour Road',
    category: 'pothole',
    severity: 'High',
    severity_reason: 'Deep road depression near Metro pillar construction diversion.',
    description: 'A 12cm deep pothole has emerged on Diamond Harbour Road near Behala 14 No. Bus Stand. The road surface has broken down due to ongoing construction and monsoon rain. Buses and auto-rickshaws swerve dangerously to avoid it.',
    suggested_department: 'Kolkata Municipal Corporation – Roads & Engineering Department',
    risk_to_public: 'Two-wheeler falls, vehicular traffic jam',
    confidence: 0.95,
    location: {
      latitude: 22.4982,
      longitude: 88.3142,
      address: 'Diamond Harbour Road, Behala 14 No. Bus Stand',
      ward: 'Ward 121',
      city: 'Kolkata',
      accuracy: 7,
    },
    status: 'In Review',
    statusTimeline: [
      { stage: 'Complaint Registered & Timestamped', date: '01 Oct 2026, 03:20 PM IST', notes: 'Logged with camera snapshot.', completed: true },
      { stage: 'Assigned to Ward 121 Assistant Engineer', date: '02 Oct 2026, 09:30 AM IST', notes: 'Joint inspection scheduled with Metro rail contractor.', completed: true },
    ],
  },
];

// Pre-configured Sample Photos for 1-Click Report Flow Testing
export const SAMPLE_REPORT_PHOTOS = [
  {
    id: 'sample-pothole',
    title: 'Pothole on Rashbehari Ave',
    tag: 'Road Crater',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    hint: 'pothole',
    address: 'Rashbehari Avenue near Gariahat Crossing, Ward 86, Kolkata',
    coords: { lat: 22.5186, lng: 88.3644 },
  },
  {
    id: 'sample-garbage',
    title: 'Waste Vat at Shyambazar',
    tag: 'Solid Waste',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    hint: 'garbage',
    address: 'Shyambazar 5-Point Crossing, Ward 10, Kolkata',
    coords: { lat: 22.6025, lng: 88.3712 },
  },
  {
    id: 'sample-waterlogging',
    title: 'Flooding at Central Ave',
    tag: 'Waterlogging',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    hint: 'drain waterlogging',
    address: 'Central Avenue & Bidhan Sarani Crossing, near Girish Park, Kolkata',
    coords: { lat: 22.5857, lng: 88.3615 },
  },
];
