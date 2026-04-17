/// <reference types="astro/client" />

import type { PlatformSession } from './lib/platform/types';

declare global {
  namespace App {
    interface Locals {
      platformSession: PlatformSession | null;
    }
  }
}

export {};
