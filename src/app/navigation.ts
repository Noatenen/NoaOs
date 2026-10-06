import type { IconName } from '../components/Icon'

// The single list of NoaOS areas. Sidebar, mobile nav and routes all read from here,
// so adding/renaming an area is one edit. Labels are Hebrew drafts (docs/UX_ARCHITECTURE.md).
export interface NavItem {
  path: string
  label: string
  icon: IconName
  group: 'primary' | 'secondary'
  // Where the item lives on narrow screens: in the bottom bar, or inside the "more" sheet.
  mobile: 'bar' | 'more'
}

export const navItems: NavItem[] = [
  { path: '/today', label: 'היום', icon: 'today', group: 'primary', mobile: 'bar' },
  { path: '/tasks', label: 'משימות', icon: 'tasks', group: 'primary', mobile: 'bar' },
  { path: '/me', label: 'אני', icon: 'me', group: 'primary', mobile: 'more' },
  { path: '/brain', label: 'המוח', icon: 'brain', group: 'primary', mobile: 'bar' },
  { path: '/journal', label: 'יומן', icon: 'journal', group: 'primary', mobile: 'more' },
  { path: '/work', label: 'עבודה', icon: 'work', group: 'primary', mobile: 'bar' },
  { path: '/my-noa', label: 'נועה שלי', icon: 'myNoa', group: 'primary', mobile: 'more' },
  { path: '/noa-ai', label: 'Noa AI', icon: 'noaAi', group: 'secondary', mobile: 'more' },
  { path: '/settings', label: 'הגדרות', icon: 'settings', group: 'secondary', mobile: 'more' },
]
