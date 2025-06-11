/**
 * 🚀 Route Preloading Utility
 * 
 * This utility preloads route components based on user behavior
 * to improve perceived performance.
 */

import { lazy } from 'react';

// Create a preloading cache
const preloadCache = new Map<string, Promise<any>>();

/**
 * Preload a route component
 */
export const preloadRoute = (routeImport: () => Promise<any>, routeName: string) => {
  if (!preloadCache.has(routeName)) {
    preloadCache.set(routeName, routeImport());
  }
  return preloadCache.get(routeName);
};

/**
 * Preload commonly used routes on app initialization
 */
export const preloadCriticalRoutes = () => {
  // Preload dashboard immediately since it's the landing page
  preloadRoute(() => import('../pages/Dashboard'), 'dashboard');
  
  // Preload other frequently accessed pages after a short delay
  setTimeout(() => {
    preloadRoute(() => import('../pages/Products/ProductList'), 'products');
    preloadRoute(() => import('../pages/Employees/EmployeeList'), 'employees');
    preloadRoute(() => import('../pages/Orders/OrderList'), 'orders');
  }, 2000);
};

/**
 * Preload routes on hover/focus for better UX
 */
export const setupRoutePreloading = () => {
  // Preload routes when user hovers over navigation links
  const preloadMap = {
    '/products': () => import('../pages/Products/ProductList'),
    '/employees': () => import('../pages/Employees/EmployeeList'),
    '/sales': () => import('../pages/Sales/SalesReportList'),
    '/orders': () => import('../pages/Orders/OrderList'),
    '/admin': () => import('../pages/Admin/AdminPanel'),
  };

  // Add event listeners to navigation links
  Object.entries(preloadMap).forEach(([path, importFn]) => {
    const links = document.querySelectorAll(`a[href="${path}"]`);
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        preloadRoute(importFn, path);
      });
      link.addEventListener('focus', () => {
        preloadRoute(importFn, path);
      });
    });
  });
};

/**
 * Enhanced lazy loading with preloading
 */
export const lazyWithPreload = (importFn: () => Promise<any>, routeName: string) => {
  const LazyComponent = lazy(importFn);
  
  // Add preload method to the component
  (LazyComponent as any).preload = () => preloadRoute(importFn, routeName);
  
  return LazyComponent;
};
