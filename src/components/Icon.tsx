// A tiny hand-made icon set (inline SVG, no icon library).
// None of these are directional, so none need mirroring in RTL.

export type IconName =
  | 'today'
  | 'tasks'
  | 'me'
  | 'brain'
  | 'journal'
  | 'work'
  | 'myNoa'
  | 'noaAi'
  | 'settings'
  | 'more'
  | 'close'

const paths: Record<IconName, string> = {
  today: 'M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z',
  tasks: 'M5 5h14v14H5zM8.5 12l2.5 2.5 4.5-5',
  me: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
  brain: 'M12 3v3M12 18v3M3 12h3M18 12h3M12 8l1.2 2.8L16 12l-2.8 1.2L12 16l-1.2-2.8L8 12l2.8-1.2Z',
  journal: 'M6 4h10a2 2 0 0 1 2 2v14H8a2 2 0 0 1-2-2zM6 18a2 2 0 0 1 2-2h10M10 8h5',
  work: 'M4 8h16v11H4zM9 8V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M4 13h16',
  myNoa: 'M12 4l2.3 4.9 5.2.6-3.9 3.6 1.1 5.2L12 15.7l-4.7 2.6 1.1-5.2-3.9-3.6 5.2-.6Z',
  noaAi: 'M9 4l1.4 3.6L14 9l-3.6 1.4L9 14l-1.4-3.6L4 9l3.6-1.4ZM17 13l.9 2.1L20 16l-2.1.9L17 19l-.9-2.1L14 16l2.1-.9Z',
  settings: 'M5 7h9M18 7h1M5 17h3M12 17h7M16 5v4M10 15v4',
  more: 'M6 12h.01M12 12h.01M18 12h.01',
  close: 'M6 6l12 12M18 6L6 18',
}

interface IconProps {
  name: IconName
  size?: number
}

export function Icon({ name, size = 22 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={name === 'more' ? 3 : 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}
