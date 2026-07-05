import {
  ArrowLeftRight,
  BookOpen,
  Gift,
  Landmark,
  Layers,
  Receipt,
  Sparkles,
  User,
  UserPlus,
  UsersRound,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Top-level category order on https://help.wealthsimple.com/hc/en-ca */
export const HELP_CENTER_CATEGORY_ORDER = [
  "Get Started",
  "Move Money",
  "Investing",
  "Spending",
  "File Taxes",
  "Your Profile",
  "Group Plans",
  "Promotions",
  "Referrals",
] as const;

const CATEGORY_ALIASES: Record<string, (typeof HELP_CENTER_CATEGORY_ORDER)[number]> = {
  spend: "Spending",
  "group plans": "Group Plans",
};

function categoryRank(name: string): number {
  const normalized = name.trim().toLowerCase();
  const alias = CATEGORY_ALIASES[normalized];
  const canonical = alias ?? name;
  const index = HELP_CENTER_CATEGORY_ORDER.findIndex(
    (category) => category.toLowerCase() === canonical.toLowerCase(),
  );
  return index === -1 ? HELP_CENTER_CATEGORY_ORDER.length : index;
}

export function compareHelpCenterCategories(a: string, b: string): number {
  const rankDiff = categoryRank(a) - categoryRank(b);
  if (rankDiff !== 0) return rankDiff;
  return a.localeCompare(b);
}

export function sortHelpCenterCategories(categories: string[]): string[] {
  return [...categories].sort(compareHelpCenterCategories);
}

const categoryIcons: Record<string, LucideIcon> = {
  "All categories": Layers,
  "Get Started": Sparkles,
  "Move Money": ArrowLeftRight,
  Investing: Landmark,
  Spending: Wallet,
  Spend: Wallet,
  "File Taxes": Receipt,
  "Your Profile": User,
  "Group Plans": UsersRound,
  "Group plans": UsersRound,
  Promotions: Gift,
  Referrals: UserPlus,
};

const categoryDescriptions: Record<string, string> = {
  "All categories": "A mixed quiz drawn from every topic in the Help Center.",
  "Get Started": "Account setup, onboarding, and your first steps.",
  "Move Money": "Deposits, withdrawals, transfers, and funding.",
  Investing: "Portfolios, trades, and investing fundamentals.",
  Spending: "Cash cards, spending accounts, and everyday payments.",
  Spend: "Cash cards, spending accounts, and everyday payments.",
  "File Taxes": "Tax slips, filing, and contribution deadlines.",
  "Your Profile": "Settings, security, and account preferences.",
  "Group Plans": "Employer plans, GRSPs, and group benefits.",
  "Group plans": "Employer plans, GRSPs, and group benefits.",
  Promotions: "Bonuses, offers, and limited-time promotions.",
  Referrals: "Invite friends and earn referral rewards.",
};

type CategoryStyle = {
  icon: string;
  ring: string;
};

const categoryStyles: Record<string, CategoryStyle> = {
  "All categories": {
    icon: "from-violet-500/20 to-indigo-500/10 text-violet-700 dark:text-violet-300",
    ring: "group-hover:shadow-violet-500/10",
  },
  "Get Started": {
    icon: "from-sky-500/20 to-blue-500/10 text-sky-700 dark:text-sky-300",
    ring: "group-hover:shadow-sky-500/10",
  },
  "Move Money": {
    icon: "from-teal-500/20 to-emerald-500/10 text-teal-700 dark:text-teal-300",
    ring: "group-hover:shadow-teal-500/10",
  },
  Investing: {
    icon: "from-rose-500/20 to-pink-500/10 text-rose-700 dark:text-rose-300",
    ring: "group-hover:shadow-rose-500/10",
  },
  Spending: {
    icon: "from-violet-500/20 to-purple-500/10 text-violet-700 dark:text-violet-300",
    ring: "group-hover:shadow-violet-500/10",
  },
  Spend: {
    icon: "from-violet-500/20 to-purple-500/10 text-violet-700 dark:text-violet-300",
    ring: "group-hover:shadow-violet-500/10",
  },
  "File Taxes": {
    icon: "from-emerald-500/20 to-green-500/10 text-emerald-700 dark:text-emerald-300",
    ring: "group-hover:shadow-emerald-500/10",
  },
  "Your Profile": {
    icon: "from-amber-500/20 to-orange-500/10 text-amber-700 dark:text-amber-300",
    ring: "group-hover:shadow-amber-500/10",
  },
  "Group Plans": {
    icon: "from-orange-500/20 to-amber-500/10 text-orange-700 dark:text-orange-300",
    ring: "group-hover:shadow-orange-500/10",
  },
  "Group plans": {
    icon: "from-orange-500/20 to-amber-500/10 text-orange-700 dark:text-orange-300",
    ring: "group-hover:shadow-orange-500/10",
  },
  Promotions: {
    icon: "from-fuchsia-500/20 to-pink-500/10 text-fuchsia-700 dark:text-fuchsia-300",
    ring: "group-hover:shadow-fuchsia-500/10",
  },
  Referrals: {
    icon: "from-cyan-500/20 to-sky-500/10 text-cyan-700 dark:text-cyan-300",
    ring: "group-hover:shadow-cyan-500/10",
  },
};

const fallbackStyles: CategoryStyle[] = [
  {
    icon: "from-violet-500/20 to-violet-500/10 text-violet-700 dark:text-violet-300",
    ring: "group-hover:shadow-violet-500/10",
  },
  {
    icon: "from-emerald-500/20 to-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    ring: "group-hover:shadow-emerald-500/10",
  },
  {
    icon: "from-sky-500/20 to-sky-500/10 text-sky-700 dark:text-sky-300",
    ring: "group-hover:shadow-sky-500/10",
  },
];

export function getCategoryIcon(category: string): LucideIcon {
  return categoryIcons[category] ?? BookOpen;
}

export function getCategoryDescription(category: string): string | undefined {
  return categoryDescriptions[category];
}

export function getCategoryStyle(category: string, index = 0): CategoryStyle {
  return categoryStyles[category] ?? fallbackStyles[index % fallbackStyles.length]!;
}
