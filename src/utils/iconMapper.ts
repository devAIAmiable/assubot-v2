// Import only the icons that are actually used
import { MdApartment, MdBusiness, MdElectricCar, MdHome, MdLocalGasStation } from 'react-icons/md';

import React from 'react';

// Icon mapping object - only include icons that are actually used
const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  // Home insurance coverage levels
  MdHome, // basic coverage
  MdBusiness, // Alternative for MdHomeWork (extended coverage)
  MdApartment, // Alternative for MdCastle (premium coverage)

  // Map backend icon names to available alternatives
  MdHomeWork: MdBusiness, // Maps 'MdHomeWork' to MdBusiness
  MdCastle: MdApartment, // Maps 'MdCastle' to MdApartment

  // Vehicle fuel types
  MdElectricCar,
  MdLocalGasStation,

  // Add more icons here as the backend provides them
};

/**
 * Get a React icon component by name
 * @param iconName - The name of the icon (e.g., 'MdHome')
 * @returns The React icon component or null if not found
 */
export const getIcon = (iconName: string): React.ComponentType<React.SVGProps<SVGSVGElement>> | null => {
  return iconMap[iconName] || null;
};

/**
 * Render an icon by name
 * @param iconName - The name of the icon
 * @param props - Props to pass to the icon component
 * @returns JSX element or null
 */
export const renderIcon = (iconName: string, props: React.SVGProps<SVGSVGElement> = {}): React.ReactElement | null => {
  const IconComponent = getIcon(iconName);
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in icon map. Please add it to the iconMap in iconMapper.ts`);
    return null;
  }
  return React.createElement(IconComponent, props);
};

/**
 * Render an icon by name with fallback
 * @param iconName - The name of the icon
 * @param props - Props to pass to the icon component
 * @param fallback - Fallback JSX element if icon not found
 * @returns JSX element
 */
export const renderIconWithFallback = (iconName: string, props: React.SVGProps<SVGSVGElement> = {}, fallback?: React.ReactElement): React.ReactElement | null => {
  const IconComponent = getIcon(iconName);
  if (!IconComponent) {
    return fallback || null;
  }
  return React.createElement(IconComponent, props);
};

/**
 * Check if an icon exists in the icon map
 * @param iconName - The name of the icon
 * @returns boolean
 */
export const hasIcon = (iconName: string): boolean => {
  return iconName in iconMap;
};

/**
 * Add a new icon to the mapping (useful for dynamic icon loading)
 * @param iconName - The name of the icon
 * @param iconComponent - The React icon component
 */
export const addIcon = (iconName: string, iconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>): void => {
  iconMap[iconName] = iconComponent;
};

/**
 * Get all currently available icon names
 * @returns Array of icon names
 */
export const getAvailableIcons = (): string[] => {
  return Object.keys(iconMap);
};

/**
 * Helper function to add icons for specific use cases
 * Usage: When backend sends new icon names, add them here
 */
export const addIconsForBackend = (icons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>): void => {
  Object.entries(icons).forEach(([name, component]) => {
    iconMap[name] = component;
  });
};
