
export const PLANS_CONFIG = {
  FREE: {
    name: "Free Plan",
    type: "free",
    price: 0,
    displayPrice: "Free",
    certificateLimits: {
      basic: 1,
      san: 0,
      wildcard: 0,
    },
    maxDuration: 90,
    minDuration: 90,
    validationMethods: ["email", "http", "dns"],
    supportsSAN: false,
    supportsWildcard: false,
    supportsRenewal: false,
    features: [
      "1 Basic SSL Certificate",
      "1 Domain",
      "Email, HTTP, DNS validation",
      "No renewal support",
      "1 year validity",
    ],
  },
  STANDARD: {
    name: "Standard Plan",
    type: "standard",
    price: 1000,
    displayPrice: "$10/month",
    certificateLimits: {
      basic: 3,
      san: 1,
      wildcard: 0,
    },
    maxDuration: 365,
    minDuration: 365,
    validationMethods: ["email", "http", "dns"],
    supportsSAN: true,
    supportsWildcard: false,
    supportsRenewal: true,
    features: [
      "3 Basic Certificates",
      "1 SAN Certificate",
      "Up to 3 domains",
      "Email, HTTP, DNS validation",
      "Renewal support",
    ],
  },
  PREMIUM: {
    name: "Premium Plan",
    type: "premium",
    price: 10000,
    displayPrice: "$100/month",
    certificateLimits: {
      basic: 5,
      san: 1,
      wildcard: 1,
    },
    maxDuration: 765,
    minDuration: 365,
    validationMethods: ["email", "dns"],
    supportsSAN: true,
    supportsWildcard: true,
    supportsRenewal: true,
    features: [
      "5 Basic Certificates",
      "1 SAN Certificate",
      "1 Wildcard Certificate",
      "Unlimited domains",
      "Email & DNS validation",
      "Renewal support",
      "Up to 765 days validity",
    ],
  },
}

export const PLAN_UPGRADE_PATH = {
  free: "standard",
  standard: "premium",
  premium: null,
}

export function getNextPlan(currentPlan: string) {
  return PLAN_UPGRADE_PATH[currentPlan.toLowerCase() as keyof typeof PLAN_UPGRADE_PATH]
}

export function canUpgrade(currentPlan: string) {
  return getNextPlan(currentPlan) !== null
}
