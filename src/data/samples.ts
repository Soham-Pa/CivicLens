import { CivicCategory } from '../types';

export interface CategoryInfo {
  id: CivicCategory;
  name: string;
  department: string;
  sla: string;
  iconName: string;
  description: string;
  imageUrl: string;
}

export const CIVIC_CATEGORIES: CategoryInfo[] = [
  {
    id: 'pothole',
    name: 'Road Potholes & Craters',
    department: 'KMC Roads & Engineering Wing',
    sla: '24–48 Hours',
    iconName: 'AlertTriangle',
    description: 'Crater-like depressions, bituminous peeling, broken carriage lanes causing vehicle skids.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'garbage',
    name: 'Overflowing Waste & Sanitation',
    department: 'KMC Solid Waste Management (SWM)',
    sla: '12–24 Hours',
    iconName: 'Trash2',
    description: 'Rotting open vats, construction debris dumped along kerbs, choked public dustbins.',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'streetlight',
    name: 'Broken & Dark Streetlights',
    department: 'KMC Lighting & Electrical Dept.',
    sla: '24 Hours',
    iconName: 'Lightbulb',
    description: 'Burnt-out LED luminaires, dark stretches, dangling wires on utility poles.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'drain',
    name: 'Blocked Drains & Open Gully Pits',
    department: 'KMC Drainage & Sewerage Wing',
    sla: '12–36 Hours',
    iconName: 'Waves',
    description: 'Silt-choked storm sewers, missing manhole covers, foul sewage backflows.',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'waterlogging',
    name: 'Monsoon Waterlogging & Inundation',
    department: 'KMC Sewerage & River Outfall',
    sla: 'Immediate Action (High-Capacity Pumps)',
    iconName: 'Droplets',
    description: 'Deep standing rainwater trapping two-wheelers, blocking intersections and bus stops.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'footpath',
    name: 'Damaged Footpaths & Pavers',
    department: 'KMC Civil Engineering (Boroughs)',
    sla: '3–5 Days',
    iconName: 'Footprints',
    description: 'Dislodged concrete slabs, missing kerb stones, dangerous tripping points for seniors.',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  },
];
