import {
  LayoutDashboard,
  BrainCircuit,
  ScanLine,
  ShieldCheck,
  Wrench,
  MessageCircle,
  Settings as SettingsIcon,
} from 'lucide-react';

/**
 * @title Route registry
 * @notice Single source of truth for every page route: URL path, sidebar label,
 * @notice page title and sidebar icon all live here.
 * @dev Adding or renaming a page means editing only this file — the sidebar,
 * @dev the page shells (`Layout title`), the metadata exports and the Server
 * @dev Action `revalidatePath`/`redirect` calls all read from `ROUTES`.
 * @dev This module is intentionally NOT `server-only`: the Sidebar (a Client
 * @dev Component) reads `NAV_ITEMS`, while pages and actions read `ROUTES`.
 */

/**
 * @typedef {object} RouteDefinition
 * @property {string} path URL path (matches the App Router folder under `app/(pages)`).
 * @property {string} label Short label for navigation.
 * @property {string} title Full page title used by `Layout` and `metadata`.
 * @property {import('lucide-react').LucideIcon} [icon] Sidebar icon (nav routes only).
 * @property {boolean} [end] True when the active-route check must be an exact match.
 */

/** @type {Record<string, RouteDefinition>} */
export const ROUTES = {
  dashboard: {
    path: '/',
    label: 'Dashboard',
    title: 'Dashboard Overview',
    icon: LayoutDashboard,
    end: true,
  },
  aiModel: {
    path: '/ai-model',
    label: 'AI Model',
    title: 'AI Models',
    icon: BrainCircuit,
  },
  fraudReports: {
    path: '/fraud-reports',
    label: 'Fraud Reports',
    title: 'Fraud & Moderation Workspace',
    icon: ScanLine,
  },
  userVerification: {
    path: '/user-verification',
    label: 'User Verification',
    title: 'User Verification',
    icon: ShieldCheck,
  },
  toolsBenchmark: {
    path: '/tools-benchmark',
    label: 'Tools Benchmarks',
    title: 'Tools Benchmark',
    icon: Wrench,
  },
  contactSupport: {
    path: '/contact-support',
    label: 'Contact Support',
    title: 'Contact support',
    icon: MessageCircle,
  },
  settings: {
    path: '/settings',
    label: 'Settings',
    title: 'Pengaturan Administrator',
    icon: SettingsIcon,
  },
  login: {
    path: '/login',
    label: 'Masuk Admin',
    title: 'Masuk Admin',
  },
};

/** @notice Routes rendered in the main sidebar section, in order. */
export const NAV_ITEMS = [
  ROUTES.dashboard,
  ROUTES.aiModel,
  ROUTES.fraudReports,
  ROUTES.userVerification,
  ROUTES.toolsBenchmark,
  ROUTES.contactSupport,
];