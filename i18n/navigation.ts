import Link from 'next/link';
import { redirect } from 'next/navigation';

// Re-export Next.js navigation APIs
// Note: useRouter and usePathname are client-only hooks and should be imported directly from 'next/navigation' in client components
export { Link, redirect };
